# Dependency theo giai đoạn

Baseline v3. Chỉ các thư viện phục vụ stack đã chốt được liệt kê. Dependency ghi là planned chưa được cài; kiểm tra compatibility bằng build/test khi thêm.

## Frontend

| Thư viện/công cụ | Trách nhiệm | Thời điểm |
|---|---|---|
| React, TypeScript, Vite, Tailwind và UI hiện có | Giao diện nền tảng | Đang có |
| React Router | URL và ba public layouts | Tháng 1; public reader rendering tháng 2 |
| TanStack Query + fetch | Server state, queries, mutation invalidation | CMS tháng 1–2 |
| React Hook Form + Zod | CMS forms, validation input/import/config | CMS và learning |
| react-markdown + remark-gfm | Render nội dung Markdown | Tháng 2 |
| Shiki | Highlight code Java và pseudocode được hỗ trợ | Blog/solution |
| React/SVG + Framer Motion hiện có | Player và trạng thái thuật toán | Tháng 4–5 |
| React Flow | Map roadmap bên cạnh sheet | Khi sheet hoàn chỉnh |
| Vitest + React Testing Library | Trace functions và interactions | Khi có logic FE |
| Playwright | Smoke journeys và public/admin flows | Khi có slice hoàn chỉnh |

Zod validate runtime ở FE; backend vẫn validate request. Markdown không chạy raw HTML/JS; cấu hình plugins và URL policy có kiểm soát. Visualizer input là dữ liệu, renderer nằm trong code đã review. Chỉ load ngôn ngữ highlight và renderer đang dùng.

Nguồn tham khảo: [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview), [Zod](https://zod.dev/), [react-markdown](https://github.com/remarkjs/react-markdown), [Shiki](https://shiki.style/guide/), [React Flow](https://reactflow.dev/learn).

## Backend

Đã có trong build.gradle: Spring MVC, Data JPA, Security, Validation, Flyway/PostgreSQL module, PostgreSQL driver, Actuator và test support/Testcontainers. Gradle Wrapper quản lý build. Dùng Java records cho DTO phù hợp, mapping thủ công và constructor injection.

Tháng 6 bổ sung Spring Data Redis, Cache Abstraction. Shared session dùng Spring Session Redis khi có nhu cầu nhiều replica.

Tháng 7 bổ sung Spring AI BOM/model adapter và pgvector extension. Flyway quản lý vector schema; Java worker đọc durable jobs trong PostgreSQL. SQL/JDBC adapter kiểm soát live revision/visibility khi retrieval. Chi tiết tại tài liệu 06.

OpenAPI mô tả contract của từng slice trước khi triển khai. Chỉ thêm dependency khi use case và tests tương ứng đã rõ; không thêm framework chỉ để giữ một khả năng giả định.

## Redis: scope triển khai

PostgreSQL giữ dữ liệu gốc. Redis dùng cho cache public theo revision và atomic rate limiting. Thêm session store khi cần nhiều instance, không phải điều kiện để làm CMS đầu tiên.

| Use case | Thiết kế |
|---|---|
| Public DTO cache | Key `public:{kind}:{id}:r{revision}:dto1`; TTL khởi điểm 5–15 phút |
| Eligibility | Mỗi request kiểm tra published/public và revision hiện tại ở PostgreSQL trước khi dùng cache |
| Public lists | DB chọn IDs hợp lệ, cache hydrate DTO; không cache list toàn phần trước khi có invalidation đúng |
| Rate limit | Atomic counter/token bucket với expiry, theo policy IP/account và budget tổng |
| Session | Spring Session Redis khi bật nhiều API replica |

Unpublish sau commit phải trả 404 cho request mới dù cache key cũ còn tồn tại. Ghi cache theo revision tránh reader cũ ghi đè payload mới. Một browser đã tải nội dung trước đó vẫn có bản đã nhận; server không thể thu hồi bản sao đó.

Redis lỗi: public read fallback DB với timeout ngắn. DB lỗi: không serve nội dung chưa xác minh quyền. Chat quota storage lỗi: public chat tạm 503 để tránh mất kiểm soát chi phí. Login có limiter fallback cục bộ bảo thủ nếu session chưa phụ thuộc Redis; nếu session store Redis hỏng thì báo tạm không khả dụng, không bỏ qua auth.

Không cache admin/me/private DTO. Không dùng cache làm nguồn jobs hoặc progress. Client IP chỉ lấy từ trusted proxy đã cấu hình; không tin header tùy ý.

## Gate trước bật Redis production

Có workload baseline và báo cáo hit rate/p95/DB calls; unpublish/visibility vẫn đúng; Redis down không làm mất dữ liệu; limiter đồng thời đúng và key có expiry; không log credentials/private payload. Nếu lợi ích cache chưa rõ, giữ config tắt và báo cáo lab; rate limit vẫn có thể giữ khi hữu ích.

[Spring Data Redis Cache](https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html) mô tả cache integration; quy tắc quyền/revision thuộc ứng dụng, phải tự kiểm thử.

## Vận hành và ngân sách công nghệ

Docker local, CI build/test, Actuator/logs, backup/restore trước khi thêm phần quan sát khác. Pin image versions theo môi trường triển khai, không dùng mutable tag làm baseline test lâu dài. Model provider có timeout, concurrency và budget cap. Service tách về sau vẫn dùng cùng bộ nền Java/Spring/PostgreSQL, với ownership dữ liệu rõ.
