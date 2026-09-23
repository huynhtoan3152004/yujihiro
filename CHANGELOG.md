# Changelog

Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/). Phiên bản theo [SemVer](https://semver.org/lang/vi/). Bản ghi tự động từng PR nằm ở [docs/changelog/merge-log.md](docs/changelog/merge-log.md).

## [Unreleased]

### Added
- Site tài liệu Docusaurus trong `website/`, đọc trực tiếp `docs/`; deploy GitHub Pages từ `main`.
- CI: lint/build frontend, test backend (Testcontainers), build docs, kiểm tra tiêu đề PR, nhắc cập nhật docs.
- Merge log tự động (`docs/changelog/merge-log.md`) sau mỗi PR merge vào `main`.
- Bộ rule cho AI tool: `AGENTS.md`, `CLAUDE.md`, `.claude/skills/*`, Cursor/Copilot/Gemini pointers.
- Tài liệu 15 (DB v4), 16 (repo strategy), 17 (FE audit), 18 (references/graphify), 19 (docs workflow).
- Khu vực mentor: `docs/mentor/` với syllabus, checklist review, 2 bài học đầu, learning log.
- Git hooks: `commit-msg` (Conventional Commits), `pre-commit` (chặn secret/file lớn).
- Docs site: Tailwind v4 + component shadcn thật (`Button/Card/Badge/Alert/Tabs/Separator`) trong `website/src/components/ui`, đăng ký toàn cục cho `.mdx` qua `website/src/theme/MDXComponents.tsx`; trang chủ `docs/README.mdx` dùng Card/Badge làm ví dụ. Infima (chrome do Docusaurus tự render) đọc cùng bộ token màu VS Code để đồng bộ brand mà không cần swizzle nội bộ.
- ADR-012 (`docs/02-stack-decisions.md`): deploy FE trên Vercel + BE trên VPS, cùng origin qua rewrite proxy, không tách repo. `frontend-portfolio/vercel.json` (rewrite `/api/*`) và hướng dẫn Root Directory/Ignored Build Step ở `docs/16-repository-strategy.md`.
- CI/CD tách theo app: `backend.yml` (test Testcontainers → Docker image lên GHCR → deploy VPS qua SSH, bật bằng biến `BACKEND_DEPLOY`), `frontend.yml` (lint + build; deploy qua Vercel Git integration + Deployment Checks). `backend-portfolio/Dockerfile` (multi-stage, layered jar, user không phải root). Tài liệu 20 (CI/CD, secret, chuẩn bị VPS, rollback, thiết lập GitHub lần đầu).
- `.github/dependabot.yml` (hằng tháng, gom nhóm, bỏ qua major), issue template, `.vscode/settings.json` ẩn `.claude/.cursor/.kilo` khỏi Explorer, `.vscode/extensions.json`.

### Changed
- Đổi tên thư mục: `portfolio/` → `backend-portfolio/`, `FE/` → `frontend-portfolio/`; cập nhật đường dẫn trong docs, rule AI, workflow.
- `ci.yml` thành "Repo checks" (tiêu đề PR, build docs, nhắc docs); bỏ job tổng `CI OK` — check bắt buộc giờ là từng job, job skip do không đổi = pass.
- `merge-log.yml` push bằng deploy key `MERGE_LOG_DEPLOY_KEY` + `[skip ci]` để chạy được khi `main` có ruleset.
- `frontend-portfolio/vercel.json` thêm `ignoreCommand` (bỏ build khi frontend không đổi), thay cấu hình tay trong dashboard.
- `docs/README.md` → `docs/README.mdx` (trang duy nhất dùng JSX/shadcn; 19 tài liệu kỹ thuật còn lại giữ `.md` thuần — lý do ở tài liệu 17).
- Thiết kế DB: bổ sung `media_assets` vào MVP; `projects` thêm category/role/period/highlights/cover; posts dùng `series_slug/position` thay bảng series (tài liệu 15 thay thế 14 làm baseline).

### Removed
- `BE/` (Express + Prisma cũ) xóa khỏi repo trước commit đầu tiên.
