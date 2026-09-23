# Thiết lập Spring Boot cho project hiện có

Baseline v3. Project đã được tạo tại backend-portfolio/; build.gradle xác định Java 21, Spring Boot 4.1.1 và Gradle. Tiếp tục dùng project này.

## Cấu hình thống nhất

| Trường Initializr | Giá trị |
|---|---|
| Project | Gradle - Groovy |
| Language | Java |
| Spring Boot | 4.1.1 |
| Group | dev.yujihiro |
| Artifact / Name | portfolio |
| Package | dev.yujihiro.portfolio |
| Packaging | Jar |
| Configuration | YAML |
| Java | 21 |

Bảng dùng để đối chiếu project hoặc tái tạo khi cần. Gradle Wrapper của repository quản lý phiên bản build tool. Không cần tải lại project hiện tại.

## Dependencies đã có

| Nhóm | Trong build.gradle |
|---|---|
| HTTP | spring-boot-starter-webmvc |
| Persistence | spring-boot-starter-data-jpa |
| PostgreSQL | postgresql driver |
| Migration | spring-boot-starter-flyway, flyway-database-postgresql |
| Validation | spring-boot-starter-validation |
| Security | spring-boot-starter-security |
| Health/metrics | spring-boot-starter-actuator |
| Test | Các Spring test starters, spring-boot-testcontainers, PostgreSQL/JUnit Testcontainers |

Các dependency này đã khai báo, không đồng nghĩa đã kiểm thử thành công. Security domain, migrations và datasource ứng dụng vẫn cần viết.

## Chuẩn bị máy

JDK 21, Git, IDE, Docker runtime cho PostgreSQL và Testcontainers. Frontend dùng Node/npm phù hợp package.json và package-lock.json hiện có. Redis chỉ cần khi đến giai đoạn cache/rate limit.

Từ thư mục backend-portfolio/ trên Windows:

~~~powershell
.\gradlew.bat test
.\gradlew.bat bootRun
~~~

Testcontainers cần Docker hoạt động và khả năng tải image. bootRun cần datasource được cấu hình; application.yaml hiện mới có application name nên chưa phải cấu hình chạy hoàn chỉnh. Không dùng kết quả build cũ làm bằng chứng cho cấu hình mới.

## Cấu hình tiếp theo cần tự viết

1. Cấu hình datasource qua environment và local profile; không commit mật khẩu.
2. Pin PostgreSQL image tag cho local/test đồng bộ bản chọn triển khai; Testcontainers hiện dùng postgres:latest.
3. Tạo Flyway migration đầu trong src/main/resources/db/migration; JPA ddl-auto=validate.
4. Viết SecurityFilterChain: public/admin/me, JSON errors, session và CSRF.
5. Bootstrap một admin qua cách khởi tạo có kiểm soát.
6. Tạo Project DTO/service/repository và luồng publish/unpublish.
7. FE proxy /api tới port 8080; local FE mặc định 5173.

## Dependencies bổ sung theo kế hoạch

Tháng 6: Spring Data Redis (Access+Driver), Spring Cache Abstraction. Nếu cần shared session thì thêm Spring Session Redis; giữ một session store duy nhất.

Tháng 7: Spring AI BOM và model adapter, pgvector extension; vector retrieval dùng adapter có kiểm soát quyền/revision theo tài liệu 06. Kiểm tra tương thích phiên bản khi triển khai, không tự thêm các dependency chưa dùng vào skeleton.

Tài liệu tham khảo: [Spring Boot](https://docs.spring.io/spring-boot/index.html), [Spring AI](https://docs.spring.io/spring-ai/reference/getting-started.html), [Spring Initializr](https://start.spring.io/).
