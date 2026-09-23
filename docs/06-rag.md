# RAG với Spring AI và pgvector

Baseline v3. API, indexing worker, retrieval và đánh giá tích hợp được triển khai bằng Java trong project backend-portfolio/.

## Phạm vi đầu tiên

Chat về project, blog, concept, pattern và solution đã publish public. Profile/CV chỉ thêm khi có nguồn được chủ sở hữu duyệt. Không cần fine-tune, agent hay knowledge graph để bắt đầu. PostgreSQL giữ nội dung gốc; pgvector giữ embedding dẫn xuất; Spring AI là adapter gọi provider. Có thể dùng JDBC để kiểm soát query visibility/revision rõ ràng.

Metadata bổ sung `contentKind`, `topic`, `problemId`, `approach`, `language`. Blog JOURNEY là trải nghiệm tác giả, không mặc nhiên là nguồn chứng minh thuật toán. Ưu tiên concept/solution cho câu hỏi kiến thức; trích dẫn ngày/revision khi kể hành trình. Chỉ index phần giải thích text của visualization, không index frame JSON hoặc đề từ link ngoài. V1 chat trả lời có nguồn; tutoring theo hints là spec sau, không tự gọi model mỗi animation step.

pgvector là extension duy nhất dùng để lưu và truy vấn embedding trong PostgreSQL. [Tài liệu Spring AI PGvector](https://docs.spring.io/spring-ai/reference/api/vectordbs/pgvector.html).

## Publish → index

1. Transaction lưu nội dung, tăng source revision, cập nhật trạng thái document và tạo durable index job trong cùng commit.
2. Poller lấy job đến hạn bằng lease/locking; không giữ transaction DB trong lúc gọi embedding API.
3. Đọc source theo revision hiện tại; job cũ bỏ qua. Chuẩn hóa Markdown, chia theo heading, giữ code block và đoạn giải thích cùng ngữ cảnh khi có thể.
4. Mốc thử đầu: khoảng 400–800 token/chunk, overlap vừa phải khi cần; chỉnh bằng eval, không coi đây là tham số tối ưu mặc định cho mọi bài.
5. Gọi embedding provider; model và dimension được pin. Ghi chunk với source ID, revision, heading, checksum, ordinal, URL canonical.
6. Transaction cuối khóa/recheck source revision và visibility. Chỉ activate revision nếu vẫn hợp lệ. Nếu publish/unpublish/update xảy ra lúc gọi provider, kết quả cũ bị loại. Xóa/retire chunk cũ sau khi chuyển revision thành công.

Retry có backoff và giới hạn; job hết lease được lấy lại; trạng thái FAILED hiển thị admin và có retry. Unique key khiến việc chạy lại không nhân bản chunk. Dùng bảng jobs làm hàng đợi bền trong PostgreSQL cho nhu cầu này. Có job reconcile để phát hiện source chưa có index đúng revision.

Khi unpublish/delete: source bị chặn public ngay trong transaction; document được đánh dấu không active và tạo job cleanup. Query không dựa vào việc vector đã xóa hay chưa. Khi sửa live, v1 chấp nhận tạm chưa tìm thấy source cho đến khi index revision mới xong, tránh trả nội dung cũ.

## Question → answer

1. Giới hạn độ dài câu hỏi, request rate và budget. Không cho client chọn scope private.
2. Embed câu hỏi bằng đúng model/dimension của corpus đang active.
3. Retrieve chỉ các source hiện PUBLISHED + PUBLIC, revision chunk khớp source live. Có thể bắt đầu exact vector search; thêm keyword search khi eval cho thấy thuật ngữ như tên project, O(n), Java bị bỏ sót.
4. Nếu cần hybrid: PostgreSQL full-text với cấu hình `simple` làm baseline cho nội dung tiếng Việt/Anh, thử rank fusion; không giả định `simple` hiểu hình thái tiếng Việt. Đo trước khi thêm reranker.
5. Recheck source eligibility trước gửi context đến provider. Context ít, liên quan; loại trùng; không nhét cả website vào prompt.
6. Prompt yêu cầu chỉ khẳng định điều có bằng chứng và dẫn nguồn. Retrieved text là dữ liệu không tin cậy, không phải system instruction. Chat v1 không có tool/action.
7. Backend kiểm tra citations thuộc tập context được phép, recheck quyền trước trả response; nếu source bị thu hồi giữa chừng thì bỏ kết quả và yêu cầu thử lại. Không thể thu hồi dữ liệu đã gửi provider trước thời điểm unpublish; đây là giới hạn thời gian cần hiểu rõ.

POST `/api/v1/public/chat`: `{ "question": "Bạn học được gì khi xây portfolio?" }`; tối đa 2.000 ký tự cho baseline. 200:

```json
{
  "answer": "...",
  "grounded": true,
  "citations": [
    { "sourceId": "uuid", "title": "Portfolio", "url": "/projects/portfolio", "heading": "Lessons", "revision": 3 }
  ]
}
```

V1 stateless, chưa lưu chat history và chưa streaming để kiểm soát câu trả lời/citation đơn giản hơn. Không đủ nguồn vẫn 200 với grounded=false, citations rỗng. Timeout 503; vượt quota 429. Giới hạn concurrency, tokens đầu ra, daily spend; timeout tổng đặt hữu hạn và đo lại. Không log toàn bộ câu hỏi mặc định.

## Index và schema

Vector dimension phụ thuộc **embedding model**, không phải chat LLM. Đổi model cần re-embed toàn corpus trong index version mới, chạy eval rồi mới chuyển; không trộn hai không gian embedding dù cùng dimension.

Khởi đầu exact search để có baseline recall. HNSW chỉ thêm khi cần: nó đánh đổi dung lượng, thời gian build và recall; filter có thể làm giảm số kết quả, cần đo và cân nhắc iterative scans. Không có bảo đảm chatbot dưới 2 giây từ việc tạo index. [pgvector README](https://github.com/pgvector/pgvector).

Spring AI vector store không tự biết quyền domain hoặc trạng thái publish. Nếu metadata filtering không biểu đạt đủ live revision/joins, dùng adapter JDBC riêng. Flyway quản lý schema; tránh để thư viện tự tạo bảng không khớp contract.

## Bộ đánh giá trước public

Tạo khoảng 30–50 câu hỏi viết tay từ nội dung thật, có expected source và câu trả lời chấp nhận được. Nhóm gồm câu có đáp án, câu cần nhiều nguồn, câu thiếu thông tin, câu ngoài phạm vi, câu tiếng Việt/Anh, nội dung vừa cập nhật/unpublish, và prompt injection.

Theo dõi Recall@k trên nguồn kỳ vọng, citation accuracy, groundedness, tỷ lệ từ chối đúng, latency p50/p95, tokens và chi phí/request. Mục tiêu khởi điểm: không lộ private trong toàn bộ test; mọi citation trỏ source thật được phép; ít nhất 90% câu answerable có expected source trong top-5 trên tập nhỏ. Đây là ngưỡng dự kiến để cải tiến, không phải chất lượng đã đạt hay đảm bảo tuyệt đối ngoài tập test.

Privacy tests là release gate; quality test có đánh giá thủ công kèm kết quả tự động. Test model mock cho retry/timeout; một eval live có kiểm soát ngân sách để đo chất lượng thật. Nếu không đạt, ưu tiên sửa dữ liệu/chunk/retrieval trước đổi model hoặc thêm agent.

## Mở rộng worker và private RAG

Khi indexing cần tài nguyên hoặc lịch deploy riêng, tách Java worker thành ứng dụng Spring Boot. Giữ job protocol có lease, revision và idempotency; chuyển data ownership và contract theo tài liệu 03. Source public eligibility vẫn được xác minh với service sở hữu nội dung, không chỉ dựa vào index copy.

Private RAG là spec mới: collection và endpoint riêng, owner từ session, private retrieval tests, chính sách provider và logging riêng. Habit/vision không tự động được index. Nội dung backend gửi model bên ngoài có thể được provider xử lý theo điều khoản của họ; cấu hình provider và phạm vi dữ liệu được gửi phải được ghi rõ trong đặc tả.
