# Portfolio · Blog · Learning Hub

Monorepo của Yujihiro: portfolio giao diện VS Code, blog cá nhân và Learning Hub DSA. Backend Java 21 / Spring Boot 4.1 / PostgreSQL; frontend React 19 / TypeScript / Vite / Tailwind / shadcn. Tài liệu thiết kế nằm trong `docs/` và được publish tự động bằng Docusaurus.

| Thư mục | Nội dung | Chạy |
|---|---|---|
| [`backend-portfolio/`](backend-portfolio/HELP.md) | Backend Spring Boot (Gradle) | `cd backend-portfolio && ./gradlew.bat test` |
| [`frontend-portfolio/`](frontend-portfolio/README.md) | Frontend React | `cd frontend-portfolio && npm ci && npm run dev` |
| [`docs/`](docs/README.mdx) | Tài liệu thiết kế, spec, ADR, bài học | — |
| [`website/`](website/README.md) | Site docs (Docusaurus) đọc `docs/` | `cd website && npm ci && npm start` |

## Bắt đầu

1. Đọc [docs/README.mdx](docs/README.mdx) để nắm tổng quan, rồi [docs/16-repository-strategy.md](docs/16-repository-strategy.md) để hiểu cách repo tổ chức.
2. Thiết lập git hook: `git config core.hooksPath .githooks`. Quy trình ở [CONTRIBUTING.md](CONTRIBUTING.md); CI/CD và thiết lập GitHub/Vercel/VPS ở [docs/20-ci-cd.md](docs/20-ci-cd.md).
3. Đang học theo [docs/mentor/syllabus.md](docs/mentor/syllabus.md); AI tool đóng vai mentor theo [AGENTS.md](AGENTS.md).

## Trạng thái

Skeleton. Chưa có migration, entity hay API. Bài học đầu tiên: [Lesson 01](docs/mentor/lessons/lesson-01-foundation.md). Lịch sử thay đổi: [CHANGELOG.md](CHANGELOG.md) và [merge log](docs/changelog/merge-log.md).
