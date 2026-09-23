# SPEC-XXX — Tên tính năng

Status: Draft | Ready | Implementing | Verified
Owner:
Ngày:
Module:
Backend: Java/Spring Boot trong backend-portfolio/, Gradle Wrapper.
Frontend: React/TypeScript trong frontend-portfolio/.
Dữ liệu: PostgreSQL/Flyway; Redis hoặc Spring AI/pgvector chỉ khi use case cần.

## Bài toán và người dùng

Ai cần làm gì, trong hoàn cảnh nào? Giá trị cụ thể khi hoàn thành?

## Scope

Trong lần này:
Để sau:
Giả định cần xác minh:

## Luồng và quy tắc

Happy path:
Lỗi và edge cases:
Chuyển trạng thái hợp lệ:
Public/private/owner authorization:
Concurrency/idempotency:

## Dữ liệu

Entity, field, nullability, FK, unique/check constraints, index.
Migration và tương thích dữ liệu cũ; backup/rollback nếu có.

## API

Method/path; auth/CSRF; request/response example; validation/limits.
Status code và error shape; pagination; caching/invalidation.

## Acceptance criteria

- AC-XXX.1: Given ... When ... Then ...
- AC-XXX.2: Given dữ liệu private ... When khách truy cập ... Then ...
- AC-XXX.3: Given request trùng/lỗi dependency ... When ... Then ...

## Tasks và truy vết

| Task | AC liên quan | Bằng chứng cần có | Trạng thái |
|---|---|---|---|
| Migration | | Chạy DB rỗng + dữ liệu cũ | Todo |
| Use case/API | | Test hành vi | Todo |
| UI | | Kiểm tra luồng người dùng | Todo |

## Vận hành và nghiệm thu

Logs/metrics; timeout/retry; chi phí/quota; test cần chạy.
Kết quả thực tế, ngày kiểm tra và hạn chế còn lại.
Quyết định kiến trúc mới cần ADR:
Nếu tách service: contract/version, data owner, timeout/idempotency, outbox/inbox, migration/rollback; service tiếp tục dùng Java/Spring Boot.
