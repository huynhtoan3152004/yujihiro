# Backend Spring Boot

Project chính của hệ thống: Java 21, Spring Boot 4.1.1 và Gradle Wrapper, cấu hình YAML. Package dev.yujihiro.portfolio.

## Chạy từ thư mục backend-portfolio/

~~~powershell
.\gradlew.bat test
.\gradlew.bat bootRun
~~~

Testcontainers yêu cầu Docker runtime. bootRun cần datasource và các cấu hình ứng dụng; application.yaml hiện mới khai báo application name. TestcontainersConfiguration hiện dùng postgres:latest; pin tag đồng bộ môi trường trước khi dùng làm baseline test.

Source hiện là skeleton, chưa có domain migration hoặc use case CMS. Các lệnh trên là hướng dẫn, chưa được xác nhận đã pass trong lần viết docs.

## Tài liệu triển khai

- [Cấu trúc thư mục đã tạo](../docs/13-source-structure.md).
- [Thiết kế DB tối thiểu, chưa có migration/model](../docs/14-minimal-database-design.md).

- [Thiết lập chi tiết](../docs/08-spring-initializr.md).
- [Kiến trúc phân lớp và service Spring Boot](../docs/03-architecture.md).
- [Dữ liệu/API](../docs/04-data-and-api.md).
- [Sprint đầu tiên](../docs/12-delivery-backlog.md).

PostgreSQL giữ dữ liệu, Flyway quản lý migration. Redis và Spring AI/pgvector được thêm khi đến giai đoạn tương ứng; bảo vệ admin bằng Spring Security/session/CSRF.
