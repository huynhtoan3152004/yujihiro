# Cấu trúc source Spring phân lớp

Baseline đơn giản — 22/09/2026. Cấu trúc này theo kiểu quen thuộc khi học Spring: controller → service → repository. Các folder đã được tạo trong `backend-portfolio/`; chưa tạo model/entity, DTO, controller, service, repository hay migration.

## Cây thư mục hiện tại

```text
backend-portfolio/
  build.gradle
  settings.gradle
  gradlew
  gradlew.bat
  src/
    main/
      java/dev/yujihiro/portfolio/
        PortfolioApplication.java       # có sẵn
        config/
        controller/
        dto/
          request/
          response/
        entity/
        exception/
        mapper/
        repository/
        service/
          implementation/
        util/
      resources/
        application.yaml               # có sẵn
        db/
          migration/                   # đang rỗng
    test/
      java/dev/yujihiro/portfolio/
        PortfolioApplicationTests.java # có sẵn
        TestcontainersConfiguration.java
        TestPortfolioApplication.java
```

Các package module cũ như `identity/api` hoặc `portfolio/domain` đã được bỏ vì chưa phù hợp cách tổ chức bạn muốn. Không file Java hiện có nào bị xóa hoặc sửa.

## Trách nhiệm từng package

| Package | Chứa gì sau này | Ví dụ tên file, chưa tạo |
|---|---|---|
| `config` | Cấu hình Spring, security, CORS, Jackson | `SecurityConfig` |
| `controller` | REST endpoint, nhận request và trả response | `ProjectController` |
| `dto/request` | Dữ liệu client gửi lên và validation | `CreateProjectRequest` |
| `dto/response` | Dữ liệu API trả về | `ProjectResponse` |
| `entity` | JPA entity và enum gắn chặt với entity | `Project`, `PublicationStatus` |
| `exception` | Business exception và global error handler | `ResourceNotFoundException` |
| `mapper` | Chuyển entity ↔ DTO | `ProjectMapper` |
| `repository` | Spring Data JPA repository và query | `ProjectRepository` |
| `service` | Interface nghiệp vụ khi thực sự cần interface | `ProjectService` |
| `service/implementation` | Cài đặt use case và transaction | `ProjectServiceImpl` |
| `util` | Hàm kỹ thuật nhỏ, dùng chung thật sự | `SlugUtils` |

## Luồng xử lý chuẩn

```text
HTTP request
  → controller
  → service
  → repository
  → PostgreSQL

entity → mapper → response DTO → HTTP response
```

Controller chỉ làm việc HTTP và validation, không viết query hoặc nghiệp vụ. Service giữ quy tắc như publish/unpublish và ranh giới transaction. Repository chỉ truy cập dữ liệu. Entity không trả trực tiếp ra API; request/response dùng DTO riêng.

## Cách đặt tên để vẫn dễ tìm khi dự án lớn hơn

Vì package chia theo layer, tên class phải bắt đầu bằng nghiệp vụ:

```text
controller/ProjectController.java
controller/PostController.java

dto/request/CreateProjectRequest.java
dto/request/UpdateProjectRequest.java
dto/response/ProjectSummaryResponse.java
dto/response/ProjectDetailResponse.java

service/ProjectService.java
service/implementation/ProjectServiceImpl.java

repository/ProjectRepository.java
entity/Project.java
mapper/ProjectMapper.java
```

Khi số file nhiều, có thể tạo thư mục con theo feature bên trong từng layer, ví dụ `controller/admin` và `controller/public`, nhưng chưa cần tạo bây giờ.

## Giữ cấu trúc đơn giản

- Chưa tạo `BaseController`, `BaseService`, `BaseRepository` hay `CommonUtils` chung chung.
- Không bắt buộc service interface cho CRUD rất nhỏ. Nếu dùng interface để luyện cấu trúc như trên trường, chỉ tạo khi bắt đầu use case, không tạo file rỗng hàng loạt.
- Mapper ban đầu có thể là class Java viết tay. Chỉ thêm thư viện mapping khi việc map lặp lại nhiều.
- `util` phải thật sự không chứa nghiệp vụ. Quy tắc publish không được đặt vào util.
- Enum chỉ dùng bởi một entity có thể đặt cùng package `entity`; chưa cần package `enums` riêng.
- Audit fields có thể dùng một `BaseAuditableEntity` sau khi thiết kế DB chốt, nhưng hiện chưa tạo.
- Test có thể đặt cùng package gốc và đặt tên theo lớp được kiểm tra; chưa cần tạo folder test rỗng.

## Folder rỗng và Git

Các folder đã tồn tại trên máy nhưng Git không theo dõi folder rỗng. Vì bạn yêu cầu chỉ tạo folder, tôi không thêm `.gitkeep` hoặc `package-info.java`. Khi bạn tạo class đầu tiên, package tương ứng sẽ xuất hiện trong Git.

## Bước tiếp theo

Đọc [thiết kế DB tối thiểu](14-minimal-database-design.md). Khi bạn chốt lát cắt đầu tiên, chỉ tạo `AdminAccount` và `Project` cùng migration liên quan; chưa cần tạo toàn bộ model tương lai.
