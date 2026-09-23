// Thêm một dòng vào docs/changelog/merge-log.md từ JSON của `gh pr view`.
// Dùng: node .github/scripts/merge-log.mjs pr.json docs/changelog/merge-log.md
// Thuần Node, không dependency, để chạy được trên runner và local khi cần thử.

import {readFileSync, writeFileSync} from 'node:fs';

const [, , prJsonPath, logPath] = process.argv;
if (!prJsonPath || !logPath) {
  console.error('Usage: merge-log.mjs <pr.json> <merge-log.md>');
  process.exit(2);
}

const pr = JSON.parse(readFileSync(prJsonPath, 'utf8'));
let md = readFileSync(logPath, 'utf8');

// --- Phân tích tiêu đề Conventional Commits ---
const m = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<bang>!)?:\s*(?<subject>.+)$/.exec(pr.title.trim());
const type = m?.groups?.type ?? '—';
const scope = m?.groups?.scope ?? '—';
const subject = (m?.groups?.subject ?? pr.title).trim();
const breaking = Boolean(m?.groups?.bang);

// --- Thư mục bị chạm ---
const areaOf = (p) => {
  if (/^(portfolio|backend)\//.test(p)) return 'backend';
  if (/^(FE|frontend)\//.test(p)) return 'frontend';
  if (/^(docs|website)\//.test(p) || p === 'CHANGELOG.md') return 'docs';
  if (/^\.github\//.test(p)) return 'ci';
  return 'repo';
};
const areas = [...new Set((pr.files ?? []).map((f) => areaOf(f.path)))].sort().join(', ') || '—';

const labels = (pr.labels ?? []).map((l) => l.name);
const isMajor = breaking || labels.includes('major') || labels.includes('release');
const date = (pr.mergedAt ?? new Date().toISOString()).slice(0, 10);
const author = pr.author?.login ? `@${pr.author.login}` : '—';
const link = `[#${pr.number}](${pr.url})`;
const esc = (s) => String(s).replace(/\|/g, '\\|');

const row = `| ${date} | ${link} | ${esc(type)} | ${esc(scope)} | ${isMajor ? `**${esc(subject)}**` : esc(subject)} | ${author} | ${areas} | ${labels.map(esc).join(', ') || '—'} |`;

// Idempotent: nếu PR đã có dòng thì không thêm nữa.
if (md.includes(`[#${pr.number}](`)) {
  console.log(`PR #${pr.number} đã có trong merge log, bỏ qua.`);
  process.exit(0);
}

const insertAfter = (text, marker, line) => {
  const idx = text.indexOf(marker);
  if (idx === -1) throw new Error(`Không tìm thấy marker ${marker} trong ${logPath}`);
  const end = idx + marker.length;
  return text.slice(0, end) + '\n' + line + text.slice(end);
};

// Dòng mới nhất lên đầu bảng (ngay sau MERGES:START).
md = insertAfter(md, '<!-- MERGES:START -->', row);

if (isMajor) {
  const bullet = `- ${date} — ${link} ${esc(type)}(${esc(scope)}): ${esc(subject)}${breaking ? ' — BREAKING' : ''}`;
  md = insertAfter(md, '<!-- MAJOR:START -->', bullet);
}

writeFileSync(logPath, md);
console.log(`Đã ghi PR #${pr.number} (${type}/${scope}, major=${isMajor}) vào ${logPath}`);
