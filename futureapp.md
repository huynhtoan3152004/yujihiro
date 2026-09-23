# Hướng phát triển hệ thống

Mọi module và service backend phát triển bằng Java/Spring Boot. Bắt đầu với một ứng dụng chia module, sau đó tách service khi cần tài nguyên, ranh giới bảo mật hoặc lịch triển khai độc lập.

Thứ tự: portfolio CMS → blog → curriculum và bài giải → visualization → Redis → RAG → habit/vision → vận hành hoàn chỉnh. Nội dung học phát triển xuyên suốt.

[Kiến trúc và quy trình tách service](docs/03-architecture.md) quy định hợp đồng, ownership dữ liệu, retry/idempotency và chuyển đổi. [Kế hoạch tháng](docs/07-learning-roadmap.md) cùng [18 sprint](docs/12-delivery-backlog.md) là tiến độ thực hiện.

Mở rộng sau v1 có thể gồm đồng bộ tiến độ người học, nhắc ôn hoặc RAG private. Mỗi tính năng cần spec quyền truy cập, dữ liệu và nghiệm thu trước khi thêm. Không tự đưa nội dung private vào corpus public.
