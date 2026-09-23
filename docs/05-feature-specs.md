# Đặc tả tính năng và nghiệm thu

> Áp dụng theo giai đoạn trong [DB tối thiểu](14-minimal-database-design.md). MVP dùng status; profile cập nhật aggregate; Learning đầu tiên chưa có prerequisite DAG hoặc nhiều code samples. AC tương ứng mở rộng được hoãn rõ trong spec slice, không coi là đã hoàn thành.

Baseline v3. Triển khai trên React + Java/Spring Boot/Gradle + PostgreSQL; Redis và Spring AI/pgvector bổ sung theo roadmap.

Tất cả spec hiện ở **Draft**, là baseline để người triển khai chốt trước khi code. Các acceptance criteria dưới đây là mục tiêu, chưa được chạy.

## SPEC-001 — Đăng nhập và quản trị dữ liệu portfolio

Mục tiêu: chủ sở hữu chỉnh nội dung Home/About/Skills/Contact mà không sửa JSX. Khách vẫn thấy shell VS Code hiện tại.

Phạm vi: một admin; login/logout; profile, focus, typing texts, socials, skills, certificates, stats; API public đọc. Không có sign-up, newsletter hay gửi email.

Acceptance criteria:

- AC-001.1: khách gọi mutation admin không session bị 401, database không thay đổi.
- AC-001.2: admin login đúng nhận session cookie; login sai không tiết lộ email tồn tại; giới hạn thử đăng nhập.
- AC-001.3: mutation bằng session thiếu/sai CSRF bị 403; logout vô hiệu session.
- AC-001.4: sửa profile rồi reload FE thấy dữ liệu mới; theme/explorer không bị đưa thành dữ liệu CMS.
- AC-001.5: Markdown chứa script/event handler không thực thi khi render Home/About.
- AC-001.6: API lỗi có giao diện lỗi/thử lại; data rỗng có empty state; không im lặng thay thành thành tích mẫu.
- AC-001.7: link social chỉ chấp nhận scheme cho phép; public DTO không lộ password hash hay tài khoản nội bộ.

Task: migration admin/profile → bootstrap admin → Security/session/CSRF → read/write DTO → API client → thay imports dữ liệu từng page → kiểm thử quyền và luồng sửa/reload. Lưu ý phải quản trị cả hardcoded Skills và Current Focus, không chỉ `siteData.ts`.

## SPEC-002 — Project case study

Mục tiêu: kể rõ bài toán, vai trò cá nhân, giải pháp, trade-off, kết quả và link bằng chứng cho mỗi dự án.

Nội dung Markdown gợi ý: Context → Constraints → My contribution → Architecture → Hardest decision → Results → Lessons. Kết quả chưa đo thì ghi chưa đo; không dùng số liệu giả cho đẹp.

Acceptance criteria:

- AC-002.1: project mới là DRAFT; list/detail public không thấy dù biết slug.
- AC-002.2: publish đủ trường bắt buộc làm project xuất hiện public; thiếu body/title/summary trả 400.
- AC-002.3: unpublish/archive làm list loại bỏ và detail trả 404 ngay sau commit; cache phải tuân thủ.
- AC-002.4: slug trùng trả 409; ID không tồn tại trả 404; đồng thời sửa cùng version thì chỉ một thao tác thành công.
- AC-002.5: URL `/projects/:slug` mở trực tiếp, refresh/back đúng; CTA Home mở trang thật.
- AC-002.6: không có live/repo URL thì không hiện nút tương ứng; nhiều project có pagination/sort ổn định.
- AC-002.7: trạng thái BUILDING không đồng nghĩa DRAFT; dự án đang làm vẫn có thể public.

Task: Flyway schema → domain/DTO → admin create/edit/action → public queries → FE list/detail → test workflow và concurrency → deploy một project thật.

## SPEC-003 — Blog cá nhân

Mục tiêu: blog riêng với BlogLayout, Markdown/code/tag/series/excerpt/ngày publish. Phân loại TECHNICAL/JOURNEY/REFLECTION; một số bài kể hành trình liên kết concept/problem/solution, còn bài học giữ nội dung chuẩn độc lập. Trải nghiệm đọc tốt trên mobile, không buộc hiển thị dạng code trong VS Code shell.

Acceptance criteria:

- AC-003.1: draft/private không hiện ở list, detail, sitemap, search hay RAG.
- AC-003.2: code fence giữ đúng thụt dòng, có language label; nội dung không execute JavaScript.
- AC-003.3: lọc tag/series trả đúng bài với pagination; series có thứ tự xác định.
- AC-003.4: URL bài mở trực tiếp; bài không tồn tại có 404; HTML public có title/description/canonical riêng qua prerender/SSR ở release blog.
- AC-003.5: sửa nội dung live tăng version; read time được tính từ nội dung hoặc quy tắc nhất quán, không nhập chuỗi mẫu cứng.
- AC-003.6: lưu và publish không phụ thuộc AI; lỗi embedding không làm mất bài.

Task: posts/tags/series → CRUD/action → Markdown editor đơn giản + preview → public reader → URL/metadata → test visibility, Markdown và pagination.

## SPEC-004 — Algorithm learning workspace

Mục tiêu: một nơi ghi lại hành trình hiểu và giải bài theo pattern, có đường học gần cách tổ chức NeetCode nhưng do chủ sở hữu xây dựng nội dung riêng.

Public: concept/pattern, roadmap dạng sheet + map, problem nhiều nền tảng, lời giải có gợi ý và mô phỏng. Private owner: lần thử, thời gian, lỗi sai, trạng thái học và ngày ôn. Khách đánh dấu tiến độ ở browser, ghi rõ chỉ lưu trên thiết bị. Không chấm code, không crawl đề, không mở đóng góp từ người lạ ở v1. SPEC-008/009/010 bên dưới bổ sung acceptance criteria.

Mẫu lời giải bắt buộc khi publish:

1. Link nguồn và cách hiểu bài bằng lời mình.
2. Brute force và lý do cần cải tiến.
3. Insight/pattern và invariant hoặc lập luận tính đúng.
4. Các bước thuật toán và walkthrough trên ví dụ tự chọn.
5. Code Java, độ phức tạp thời gian/bộ nhớ kèm lý do. Schema code samples giữ khả năng mở rộng nội dung về sau.
6. Edge cases, sai lầm đã gặp, khi nào tái sử dụng pattern.

Không phải mọi bài đều có brute force hữu ích; trường hợp đó ghi lý do thay vì bịa một cách giải. Mỗi solution có tiêu đề approach để phân biệt nhiều cách giải cùng ngôn ngữ.

Progress: `NOT_STARTED → LEARNING → SOLVED → REVIEWING`; admin có thể điều chỉnh vì tự đánh giá, không suy ra mastery từ số lần AC. Attempt có `SOLVED | PARTIAL | STUCK`; lịch ôn v1 chọn thủ công, sau đó mới thử spaced repetition. Metric tách số bài duy nhất đã giải, số lần luyện và số bài đến hạn ôn.

Acceptance criteria:

- AC-004.1: một problem có nhiều approach; mỗi approach có code samples được kiểm chứng; v1 tập trung Java; publish solution không làm public notes của attempt.
- AC-004.2: filter pattern+difficulty+platform kết hợp chính xác; problem published có thể chưa có editorial và phải ghi rõ trạng thái, không dẫn vào trang rỗng.
- AC-004.3: ghi hai attempts vẫn tính một bài đã giải; giữ đầy đủ lịch sử.
- AC-004.4: sửa lịch ôn cập nhật danh sách due theo ngày địa phương của owner; không lộ qua API public.
- AC-004.5: người chưa login không đọc/ghi progress dù biết ID.
- AC-004.6: code block chỉ hiển thị; không có endpoint execute code.
- AC-004.7: roadmap item trùng bị từ chối; thứ tự hiển thị giữ sau reload.

Task: problems/patterns/solutions → public catalog và detail → editor lời giải → attempts/progress → roadmap → dashboard ôn → tests privacy và thống kê.

Các API roadmap/pattern/concept/visualizer được định nghĩa trong tài liệu 10; chuyển phần slice cần làm thành OpenAPI trước khi code.

## SPEC-008 — Lộ trình DSA giúp người khác học

Mục tiêu: người mới biết cần học gì trước, vì sao, luyện bài nào và khi nào đi tiếp. Roadmap có audience, prerequisites, learning outcomes; không tuyên bố một thứ tự là tốt nhất cho mọi người.

- AC-008.1: sheet có module/section, filter, số mục khả dụng và link concept/pattern/problem; map là cách nhìn bổ sung cùng dữ liệu.
- AC-008.2: prerequisite graph không có self-loop/cycle; reorder/revision không đổi ID các mục hiện có.
- AC-008.3: progress khách khôi phục sau reload; reset/export/import có xác nhận và validation; thông báo không đồng bộ thiết bị.
- AC-008.4: READ/UNDERSTOOD/SOLVED/REVIEW_DUE phân biệt; đọc lời giải không tự đánh dấu đã giải.
- AC-008.5: người không dùng được canvas vẫn học được bằng sheet và bàn phím.
- AC-008.6: mục private/draft bị lọc khỏi roadmap public, không lộ title trong node/search/related links.

## SPEC-009 — Trực quan hóa thuật toán

- AC-009.1: next/previous/play/pause/reset/speed hoạt động; cùng input/version sinh cùng trace.
- AC-009.2: mỗi step có giải thích text, highlight pseudocode và state, không chỉ animation màu.
- AC-009.3: input vượt giới hạn bị từ chối; trace có giới hạn steps và cancel; không eval code từ CMS hoặc khách.
- AC-009.4: case empty/single/duplicate/not-found được kiểm tra theo thuật toán; input không thỏa điều kiện (ví dụ chưa sorted) hiển thị lỗi rõ.
- AC-009.5: reduced-motion và step table sử dụng được; visualizer lỗi không làm mất bài viết.
- AC-009.6: input hoặc approach đổi thì trace cũ bị hủy; frame cũ không ghi đè frame mới.

## SPEC-010 — Lời giải để hiểu và chuyển giao

- AC-010.1: gợi ý tăng dần được mở chủ động; có câu hỏi dự đoán trước bước tiếp theo và giải thích đáp án.
- AC-010.2: solution có insight, invariant/proof, complexity, edge cases, phản ví dụ khi cách làm không áp dụng.
- AC-010.3: bài có source platform và nút giải ở nguồn; không gắn nhãn code chạy thành công nếu chưa kiểm chứng.
- AC-010.4: có bài tương tự/biến thể kèm lý do liên kết; quay về đúng pattern/roadmap từ breadcrumb.
- AC-010.5: blog hành trình được hiển thị như nội dung liên quan; không trộn lỗi thử nghiệm cũ thành hướng dẫn đúng.
- AC-010.6: editorial mặc định gấp chỉ là hỗ trợ tự học, không phải paywall; nội dung public không cần bảo mật khỏi người muốn xem.

## SPEC-005 — Public RAG

Mục tiêu: hỏi về dự án, kỹ năng được chứng minh qua bài viết, và hành trình học đã công khai. Dùng thiết kế tài liệu 06.

Acceptance criteria:

- AC-005.1: câu hỏi có bằng chứng trả câu trả lời cùng citation link/heading/revision có thật.
- AC-005.2: thiếu bằng chứng trả `grounded: false` và nói chưa có thông tin; không tự bịa kinh nghiệm.
- AC-005.3: không có draft, private attempts, habit, vision hoặc nội dung vừa unpublish trong context/citations.
- AC-005.4: job retry/restart không tạo chunk trùng; job bản cũ không overwrite bản mới.
- AC-005.5: model timeout/quota trả lỗi có thể hiểu, không ảnh hưởng chức năng đọc portfolio.
- AC-005.6: câu lệnh độc hại trong bài viết không cấp quyền, chạy tool hoặc truy cập dữ liệu private.
- AC-005.7: có bộ câu hỏi cố định và báo cáo retrieval/citation/abstention trước public; latency ghi theo thực nghiệm.

## SPEC-006 — Habit (Later)

Daily check-in và lịch sử trước, streak sau. Owner-only, một check-in/habit/ngày địa phương; sửa check-in thay bản cùng ngày. Lịch weekly và đổi timezone cần định nghĩa riêng trước khi dùng; không âm thầm tính lại lịch sử. Acceptance: duplicate không tăng count; khách nhận 401; đổi ngày UTC không làm check-in sai ngày địa phương. Chỉ làm khi thật sự định dùng hằng ngày.

## SPEC-007 — Visionboard (Later)

Board/card gồm ảnh, mô tả mục tiêu, target date tùy chọn và thứ tự. Private mặc định; CRUD, reorder bền sau reload; assets private cần authorization/signed URL. Acceptance: khách không đọc board lẫn ảnh; reorder không mất card; xóa card không làm hỏng asset còn được tham chiếu. Chưa có public sharing, collaboration hay AI tạo mục tiêu.

## Definition of Done dùng chung

Schema/migration có thể chạy từ DB rỗng; API đúng contract; server thực thi quyền; FE có error/empty/loading; các AC rủi ro được kiểm tra; secrets không nằm trong source; spec ghi trạng thái và bằng chứng. CI xanh không thay thế kiểm tra luồng người dùng.
