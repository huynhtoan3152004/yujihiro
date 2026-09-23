# Syllabus — bài học bám theo backlog 18 sprint

Mỗi bài học tương ứng một phần của [backlog](../12-delivery-backlog.md). Bài có: **mục tiêu học**, **sản phẩm** (PR merge được), **tiêu chí đạt** (đo được), và **câu hỏi kiểm tra** mentor sẽ hỏi. Không nhảy bài khi bài trước chưa "Đạt".

Trạng thái: ⬜ chưa bắt đầu · 🟨 đang làm · ✅ đạt. Cập nhật cột trạng thái trong PR của bài đó.

## Giai đoạn A — Nền tảng (Sprint 01–02)

| # | Bài | Mục tiêu học | Sản phẩm | Trạng thái |
|---|---|---|---|---|
| 01 | [Foundation: repo, git, chạy được hai bên](lessons/lesson-01-foundation.md) | Git flow của repo, Gradle/Docker/Testcontainers, cấu hình datasource qua env | PR `chore(repo): initial setup` + `chore(be): datasource profiles` | ⬜ |
| 02 | [First slice: Project entity → migration → public GET](lessons/lesson-02-first-slice.md) | Flyway, JPA entity/BaseAuditableEntity, DTO/mapper, controller đọc, test với Testcontainers | `GET /api/v1/public/projects` trả dữ liệu seed | ⬜ |
| 03 | FE: React Router + Tailwind v4 + dùng shadcn thật | Routing, layout, design token, sửa 4 finding mức cao ở tài liệu 17 | 6 trang có URL, `Button/Card/Badge` dùng thật | ⬜ |
| 04 | Admin: session cookie + CSRF + login | SecurityFilterChain, PasswordEncoder, CSRF cho SPA, bootstrap admin | AC-001.1–001.3 có test | ⬜ |
| 05 | Publish workflow + optimistic lock | `@Version`, 409, transaction, state machine DRAFT→PUBLISHED→ARCHIVED | AC-002.1–002.4 có test; FE admin form | ⬜ |

**Gate A**: một project thật hiển thị ở `/projects/:slug`, unpublish trả 404, deploy được bằng Docker Compose.

## Giai đoạn B — Nội dung (Sprint 03–04)

| # | Bài | Mục tiêu học | Sản phẩm | Trạng thái |
|---|---|---|---|---|
| 06 | site_profile + JSONB có kiểu | `@JdbcTypeCode(JSON)`, DTO validate mảng, singleton row | AC-001.4–001.7 | ⬜ |
| 07 | media_assets + upload | Multipart, allowlist mime, lưu file, phục vụ ảnh có cache header | Cover cho project | ⬜ |
| 08 | posts + Markdown pipeline | react-markdown an toàn, tags text[] + GIN, reading_minutes tính khi save | Blog list/detail; AC-003.1–003.3 | ⬜ |
| 09 | SEO/metadata + rendering ADR | Prerender/SSR với React Router, canonical, sitemap | AC-003.4 + ADR mới | ⬜ |
| 10 | Backup/restore lần đầu | pg_dump/restore, runbook | `docs/evidence/backup-restore-01.md` | ⬜ |

**Gate B**: portfolio + blog public, có 2 case study và 2 bài viết thật.

## Giai đoạn C — Learning Hub (Sprint 05–10)

| # | Bài | Mục tiêu học | Trạng thái |
|---|---|---|---|
| 11 | lessons/problems/sources/solutions: 5 bảng, FK, unique kép | Thiết kế quan hệ, ON DELETE, index FK | ⬜ |
| 12 | Roadmap: sections/items, CHECK XOR, deferrable unique, reorder transaction | Ràng buộc nâng cao PostgreSQL | ⬜ |
| 13 | Guest progress local + export/import có schema version | localStorage, zod, versioning dữ liệu client | ⬜ |
| 14 | Trace engine + player (binary search, two pointers) | Pure function, fixtures, Vitest | ⬜ |
| 15 | 4 visualizer còn lại + a11y (keyboard, reduced motion) | Web Worker, cancel, text fallback | ⬜ |

## Giai đoạn D — Vận hành & mở rộng (Sprint 11–18)

| # | Bài | Mục tiêu học | Trạng thái |
|---|---|---|---|
| 16 | OpenAPI + contract test | springdoc, kiểm tra response theo schema | ⬜ |
| 17 | Redis cache theo revision + rate limit | Cache invalidation, atomic counter, outage fallback | ⬜ |
| 18 | RAG: pgvector, durable jobs, citations, eval set | Spring AI, lease/locking, idempotency | ⬜ |
| 19 | Habit/Vision private | Timezone, unique per local date, signed asset | ⬜ |
| 20 | Hardening: perf, a11y, restore drill, runbook, release v1 | SRE cơ bản | ⬜ |

## Kỹ năng xuyên suốt (được chấm trong mọi review)

- Đặt tên, tách layer đúng (tài liệu 13), không để nghiệp vụ trong controller.
- Test đúng thứ đáng test (state transition, quyền, constraint), không test getter.
- Commit nhỏ, message đúng chuẩn, PR có mô tả "vì sao".
- Docs đổi cùng code.
