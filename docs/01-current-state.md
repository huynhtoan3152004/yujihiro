# Hiện trạng và khoảng cách đến sản phẩm

Baseline v3 — kiểm tra mã nguồn ngày 22/09/2026. Tài liệu mô tả nội dung có trong workspace, không khẳng định ứng dụng đã chạy hoặc test đã pass.

## Frontend trong frontend-portfolio/

React 19, TypeScript, Vite 8, Tailwind CSS 3, Framer Motion, Radix/shadcn và React Router nằm trong package.json. App.tsx đang chọn trang qua activeFile; main.tsx chưa gắn router.

| Thành phần | Đã có | Việc cần làm |
|---|---|---|
| App và layout | Shell VS Code, explorer, editor tabs | URL route và ba layout public riêng |
| siteData.ts | Profile, stats, socials, projects, blog summaries, contact | Chuyển nội dung sang API |
| HomePage | Hero, typewriter, stats, socials | Nối CTA, nguồn số liệu thật |
| AboutPage | Bio và Current Focus | CMS cho cả nội dung hardcoded |
| SkillsPage | Kỹ năng ghi trực tiếp trong component | API theo nhóm/thứ tự |
| ProjectsPage | Cards, stack, links | Case study detail, slug, publish |
| BlogPage | Summary trình bày dạng code | BlogLayout, bài Markdown, tag/series |
| ContactPage | Thông tin liên hệ | CMS và liên kết hoạt động |

Các điểm tích hợp cần xử lý:
- Chưa thấy API client gọi backend trong frontend-portfolio/src.
- README trong explorer có cấu hình nhưng thiếu render case riêng.
- Đóng tab cuối chưa đưa editor về trạng thái trống.
- Các mục activity bar chưa có nội dung riêng tương ứng.
- Home/About render bio bằng dangerouslySetInnerHTML; khi nối CMS phải chuyển sang pipeline Markdown an toàn.
- Dữ liệu thành tích hiện là mẫu; chỉ public khi đã thay bằng thông tin thật.
- Cần loading/error/empty, back/forward, refresh URL và mobile reading layout.

## Backend đang có trong backend-portfolio/

| Cấu hình | Giá trị đọc từ source |
|---|---|
| Build | build.gradle, Gradle Wrapper |
| Spring Boot | 4.1.1 |
| Java toolchain | 21 |
| Group/package | dev.yujihiro / dev.yujihiro.portfolio |
| Application | PortfolioApplication |
| Configuration | application.yaml, hiện mới có application name |
| Persistence | JPA, PostgreSQL driver, Flyway và PostgreSQL Flyway module |
| Web/security | MVC, Validation, Security, Actuator |
| Tests | Spring test starters, Testcontainers PostgreSQL |

Đã có skeleton và cấu hình Testcontainers. Chưa có nghiệp vụ CMS/learning/RAG, datasource ứng dụng, migration domain hoặc SecurityFilterChain của sản phẩm. TestcontainersConfiguration đang dùng image postgres:latest; khi triển khai cần pin tag đã chọn đồng bộ môi trường chạy thật.

Thư mục backend-portfolio/ là backend chính từ baseline này. Dùng Gradle Wrapper hiện có; không tạo lại backend ở thư mục khác.

## Trạng thái tài liệu và chuyển tiếp

Các tài liệu gốc đã được chuẩn hóa thành trang tổng quan/dẫn đường. Bộ docs/ là thiết kế duy nhất cho việc triển khai tiếp. Thư mục Node/Prisma cũ (BE/) đã bị xóa khỏi working tree trước commit đầu tiên (23/09/2026); `portfolio/` và `FE/` đổi tên thành `backend-portfolio/` và `frontend-portfolio/`.

Lần chỉnh sửa này chỉ viết tài liệu. Chưa chạy build, test hoặc server; chưa sửa cấu hình và chưa di chuyển dữ liệu.
