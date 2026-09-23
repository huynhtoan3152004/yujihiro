# Thiết kế dữ liệu

**Baseline triển khai mới:** [Phân tích DB tối thiểu](docs/14-minimal-database-design.md). Bắt đầu 4 bảng cho portfolio/blog; 8 bảng learning bổ sung khi cần. Tài liệu 04/10 bên dưới là phạm vi mở rộng, không phải danh sách migration cần tạo ngay.

Baseline v3: PostgreSQL là nguồn dữ liệu chính; Flyway quản lý migration; Spring Data JPA truy cập dữ liệu. Redis dùng cache/rate limit; pgvector lưu embedding ở giai đoạn RAG.

Thiết kế chi tiết duy nhất:
- [Dữ liệu và API chung](docs/04-data-and-api.md).
- [Learning Hub: entities, constraints và API](docs/10-learning-domain-api.md).
- [Indexing và truy xuất RAG](docs/06-rag.md).

Admin là tài khoản đăng nhập; khách đọc public không cần tạo user. Nội dung công khai phải đồng thời PUBLISHED và PUBLIC. Progress, habit và visionboard của owner private. Vector dimension theo embedding model đã chọn; index không bảo đảm tổng thời gian trả lời chat.

Chưa có migration domain được triển khai theo tài liệu. Tạo migration từng lát cắt, kiểm tra backup/restore trước chuyển dữ liệu.
