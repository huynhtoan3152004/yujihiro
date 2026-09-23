# Kiến trúc phân lớp và mở rộng service Spring Boot

Baseline v3. Code backend trong `backend-portfolio/`, package `dev.yujihiro.portfolio`. Giai đoạn đầu dùng cấu trúc phân lớp quen thuộc: controller, DTO, service, repository và entity. Một ứng dụng Spring Boot cùng PostgreSQL phục vụ toàn bộ nghiệp vụ.

## Kiến trúc ban đầu

~~~mermaid
flowchart TD
  Guest[Khách đọc] --> FE[React: Portfolio / Blog / Learning]
  Owner[Admin] --> Admin[React: Admin / Personal]
  FE --> API[Spring Boot API]
  Admin --> API
  API --> Identity[Identity]
  API --> Content[Portfolio / Publishing]
  API --> Learning[Curriculum / Algorithms]
  API --> Personal[Habits / Vision / Media]
  API --> Knowledge[Knowledge / RAG]
  Identity --> DB[(PostgreSQL)]
  Content --> DB
  Learning --> DB
  Personal --> DB
  Knowledge --> DB
  API --> Cache[(Redis: giai đoạn tối ưu)]
  DB --> Worker[Java indexing worker]
  Worker --> Models[Model provider qua Spring AI]
  Worker --> DB
  Knowledge --> Models
~~~

Worker bắt đầu trong cùng ứng dụng, nhận durable jobs từ DB ở giai đoạn RAG. Redis giữ cache/quota, không giữ dữ liệu gốc. Model provider được cấu hình qua Spring AI khi triển khai.

## Nhóm nghiệp vụ trong một cấu trúc phân lớp

| Nhóm | Sở hữu |
|---|---|---|
| Identity | Admin account/session, actor và quyền |
| Portfolio | Profile, skills, socials, projects |
| Publishing | Blog, tags, series và liên kết nội dung |
| Curriculum | Concepts, patterns, roadmaps |
| Algorithms | Problems, sources, solutions và progress |
| Knowledge | Documents, chunks, jobs và chat |
| Personal | Habits, visionboard và media private |

Đây là cách nhóm trách nhiệm để đặt tên class và thiết kế bảng, không phải package top-level. Ví dụ `ProjectController`, `ProjectService`, `ProjectRepository` lần lượt nằm trong `controller`, `service`, `repository`.

Controller nhận DTO/validation; service giữ use case và transaction; repository truy cập DB; mapper chuyển entity/DTO. Entity không được trả trực tiếp ra API. Luồng và phụ thuộc nghiệp vụ phải rõ trong service, tránh controller gọi repository hoặc service phụ thuộc vòng tròn.

## Các luồng chính

Publish: nhận admin command → kiểm tra session/CSRF/version → transaction lưu trạng thái/revision → nếu đã bật RAG thì tạo job trong cùng commit → public query thấy phiên bản mới.

Public read: chọn dữ liệu published/public ở server; kiểm tra parent eligibility cho solution/roadmap links; hydrate DTO. Private read luôn gắn owner từ session. Không cho client yêu cầu includeDrafts ở public API.

Visualizer: input giới hạn → trace function TypeScript → step player → SVG/React. Backend lưu cấu hình đã schema validate, không thực thi code khách nhập. Code Java lời giải đối chiếu với trace bằng fixtures.

## Identity và quyền

Một admin, không mở đăng ký. Cookie Secure/HttpOnly/SameSite, CSRF cho login/mutation/logout, session expiry và logout invalidate. Bootstrap admin qua cơ chế khởi tạo có kiểm soát, mật khẩu được hash qua Spring Security; secrets không commit.

Ban đầu session trong ứng dụng, restart cần login lại. Khi cần nhiều API replica và đã có Redis, dùng Spring Session Redis. API admin/me không được cache public. Định danh owner lấy từ server; log không chứa mật khẩu/token/nội dung private.

## Frontend và URL

Portfolio: /, /about, /skills, /projects, /projects/:slug.
Blog: /blog, /blog/:slug.
Learning: /learn, /learn/roadmaps/:slug, /learn/concepts/:slug, /learn/patterns/:slug, /practice/:slug, /practice/:slug/solutions/:solutionSlug.
Admin và personal: /admin/*, /me/*.

React Router quyết định nội dung. Tab editor là UI state. Blog và learning dùng layout đọc riêng trong cùng FE codebase. TanStack Query quản lý server state; guest progress local có version, không chứa session/token. Public reader rendering theo React Router trong sprint 04, có HTML metadata đúng và cơ chế thu hồi nội dung; private authorization vẫn ở backend.

## Vận hành ban đầu

Docker cho môi trường local, một Spring application, PostgreSQL và FE; Redis thêm tháng 6. HTTPS và proxy giữ cùng origin cho cookie/API. Media lưu ở vùng persistent được backup, không lưu vào filesystem tạm của container; API kiểm tra quyền đọc ảnh private.

Flyway migrations và JPA validate. CI chạy backend tests/migrations trên PostgreSQL test, FE build/lint và smoke luồng quan trọng. Theo dõi Actuator, logs, latency, errors, DB pool và job backlog. Backup DB/assets, thực hành restore; mục tiêu ban đầu RPO 24 giờ/RTO 4 giờ cần đo và điều chỉnh.

## Khi mở rộng thành nhiều service

Tất cả service tiếp tục dùng Java/Spring Boot và Gradle. Chỉ tách khi có nhu cầu rõ: tài nguyên khác biệt, lỗi cần cô lập, quyền dữ liệu riêng hoặc lịch deploy độc lập. Cấu trúc phân lớp hiện tại không ngăn việc tách; trước khi tách phải gom các class của một nghiệp vụ và chốt contract/dữ liệu sở hữu.

Ứng viên đầu: indexing worker/RAG khi tác vụ model gây áp lực tài nguyên; notification khi có nhắc ôn. Portfolio/blog có thể tiếp tục ở core.

~~~mermaid
flowchart LR
  UI[React FE] --> Core[Spring Core API]
  Core --> CoreDB[(Core PostgreSQL)]
  Core --> RAG[Spring Knowledge API]
  Core --> Notification[Spring Notification API]
  RAG --> KDB[(Knowledge PostgreSQL + pgvector)]
  Worker[Spring Index Worker] --> KDB
  Worker --> Provider[Spring AI model adapter]
  RAG --> Provider
~~~

Đây là hướng mở rộng sau v1, chưa phải topology cần triển khai ngay.

## Contract và tính tin cậy giữa service

- REST API và payload có version, request ID, timeout hữu hạn. FE tiếp tục gọi core contract; core adapter thay lời gọi nội bộ bằng HTTP khi cần.
- Xác thực service bằng credential quản lý riêng, xoay vòng được, truyền qua HTTPS; không tin owner/scope gửi tùy ý trong payload. Request thay mặt người dùng phải có scope được kiểm chứng.
- Retry giới hạn với backoff chỉ khi thao tác an toàn hoặc có idempotency key. Tạo command trùng phải trả cùng kết quả, không tạo hiệu ứng trùng.
- Nội dung và outbox event được ghi cùng transaction PostgreSQL. Dispatcher gửi event bằng HTTP, consumer lưu inbox/event ID để deduplicate rồi mới acknowledge. Timeout sau xử lý không làm mất sự kiện; retry không làm nhân đôi.
- Event tối thiểu có eventId, eventType, schemaVersion, sourceId, revision, occurredAt. Consumer từ chối phiên bản schema không hỗ trợ và bỏ revision cũ.
- Transaction chỉ bao phủ DB của service đó. Trạng thái cross-service là eventual consistency, có retry/reconcile và admin thấy trạng thái chờ/thất bại.

## Dữ liệu và quyền sau khi tách

Mỗi service sở hữu bảng/schema/database và credential riêng; service khác không đọc/ghi trực tiếp. Không giữ shared writable JPA entities hoặc distributed joins. Bỏ cross-service FK bằng migration có backfill/validation, thay bằng external IDs và application contracts.

Đặc biệt RAG: index có thể chậm nhưng quyền public không được dựa vào bản sao chậm. Trước gửi context và trước trả response, knowledge xác minh source eligibility/revision qua core API. Core lỗi thì không phục vụ source chưa xác minh. Dữ liệu đã gửi provider trước unpublish không thể thu hồi; ghi rõ giới hạn này.

## Quy trình tách một nhóm nghiệp vụ

1. Chốt contract/use cases, inventory bảng/FK và caller; có integration tests.
2. Tạo service Spring mới, schema sở hữu riêng, credentials và health checks.
3. Backfill từ snapshot và replay outbox; đối chiếu count/checksum/revision.
4. Chạy shadow read có kiểm soát, đo latency/errors; giữ một writer chính.
5. Tạm dừng writes trong cửa sổ chuyển nhỏ, bắt kịp events, đổi adapter sang service mới, xác nhận rồi mở writes.
6. Theo dõi và reconcile; giữ backup trong thời hạn rollback. Nếu service mới đã nhận writes, rollback phải đồng bộ lại dữ liệu trước chuyển, không trỏ về DB cũ một cách mù quáng.

V1 giữ service methods, DTO và ownership dữ liệu rõ ràng; durable jobs xuất hiện khi làm RAG. Tách service là kế hoạch riêng khi đủ lý do, không nằm mặc định trong 9 tháng.
