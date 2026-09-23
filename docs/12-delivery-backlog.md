# Backlog triển khai theo sprint

> Khi bắt đầu code, dùng [folder structure](13-source-structure.md) và [DB tối thiểu](14-minimal-database-design.md). Các task DAG/cycle graph và nhiều code samples ở bảng backlog là phần mở rộng; roadmap ban đầu dùng section/item order. Chưa cần tạo bảng cho tất cả sprint ngay.

Baseline v3. Dùng backend-portfolio/ (Java/Spring Boot/Gradle) và frontend-portfolio/ (React/TypeScript). Skeleton đã có; các task nghiệp vụ vẫn Todo.

Baseline 18 sprint × 2 tuần × khoảng 18 giờ/tuần, cộng buffer thành 9 tháng. Mỗi sprint gồm học, code, nội dung, test và SDD. Spec Draft → Ready khi contract/AC đã rõ → Implementing → Verified theo bằng chứng. Hiện toàn bộ backlog là Todo.

| Sprint | Tasks theo thứ tự | Đầu ra / gate |
|---|---|---|
| 01 | Git/ignore secrets → kiểm tra skeleton Spring/Gradle hiện có → PostgreSQL → Flyway → Project entity/DTO → public GET → FE route | Compile/migration; draft chưa public; refresh URL đúng |
| 02 | Admin bootstrap → session/CSRF → CRUD/publish → form FE → deploy | SPEC-001/002: 401/403/404/409 đúng; một project thật |
| 03 | Profile/skills/contact CMS → blog kind/tags/series → Markdown editor | SPEC-003: safe render, edit/reload; BlogLayout; bài journey đầu |
| 04 | Blog reader → highlight → related posts → rendering ADR → metadata/sitemap → mobile QA | 2 posts, URL/404/canonical trong HTML; backup và restore đầu |
| 05 | Concept/pattern schema/DTO → CRUD → lesson pages → preconditions/checkpoints | 3 lessons, 2 patterns; related private targets không lộ |
| 06 | Platforms/sources → solution sections/code samples → parent publish rules → workspace | 5 editorial, 2 platforms; SPEC-010; source unique test |
| 07 | Roadmap structure → cycle guard → sheet → guest progress/export/import | SPEC-008: reload, validation, version conflict, stable IDs |
| 08 | Owner attempts/review → trace schema/player → binary search/two pointers | SPEC-004/009: fixtures, privacy, keyboard/text fallback |
| 09 | Sliding window có preconditions → stack visualizer → hint/checkpoint UI | Input sai bị từ chối; next/back/reset; reduced motion |
| 10 | Linked-list reversal → BFS → map nếu đủ budget → content links | Tổng 6 visuals; end-to-end learning path; mobile QA |
| 11 | Beta bugfix → API contract checks → Redis revision cache → benchmark | Báo cáo trước/sau; unpublish/outage test; ADR giữ hoặc tắt cache |
| 12 | Atomic rate limiter → trusted proxy → stress limiter → rà soát phụ thuộc giữa các layer → CI | Quota policy kiểm chứng; 15–20 editorial; ghi feedback |
| 13 | Spring AI → pgvector → jobs/lease → revision/chunk → retry/reconcile | Publish không chờ AI; job cũ không ghi đè mới; cost cap |
| 14 | Retrieval/citations → chat UI → eval set → timeout/unpublish tests | SPEC-005 release gate; 30–50 câu và nguồn thật |
| 15 | Daily habits → timezone policy → check-in unique → dashboard/privacy | SPEC-006: ngày địa phương đúng; duplicate không tăng count |
| 16 | Visionboard/card → private upload → reorder → authorized asset read | SPEC-007: reload đúng, ảnh private không lộ, backup assets |
| 17 | Performance/SEO/accessibility → lỗi còn lại → content audit | Draft/private không lộ; visuals có text; fixtures/editorial đúng |
| 18 | Restore drill → deployment/rollback runbook → case study → scope audit → release | V1 hữu hạn, known limitations và next backlog |

Viết nội dung xuyên suốt, không tự sinh từ sprint code. Nếu visualizers quá tải, giữ hai cái đạt chuẩn và dời phần còn lại; cập nhật roadmap thay vì bỏ kiểm chứng.

## Rendering ADR ở sprint 04

Giữ React/TypeScript và React Router trong cùng FE codebase, Blog/Learning layout riêng. Sprint 04 tích hợp chế độ rendering public của React Router với toolchain hiện có; xác nhận tương thích bằng build và HTTP smoke tests. Public routes phải có HTML metadata đúng; private/admin giữ client rendering. Nếu công việc vượt budget, tăng estimate của slice và hoãn release SEO đến khi đạt gate, không đổi framework.

Static prerender cần rebuild/deploy/purge khi publish/unpublish, ghi rõ độ trễ. Nội dung cần thu hồi ngay nên dùng SSR hoặc request-time gate; không để static HTML chứa bản đã chuyển private. Nếu chưa làm invalidation đúng, chưa đánh dấu release đạt SEO+thu hồi. API 404 không tự xóa HTML đã build.

## Contract trước code

Mỗi sprint viết OpenAPI cho endpoints đang làm, example JSON, constraints, quyền, errors; kiểm tra implementation theo contract. Không cần hoàn tất API habit ở tháng 1. IDs/version và publication rules thống nhất. SDD: spec → AC → migration → DTO/API → use case → FE → test/demo → evidence.

## Test matrix

| Loại | Trọng tâm |
|---|---|
| Domain/API | Publish/visibility, ownership, validation, stale versions, parent eligibility |
| PostgreSQL | Migration, FK/unique, transaction, concurrent DAG edits, ordering |
| FE/browser | Deep links, history, loading/error/empty, Markdown safe, guest progress |
| Algorithm | Normal/edge fixtures, invariants, final output, trace/code consistency |
| Visual UX | Next/prev/reset, stale trace cancel, limits, keyboard/reduced motion |
| Redis | Eligibility/revision, outage fallback, atomic limits/expiry |
| RAG | Sources/citations/refusal, provider failure, retry/unpublish |
| Operations | DB/assets backup, restore sạch, secrets/config, rollback |

Chạy checks phù hợp thay đổi; cross-system smoke ở release. Không test getter/setter chỉ để tăng coverage.

## Bằng chứng và release

Không còn blocker về quyền/publish/mất dữ liệu; migration chạy từ DB rỗng; API đúng contract; UI URL thật/fallback; code/trace đã kiểm chứng; có restore. RAG cần eval/cost cap, Redis cần outage/unpublish evidence.

Tạo `docs/evidence/` khi bắt đầu implement, ghi ngày, AC, command/manual steps, kết quả và hạn chế. Không ghi passed trước khi có code chạy. Dùng [feature-spec](templates/feature-spec.md) và [learning-content](templates/learning-content.md).
