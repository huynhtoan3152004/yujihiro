# Stack thống nhất và quyết định kiến trúc

Baseline v3 — Java/Spring Boot cho toàn bộ backend, kể cả service được tách về sau. Frontend tiếp tục phát triển từ frontend-portfolio/ hiện có.

## ADR-001 — Dùng project hiện có

Quyết định: backend-portfolio/ là backend chính, Java 21 + Spring Boot 4.1.1 + Gradle Wrapper. frontend-portfolio/ giữ React/TypeScript/Vite. Không tạo lại project hoặc đổi build tool trong quá trình triển khai tài liệu.

## ADR-002 — Bắt đầu bằng ứng dụng chia module

Một ứng dụng Spring Boot triển khai chung; ranh giới theo identity, portfolio, publishing, curriculum, algorithms, knowledge, habits, vision, media. Module gọi application interface hoặc sự kiện, không dùng repository/entity nội bộ của nhau. Chỉ tách service khi có nhu cầu tài nguyên, bảo mật hoặc lịch triển khai riêng.

## ADR-003 — PostgreSQL là nguồn dữ liệu chính

Spring Data JPA cho nghiệp vụ, Flyway quản lý schema; JPA validate thay vì tự thay schema. UUID, foreign keys, unique/check constraints bảo vệ dữ liệu. pgvector thêm trong giai đoạn RAG; vector và cache là dữ liệu có thể tái tạo từ nội dung gốc.

## ADR-004 — Quyền công khai và riêng tư

Khách đọc published/public không cần tài khoản. Admin đăng nhập session cookie, mutation có CSRF. Habit, visionboard và attempts của owner luôn private. Guest progress lưu local trên trình duyệt; đồng bộ nhiều thiết bị là đặc tả tương lai.

## ADR-005 — Ba layout, một mô hình nội dung

VSCodeLayout cho portfolio, BlogLayout cho blog, LearningLayout cho DSA. API cung cấp dữ liệu có nghĩa và Markdown, không chứa JSX hoặc cấu hình màu của giao diện. React Router quản lý URL; codebase frontend thống nhất.

## ADR-006 — Dạy kiến thức có cấu trúc

Blog kể chuyện và suy nghĩ; concept dạy kiến thức; pattern giải thích nhận diện/điều kiện; problem chứa bài; solution giải thích approach; visualizer giúp quan sát bước. Các loại liên kết bằng ID và reason, không sao chép nội dung thành nhiều bản không đồng bộ.

## ADR-007 — Visualizer được kiểm soát

Hàm TypeScript do tác giả review tạo trace từ input dữ liệu có giới hạn. Player hiển thị từng bước; lời giải code ưu tiên Java để thống nhất việc học. Không chạy code do người đọc hoặc CMS cung cấp. Thuật toán mô phỏng và code Java được đối chiếu bằng fixtures.

## ADR-008 — RAG trong Spring

Spring AI gọi embedding/chat provider; Java worker xử lý jobs lưu PostgreSQL. Chỉ index nội dung được publish public; lọc revision và quyền trước khi truy xuất/trả lời. RAG private phải có spec riêng. Provider cụ thể được cấu hình khi đến giai đoạn RAG và phải hỗ trợ các model cần dùng.

## ADR-009 — Redis có nhiệm vụ cụ thể

Thêm ở tháng 6 cho cache public theo revision và rate limit. PostgreSQL vẫn lưu nội dung/progress/jobs. Cache phải vượt qua test unpublish và outage trước bật production. Session ban đầu trong ứng dụng; khi cần nhiều instance dùng Spring Session Redis.

## ADR-010 — Service mở rộng vẫn là Spring Boot

Giữ contract REST và event payload có version. Tách từng module, chuyển dữ liệu có kiểm soát, chỉ một chủ sở hữu dữ liệu có quyền ghi. Worker mới cũng viết Java. HTTP có timeout, retry giới hạn với thao tác idempotent và xác thực service. Xem quy trình trong tài liệu 03.

## ADR-011 — Thực thi theo từng lát cắt

Mỗi giai đoạn thêm dependency phục vụ tính năng đang làm. Học và kiểm tra xong publish flow trước mở blog/learning; hoàn thành nội dung trước RAG. Sản phẩm và bằng chứng kiểm thử quyết định tiến độ.

## ADR-012 — Deploy FE trên Vercel, BE trên VPS, cùng origin qua rewrite proxy

Ngày: 22/09/2026. Bối cảnh: muốn tận dụng Vercel cho FE (CDN, preview deploy, zero-config Vite) và VPS riêng cho BE (Postgres, Docker, kiểm soát chi phí/tài nguyên cho Testcontainers-style workload, RAG worker sau này).

Quyết định:

1. **Không tách repo.** Vercel hỗ trợ monorepo qua *Root Directory*: project Vercel trỏ vào `frontend-portfolio/`, chỉ build khi thư mục đó đổi. Lý do đầy đủ ở [tài liệu 16](16-repository-strategy.md); Vercel không đổi kết luận đó, chỉ là một target deploy.
2. **FE gọi API cùng origin qua rewrite proxy của Vercel**, không gọi thẳng domain VPS và không dùng CORS cross-site. `vercel.json` ở gốc `frontend-portfolio/` rewrite `/api/*` sang `https://api.<domain>/api/*`. Browser chỉ thấy một origin (`app.<domain>` hoặc `<project>.vercel.app`); cookie session + CSRF hoạt động y hệt cấu hình cùng origin đã thiết kế ở ADR-004, **không cần** `SameSite=None`, không cần CORS credentials phức tạp.
3. **BE có domain/subdomain HTTPS thật trên VPS** (Caddy/nginx + Let's Encrypt) làm đích rewrite; không dùng IP trần vì rewrite đích ngoài của Vercel cần HTTPS ổn định và để sau này cookie có thể dùng `Domain=.<domain>` nếu cần chia sẻ giữa subdomain.
4. **Giới hạn cần biết của rewrite proxy**: giới hạn kích thước response/timeout theo gói Vercel (Hobby: ~4.5 MB body, ~10s function timeout cho serverless — rewrite tới URL ngoài đi qua edge nên khác giới hạn function, nhưng vẫn có trần response size). Upload media lớn (khi làm `media_assets`) nên trỏ thẳng một subdomain riêng (`media.<domain>` → VPS trực tiếp) thay vì qua rewrite, và chấp nhận CORS đơn giản chỉ cho route đó.
5. **Mỗi app một workflow CI/CD** (cập nhật 23/09/2026, chi tiết ở [tài liệu 20](20-ci-cd.md)): `frontend.yml` lint + build, còn deploy vẫn do Vercel Git integration làm. Vercel *Deployment Checks* chờ check `Frontend · lint + build` xanh rồi mới promote production. `backend.yml` test → image Docker lên GHCR → SSH vào VPS `docker compose pull/up`. Job deploy bật bằng biến repo `BACKEND_DEPLOY`.

Hệ quả: FE và BE có hai vòng đời deploy độc lập (Vercel deploy theo mỗi push, BE deploy thủ công/CI riêng theo nhịp release) dù chung một repo — đây chính là lợi ích cần của topology này mà không phải trả giá bằng việc tách repo.

Không làm ở v1: custom domain hai bên (dùng domain Vercel mặc định trước, gắn domain thật khi có); multi-region VPS; auto-scale BE.
