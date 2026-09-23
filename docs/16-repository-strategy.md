# Một repo hay hai repo? Quyết định và hệ quả

Baseline v4 — 22/09/2026. Câu hỏi: FE (React) và BE (Spring Boot) nên nằm chung một repository hay tách hai repository.

## Khuyến nghị: **monorepo** (một repo, hai thư mục), ít nhất đến khi có người thứ hai

Lý do quan trọng nhất không phải kỹ thuật: bạn là **một người**, vừa học vừa làm, và mục tiêu là **portfolio để người khác đọc**. Một repo là một câu chuyện hoàn chỉnh: docs, backend, frontend, CI, changelog cùng một chỗ, một lịch sử commit. Người tuyển dụng mở một link là thấy toàn bộ.

## So sánh thẳng

| Tiêu chí | Monorepo (đề xuất) | Hai repo |
|---|---|---|
| Thay đổi API contract (đổi DTO + đổi FE) | **1 PR, 1 review, atomic**; CI chạy cả hai | 2 PR, phải phối hợp thứ tự merge, dễ lệch version |
| Docs & ADR | Một `docs/`, một site Docusaurus, link tương đối sang code | Docs ở đâu? Repo thứ ba hoặc trùng lặp |
| Changelog / merge log | Một dòng thời gian | Hai dòng thời gian, khó kể "release v1 gồm gì" |
| CI/CD | Một workflow, path filter để chỉ chạy phần thay đổi | Đơn giản hơn mỗi bên, nhưng nhân đôi cấu hình |
| Clone/onboarding | 1 lệnh | 2 lệnh + hướng dẫn liên kết |
| Kích thước repo | Lớn hơn (node_modules không commit nên không đáng kể) | Nhỏ |
| Quyền truy cập riêng | Không tách được (public là public cả hai) | Có thể public FE, private BE |
| Deploy độc lập | Vẫn được: path filter + hai job deploy | Tự nhiên |
| Tool AI đọc context | Một AGENTS.md/CLAUDE.md, thấy cả hai bên khi review contract | Mỗi repo một bộ rule, AI không thấy phía bên kia |
| Học "quản lý dự án thật" | Học path-filter CI, ownership thư mục, conventional commits với scope | Học phối hợp version giữa service (giá trị hơn khi có team) |

## Bất lợi thật của monorepo và cách xử lý

1. **CI chạy chậm khi mọi thứ chạy mỗi PR.** Xử lý: `paths` filter trong workflow — PR chỉ chạm `frontend-portfolio/` không chạy Gradle test. Đã cấu hình: mỗi app một workflow (`backend.yml`, `frontend.yml`), xem [tài liệu 20](20-ci-cd.md).
2. **Commit history trộn lẫn.** Xử lý: bắt buộc scope trong commit: `feat(be): ...`, `fix(fe): ...`, `docs: ...`. Hook `commit-msg` từ chối commit không có type.
3. **Gradle/Node ở hai thư mục làm IDE nhầm root.** Xử lý: mở IntelliJ ở `backend-portfolio/`, VS Code ở root với workspace file; đã có `.editorconfig` chung.
4. **Không tách quyền public/private.** Nếu ngày nào BE chứa thứ không muốn public (hiếm với portfolio), lúc đó tách BE ra — tách sau dễ hơn gộp sau (`git subtree split` giữ lịch sử).
5. **Khi Learning Hub lớn** (visualizer, content), FE có thể trở thành nhiều package. Lúc đó nâng cấp thành monorepo có workspace (npm workspaces/pnpm) — vẫn là một repo.

## Khi nào tách thành hai repo

Tách khi **ít nhất hai** điều sau đúng:

- Có người thứ hai chỉ làm một phía và không cần clone phía kia.
- BE cần lịch deploy/quyền truy cập khác FE (ví dụ BE private vì chứa cấu hình khách hàng).
- Bạn tách service (RAG worker) và muốn mỗi service một vòng đời release rõ ràng — lúc đó tách theo service, không phải theo FE/BE.

## Deploy FE trên Vercel, BE trên VPS — vẫn không cần tách repo

Câu hỏi thường gặp tiếp theo: "FE lên Vercel, BE lên VPS thì có phải tách repo không?" **Không.** Đây là quyết định đã chốt ở [ADR-012](02-stack-decisions.md#adr-012--deploy-fe-trên-vercel-be-trên-vps-cùng-origin-qua-rewrite-proxy); phần dưới là cách cấu hình cụ thể.

### Vercel đọc một thư mục con của monorepo

Trong Vercel dashboard → Project Settings → *Root Directory* = `frontend-portfolio`. Với thiết lập này Vercel: (1) chỉ chạy `npm ci && npm run build` trong thư mục đó; (2) mặc định vẫn trigger build trên **mọi** push vào nhánh theo dõi, kể cả push chỉ đổi `docs/` hoặc `backend-portfolio/`. Để bỏ qua build không liên quan, `frontend-portfolio/vercel.json` khai báo `ignoreCommand` (versioned trong repo, thay cho ô *Ignored Build Step* trong dashboard):

```json
"ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
```

Lệnh chạy tương đối theo Root Directory — exit code 0 nghĩa là "không đổi gì trong frontend-portfolio/, bỏ qua build".

### Cùng origin bằng rewrite, không phải CORS

Cách "tối ưu" không phải là bật CORS giữa `*.vercel.app` và VPS — đó là cách rẻ nhưng cookie/CSRF phức tạp hơn (`SameSite=None`, `Secure`, kiểm tra `Origin` thủ công). Cách đúng: để Vercel **proxy** `/api/*` sang VPS, browser chỉ thấy một origin. File `vercel.json` ở gốc `frontend-portfolio/`:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.<domain-that>/api/:path*" }
  ]
}
```

Với cấu hình này, FE gọi `fetch('/api/v1/public/projects')` như thể BE nằm cùng server — đúng giả định "cùng origin" mà ADR-004 (session cookie + CSRF) đã thiết kế từ đầu, không cần sửa gì ở BE.

### VPS cần gì trước khi rewrite hoạt động

1. Domain/subdomain trỏ vào VPS, HTTPS qua Caddy hoặc nginx + certbot (rewrite đích ngoài của Vercel cần TLS hợp lệ).
2. `SecurityConfig` của Spring chỉ cần biết một cookie domain (domain Vercel hoặc domain riêng nếu đã gắn), **không** cần cấu hình CORS cho origin Vercel vì browser không gọi thẳng VPS.
3. Endpoint upload file lớn (media) nên đi qua một subdomain riêng trỏ thẳng VPS, ngoài phạm vi rewrite, vì Vercel rewrite/edge có trần kích thước response theo gói dịch vụ.

### CI/CD mỗi phía một workflow

- `frontend.yml`: lint + build. Deploy vẫn do Vercel Git integration; **Deployment Checks** của Vercel chờ check `Frontend · lint + build` xanh rồi mới promote production.
- `backend.yml`: test → Docker image lên GHCR → SSH vào VPS `docker compose pull/up` service `backend` (Flyway chạy khi app khởi động).

Chi tiết secret, chuẩn bị VPS, rollback: [tài liệu 20](20-ci-cd.md).

## Cấu trúc thư mục đề xuất (đã áp dụng)

```text
Porfolio/
  AGENTS.md              # rule chung cho mọi AI tool (Claude, Cursor, Copilot, Gemini...)
  CLAUDE.md              # trỏ về AGENTS.md + phần riêng Claude Code
  CONTRIBUTING.md        # quy trình git, PR, commit, docs
  CHANGELOG.md           # Keep a Changelog, do người viết
  .githooks/             # commit-msg, pre-commit (không cần Node ở root)
  .github/workflows/     # backend.yml, frontend.yml, ci.yml, docs-deploy.yml, merge-log.yml
  .claude/skills/        # mentor, review, spec, git-workflow, db-migration, docs-sync
  docs/                  # nguồn sự thật tài liệu, Docusaurus đọc trực tiếp
  website/               # Docusaurus (chỉ config + theme, không chứa nội dung)
  backend-portfolio/     # Spring Boot backend (trước là portfolio/) + Dockerfile
  frontend-portfolio/    # React frontend (trước là FE/) + vercel.json
```

### Dọn dẹp đã làm (23/09/2026, trước commit đầu tiên)

- `portfolio/` → `backend-portfolio/`, `FE/` → `frontend-portfolio/` (tên do chủ repo chọn; tránh trùng `portfolio` với tên repo và artifact Gradle). `rootProject.name` vẫn là `portfolio`.
- `BE/` (Express + Prisma) đã xóa khỏi working tree. Tài liệu cũ còn nhắc `portfolio/`, `FE/`, `BE/` thì đọc theo tên mới.

## Quy ước để monorepo không thành đống lộn xộn

- Mỗi thư mục top-level có README riêng nói cách chạy.
- CI path filter: `frontend-portfolio/**` → `frontend.yml`; `backend-portfolio/**` → `backend.yml`; `docs/**`, `website/**` → job `Docs · build` trong `ci.yml`.
- PR chạm cả hai phía phải ghi rõ trong mô tả contract nào thay đổi và link spec.
- Không import chéo file giữa `frontend-portfolio/` và `backend-portfolio/`; contract chỉ đi qua OpenAPI (và về sau là client generate từ OpenAPI).
