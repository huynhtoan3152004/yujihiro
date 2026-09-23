# Kế hoạch học và build — baseline v3 — stack thống nhất

## Ước lượng và giới hạn

**Đặt kế hoạch chuẩn 9 tháng ở mức khoảng 18 giờ/tuần**, nếu đã biết lập trình web và học Java/Spring trong quá trình làm. Khoảng 600–800 giờ gồm học framework/DSA, code, viết nội dung, test, deploy và buffer; đây là ước lượng, không phải cam kết hoặc thời lượng học của trang tham khảo.

| Quỹ thời gian | Khoảng dự kiến cho scope dưới đây |
|---|---|
| 10–12 giờ/tuần | Khoảng 12–19 tháng |
| 15–20 giờ/tuần | Khoảng 7–12 tháng; baseline 9 tháng |
| 25 giờ/tuần | Khoảng 6–8 tháng |

Nếu hoàn toàn mới Java/SQL/web backend, cộng khoảng 4–8 tuần nền tảng hoặc giảm content scope. Sau 4 tuần đầu, lấy số giờ thực tế mỗi slice để ước lượng lại. Thời gian gián đoạn hoặc thay đổi UI lớn sẽ làm lịch dài hơn.

Scope hữu hạn: portfolio CMS, blog riêng, DSA roadmap/sheet/map, concept/pattern, bài giải đa nền tảng, 6 visualizers đã kiểm chứng, tiến độ guest local và owner private, public RAG, Redis lab/optional production, habit cơ bản, visionboard cơ bản, deployment/backup. Nội dung mục tiêu: 2–3 case studies, 8–12 blog posts, 10–12 lessons, 6–8 patterns, 25–35 bài có editorial. Số lượng là trần hoạch định; giảm số bài để giữ chất lượng khi cần.

Không bao gồm online judge, hàng trăm editorial, đầy đủ DSA nâng cao, learner accounts/sync, cộng đồng đóng góp, mobile app, private RAG, SaaS đa tenant. Kho kiến thức tiếp tục lớn lên sau khi phần mềm hoàn chỉnh. Nếu thêm learner accounts/sync sau core, dành thêm khoảng 4–6 tuần; online judge phải ước lượng riêng.

## Phân bổ effort

| Workstream | Giờ dự kiến |
|---|---:|
| Java/Spring/SQL, auth, portfolio CMS | 100–130 |
| Blog riêng, Markdown, routing và SEO | 50–70 |
| Curriculum, problem/solution domain và workspace | 100–130 |
| Trace engine, 6 visualizers và checks | 80–100 |
| Học DSA, kiểm chứng và biên soạn nội dung | 100–140 |
| Redis + RAG + vận hành bổ sung | 70–90 |
| Habit/vision bản nhỏ | 40–50 |
| Buffer, sửa lỗi và review toàn hệ thống | 60–90 |
| **Tổng** | **600–800** |

Vận hành tối thiểu bắt đầu tháng 1. Học/nội dung chạy xuyên các tháng, không cộng thêm lần nữa vào roadmap. Một tuần 18 giờ có thể chia 4 giờ học DSA/đọc tài liệu, 8 giờ build, 4 giờ viết và kiểm chứng nội dung, 2 giờ test/deploy/review.

## Kế hoạch 9 tháng

| Tháng | Học và build | Kết quả nghiệm thu |
|---|---|---|
| 1 | Java, Gradle, DI, HTTP, SQL, migrations, session/CSRF, Project slice; FE URL và API | Draft→publish→unpublish, auth tests, một case study thật, deploy tối thiểu |
| 2 | Profile CMS; BlogLayout, Markdown, tag/series, code highlight; prerender/SSR | 2 case studies, 2 blog posts; URL/metadata/mobile hoạt động |
| 3 | Concept/pattern, problems/platform sources, solutions/code samples | 3 lessons, 2 patterns, 5 editorial; ít nhất 2 nền tảng do bạn chọn |
| 4 | Roadmap sheet, prerequisites, guest progress local, owner attempts; trace player + binary search/two pointers | Roadmap→pattern→problem→solution hoàn chỉnh; 2 visualizers đúng |
| 5 | Sliding window/stack/linked-list/BFS; hints/checkpoints/transfer; map sau sheet | Tổng 6 visualizers, 10–15 editorial; keyboard/reduced-motion/mobile |
| 6 | OpenAPI/tests; Redis cache/rate-limit lab, đo trước/sau; beta | Tổng 15–20 editorial; feedback 2–3 người nếu có; cache outage/unpublish tests |
| 7 | Embedding, pgvector, durable jobs, retrieval theo revision, citations, eval/quota | Public RAG; 30–50 câu eval và privacy gate |
| 8 | Habit daily/timezone; visionboard CRUD ảnh/reorder; tiếp tục nội dung | Hai module private; ảnh được bảo vệ; không index vào public RAG |
| 9 | Buffer, sửa lỗi, performance, backup restore, deploy runbook, content audit | Release v1 với nội dung mục tiêu hoặc số lượng giảm có chủ đích |

Mốc giá trị: tháng 2 có portfolio/blog public; tháng 4–5 có Learning Hub; tháng 7 thêm RAG; tháng 9 gồm personal workspace và hardening. Có thể release showcase/blog/DSA trước RAG/habit/vision.

## Nhịp học và triển khai

Sprint 2 tuần, khoảng 36 giờ baseline; 18 sprint cộng buffer thành khoảng 9 tháng. Tasks và gates ở [backlog](12-delivery-backlog.md). Mỗi tuần tự giải một bài → ghi sai lầm → test lời giải → viết insight/invariant → gắn pattern → thêm visual preset khi hữu ích → publish hoặc giữ draft khi chưa chắc. Một editorial mỗi 1–2 tuần là đủ; visualizer mới có thể chiếm cả sprint.

Tự học: complexity/arrays → hashing/sorting/binary search → two pointers/window → linked list/stack/queue → trees/BFS → recursion/greedy/DP khi sẵn sàng. Không chờ học hết DSA để build, chỉ dạy phần đã kiểm chứng.

## Giữ lịch khả thi

- Backend Java/Spring Boot tại backend-portfolio/ dùng Gradle, PostgreSQL, frontend React tại frontend-portfolio/ với ba public layouts; service tương lai giữ cùng backend stack.
- Code viewer trước scratchpad; giải ở platform gốc, không làm judge.
- Markdown editor trước WYSIWYG; configs có schema thay script tùy ý.
- Sheet trước map; hai visualizers đạt chuẩn trước thêm bốn cái.
- Guest local progress trước learner accounts; Redis có số đo trước cache khắp nơi.
- RAG có citation trước AI tutor; không để AI tự publish kiến thức.

Nếu trễ: giữ quyền truy cập/publish, tính đúng kiến thức và backup; giảm số editorial/visualizer hoặc hoãn map/Redis production/personal modules. Ghi scope mới, không bỏ test để bù thời gian. Ước lượng lại cuối tháng 1, 3, 5 bằng số giờ thực tế và người đọc có tự học qua luồng được không.
