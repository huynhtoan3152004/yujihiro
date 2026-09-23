---
name: db-migration
description: Review migration Flyway và thay đổi schema PostgreSQL trong repo Portfolio theo docs/15-database-design-v4.md. Dùng khi người dùng thêm/sửa file trong backend-portfolio/src/main/resources/db/migration hoặc hỏi về thiết kế bảng, index, constraint, JPA mapping.
---

# DB migration review

## Đọc trước
`docs/15-database-design-v4.md` (baseline), `docs/14-minimal-database-design.md` (lý do), mục "Dữ liệu" của spec đang làm.

## Checklist
- Tên file `V<n>__<snake_case>.sql`, n tăng liên tục; không sửa migration đã merge vào `main` (tạo V mới).
- Thứ tự tạo bảng theo FK (bảng được tham chiếu trước).
- Mỗi cột: kiểu đúng (`timestamptz` cho thời điểm, `date` cho ngày, `text` + CHECK cho enum, `uuid` PK), NOT NULL có chủ đích, DEFAULT hợp lý.
- Ràng buộc bắt buộc theo tài liệu 15: UNIQUE slug/email, CHECK status, CHECK `status <> 'PUBLISHED' OR published_at IS NOT NULL`, FK có `ON DELETE` rõ (SET NULL cho cover, RESTRICT cho nội dung được tham chiếu).
- Index: partial index public list; GIN chỉ khi có filter mảng; không index trùng UNIQUE.
- Seed dev tách migration riêng và chỉ ở location của profile local; không seed vào prod.
- Với ALTER trên bảng có dữ liệu: có backfill trước SET NOT NULL; có kế hoạch rollback (migration bù, không phải xóa file).
- JPA khớp: `ddl-auto=validate` pass; enum Java khớp CHECK; `@Version` với cột `version bigint`.
- Test: migration chạy trên DB rỗng bằng Testcontainers; test constraint bị vi phạm bằng JDBC cho CHECK quan trọng.

## Đầu ra
Finding theo mức độ với số dòng trong file SQL, kèm câu hỏi dẫn. Có thể nêu **tên** constraint/cột còn thiếu và cú pháp PostgreSQL ≤ 3 dòng để tra, không viết lại cả migration.

## Câu hỏi thường dùng để kiểm tra hiểu bài
- Vì sao `published_at` giữ nguyên khi unpublish?
- Partial index dùng khi nào? Kiểm tra bằng `EXPLAIN` thế nào?
- Deferrable unique giải quyết vấn đề gì khi reorder?
- Khi nào `text[]` nên trở thành bảng join?
