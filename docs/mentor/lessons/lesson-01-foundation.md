# Lesson 01 — Foundation: repo, git, chạy được hai bên

Trạng thái: ⬜ · Thời lượng dự kiến: 2 buổi · Sprint 01

## Mục tiêu học

1. Hiểu và dùng được quy trình git của repo (nhánh, Conventional Commits, PR, hook).
2. Chạy được backend với PostgreSQL thật (Docker) và test với Testcontainers.
3. Chạy được frontend, hiểu vì sao lint đang có 3 lỗi.
4. Hiểu monorepo được tổ chức thế nào và vì sao (tài liệu 16).

## Đề bài

### Phần 1 — Git (30 phút)

1. Kích hoạt hook: `git config core.hooksPath .githooks`. Thử commit với message `update stuff` và xem hook từ chối. Đọc `.githooks/commit-msg` và giải thích regex bằng lời.
2. Commit đầu tiên đã được Claude tạo theo yêu cầu (23/09/2026). Chạy `git show --stat HEAD` và trả lời: commit gồm những nhóm file nào, vì sao `node_modules/`, `build/`, `dist/` không có mặt, và file nào quyết định điều đó?
3. Tạo remote GitHub, push `main`, làm đủ các bước trong [tài liệu 20 mục 3](../../20-ci-cd.md#3-thiết-lập-github-lần-đầu-làm-một-lần) (Pages, squash merge, deploy key, ruleset). Xem workflow `docs-deploy.yml` chạy và mở site docs.
4. (Việc đổi tên thư mục đã làm trước commit đầu: `backend-portfolio/`, `frontend-portfolio/`.) Tạo nhánh `docs/lesson-01-first-pr`, thêm mục Lesson 01 vào learning log, mở PR. Quan sát: vì sao `Backend · test` hiện *skipped* mà PR vẫn merge được? Merge, rồi kiểm tra `docs/changelog/merge-log.md` có dòng mới.

### Phần 2 — Backend chạy thật (60–90 phút)

5. Viết `docker-compose.yml` ở root với một service `postgres` (pin tag, ví dụ `postgres:17`), volume, healthcheck. **Tự viết**, không copy.
6. Cấu hình datasource trong `application.yaml` **qua biến môi trường** (`SPRING_DATASOURCE_URL`…) và một profile `local` cho máy bạn; không commit mật khẩu. Đọc tài liệu Spring về *externalized configuration* trước.
7. Đổi `TestcontainersConfiguration` từ `postgres:latest` sang tag cố định giống compose. Chạy `./gradlew.bat test` và dán kết quả.
8. Đặt `spring.jpa.hibernate.ddl-auto=validate` và `spring.flyway.enabled=true`. Chạy `bootRun`, mở `/actuator/health`. Flyway chưa có migration nào — nó nói gì trong log?

### Phần 3 — Frontend (30 phút)

9. Chạy `npm run lint`. Đọc 3 lỗi `react-refresh/only-export-components`. Câu hỏi: vì sao shadcn export `buttonVariants` cùng file `Button`, và có hai cách xử lý nào (sửa file hay sửa rule)? Chọn một và giải thích trong PR.
10. Chuyển `shadcn` từ `dependencies` sang `devDependencies`; gỡ thư viện không dùng theo tài liệu 17 mục 2 (giữ `react-router-dom`). Build pass.

## Tiêu chí đạt

- [ ] Hook từ chối commit sai chuẩn; ít nhất 3 PR đã merge và có trong merge log.
- [ ] `./gradlew.bat test` pass với Testcontainers tag cố định; `bootRun` lên với Postgres trong Docker; health = UP.
- [ ] `npm run lint` 0 lỗi, `npm run build` pass.
- [ ] Site docs deploy được từ `main`.
- [ ] Learning log có mục Lesson 01 với ít nhất một "điều tôi hiểu sai lúc đầu".

## Câu hỏi mentor sẽ hỏi

- Squash merge khác merge commit ở điểm gì với lịch sử `main`? Vì sao repo chọn squash?
- Testcontainers khởi động DB ở đâu, và vì sao test không dùng DB trong compose?
- `ddl-auto=validate` bảo vệ bạn khỏi lỗi gì mà `update` không?
- Vì sao biến môi trường tốt hơn file `application-local.yaml` commit vào repo?

## Bẫy thường gặp

- Docker Desktop chưa chạy → Testcontainers báo `Could not find a valid Docker environment`.
- Gradle wrapper lần đầu tải Gradle 9.7 khá lâu; không phải treo.
- Trên Windows, hook shell chạy qua Git Bash; nếu hook không chạy, kiểm tra `core.hooksPath` và quyền file.
