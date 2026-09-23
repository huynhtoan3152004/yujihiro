# Lesson 02 — First slice: Project entity → migration → public GET

Trạng thái: ⬜ · Thời lượng dự kiến: 3 buổi · Sprint 01 · Spec: SPEC-002 (phần đọc public)

## Mục tiêu học

1. Viết migration Flyway đầu tiên đúng thiết kế tài liệu 15 (chỉ `projects` và `media_assets`; `admin_accounts` để bài 04).
2. Map entity JPA với UUID v7, `text[]`, `jsonb`, enum ↔ CHECK, `@Version`.
3. Tách layer đúng: repository → service → mapper → DTO → controller.
4. Viết test tích hợp có giá trị với Testcontainers.

## Trước khi code: kế hoạch 5 dòng

Gửi mentor kế hoạch gồm: tên migration, danh sách class sẽ tạo (đúng package theo tài liệu 13), endpoint và DTO, 3 test sẽ viết, câu hỏi còn mở. Mentor chỉ phản hồi kế hoạch, không viết code.

## Đề bài

### Bước 1 — Migration `V1__init_portfolio.sql`

- Tạo `media_assets` trước, rồi `projects` (vì FK). Đủ cột, CHECK, UNIQUE, partial index theo tài liệu 15 mục 3.3 và 3.5.
- Thêm một migration `V2__seed_dev_projects.sql` **chỉ chạy ở profile local** (tra "Flyway locations per profile") với 2 project: 1 PUBLISHED, 1 DRAFT.
- Chạy `./gradlew.bat test`: `contextLoads` phải pass với `ddl-auto=validate` — lúc này chưa có entity nên validate không có gì để so; ghi nhận điều đó.

### Bước 2 — Entity

- `BaseAuditableEntity` (`@MappedSuperclass`): `id`, `createdAt`, `updatedAt`, `version`.
- `Project` extends base; enum `ProjectCategory`, `LifecycleStatus`, `PublicationStatus` (`@Enumerated(STRING)`).
- `techStack` là `List<String>` map sang `text[]`; `highlights` là `List<Highlight>` (record) map sang `jsonb`. Tra `@JdbcTypeCode` và `SqlTypes`.
- Chạy test: validate giờ **có** entity để so. Sửa cho đến khi pass. Ghi vào log mỗi lỗi validate gặp và ý nghĩa.

### Bước 3 — Đọc public

- `ProjectRepository`: một method trả trang các project PUBLISHED sắp theo `featured DESC, sort_order, published_at DESC`; một method tìm theo slug **và** status PUBLISHED.
- `ProjectSummaryResponse` (không có body) và `ProjectDetailResponse` (có body). Mapper viết tay.
- `ProjectService` (interface nếu bạn muốn luyện) + impl: `listPublished(page,size)`, `getPublishedBySlug(slug)` ném `ResourceNotFoundException`.
- `ProjectController` với `GET /api/v1/public/projects` và `GET /api/v1/public/projects/{slug}`. Response list theo contract tài liệu 04: `{items, page, size, total}`.
- `GlobalExceptionHandler` trả `application/problem+json` cho 404 và 400 (dùng `ProblemDetail` của Spring).
- Tạm thời cho phép public GET không cần auth trong `SecurityConfig` tối thiểu (bài 04 làm đầy đủ).

### Bước 4 — Test

Ba test bắt buộc (`@SpringBootTest` + Testcontainers + MockMvc/RestTestClient):

1. List chỉ trả project PUBLISHED, đúng thứ tự.
2. Detail slug DRAFT → 404 với body problem+json, không lộ title.
3. Insert trực tiếp một row `status='PUBLISHED', published_at=NULL` bằng JDBC → DB phải từ chối (CHECK). Đây là test bảo vệ constraint, không phải test service.

## Tiêu chí đạt

- [ ] `curl localhost:8080/api/v1/public/projects` trả 1 project seed; slug DRAFT trả 404.
- [ ] 3 test pass; `ddl-auto=validate` pass.
- [ ] Không có nghiệp vụ trong controller; entity không xuất hiện trong response.
- [ ] PR mô tả có phần "Quyết định": vì sao chọn cách map `text[]`/`jsonb` như vậy.
- [ ] Tài liệu 15 được cập nhật nếu bạn phải lệch thiết kế (ghi rõ lý do).

## Câu hỏi mentor sẽ hỏi

- UUID v7 khác v4 ở đâu về index B-tree? Nếu dùng `gen_random_uuid()` ở DB thay vì sinh ở Java thì `@Version`/`persist` khác gì?
- Partial index `WHERE status='PUBLISHED'` được planner dùng khi nào? Làm sao kiểm tra (`EXPLAIN`)?
- `ProblemDetail` của Spring là gì và tại sao không tự viết class lỗi?
- Vì sao test số 3 phải dùng JDBC chứ không qua service?

## Bẫy thường gặp

- Quên `@JdbcTypeCode(SqlTypes.ARRAY)` → validate báo `wrong column type`.
- `published_at` là `timestamptz` → dùng `Instant`/`OffsetDateTime`, không `LocalDateTime`.
- Trả `Page<Project>` từ controller → lộ entity và cấu trúc Page của Spring; phải map sang DTO list của contract.
