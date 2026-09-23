# Cách làm việc với mentor AI

## 1. Hợp đồng

| Bạn | Mentor AI |
|---|---|
| Viết toàn bộ code trong `backend-portfolio/` và `frontend-portfolio/` | Không viết code ứng dụng; không tạo file source; không sửa file của bạn |
| Đưa ra kế hoạch trước khi code | Đặt câu hỏi ngược, chỉ ra lỗ hổng, so với spec/ADR |
| Chạy test/lint/build và dán kết quả | Đọc kết quả, giải thích lỗi, không đoán |
| Tự review theo checklist rồi mới nhờ review | Review theo checklist, xếp finding theo mức độ, có file:line |
| Ghi learning log sau mỗi bài | Nhắc ghi log; hỏi lại điều đã học ở buổi sau |

Ngoại lệ được phép cho AI viết code:

1. **Ví dụ minh họa ≤ 10 dòng, không phải code của dự án** (ví dụ cú pháp `@Version`, một CHECK constraint). Phải kèm câu "đây là minh họa, hãy tự viết bản của bạn".
2. **Cấu hình hạ tầng không phải logic nghiệp vụ**: CI workflow, Docusaurus, hook git, `.editorconfig` — đã làm trong lần setup này.
3. **Test skeleton khi bạn yêu cầu rõ** "viết cho tôi test case tên và Given/When/Then, tôi sẽ điền phần thân".

Ngoài ba trường hợp trên, nếu AI bắt đầu viết code, hãy dừng nó: "Đừng code, chỉ gợi ý tầng tiếp theo."

## 2. Gợi ý theo tầng (mentor luôn đi từ tầng 1)

| Tầng | Mentor làm gì | Ví dụ với bài "publish project" |
|---|---|---|
| 1. Câu hỏi | Hỏi để bạn tự nhận ra | "Khi publish, bảng nào đổi, cột nào bắt buộc có giá trị?" |
| 2. Khái niệm | Nêu tên khái niệm cần tra | "Xem *optimistic locking* và `@Version` trong JPA" |
| 3. Cấu trúc | Mô tả các bước bằng lời | "Service: load theo id → so version → đổi status → set publishedAt → save; 409 nếu version lệch" |
| 4. Pseudocode | Viết pseudocode, không phải Java | `if (entity.version != expected) throw Conflict` |
| 5. Minh họa | ≤ 10 dòng, không phải file của bạn | Chỉ khi bạn nói "cho tôi xem minh họa" |

Bạn có quyền yêu cầu nhảy tầng ("cho tầng 3 luôn"), nhưng mentor sẽ ghi vào learning log rằng bài đó bạn cần tầng cao — để buổi sau ôn lại.

## 3. Cách hỏi để được dạy tốt

Mẫu tốt:

```text
Bài: Lesson 02 — Project entity.
Tôi đã làm: entity Project với 8 cột, migration V1, test contextLoads pass.
Tôi bị kẹt: ddl-auto=validate báo "wrong column type encountered in column tech_stack".
Tôi nghĩ: do text[] map sang String. Đúng không? Gợi ý tầng 2 thôi.
```

Mẫu xấu: "Làm cho tôi Project entity." → mentor sẽ từ chối và hỏi lại kế hoạch của bạn.

## 4. Review

Bạn tự review trước bằng [checklist](review-checklists.md). Sau đó gọi `/review` (Claude Code) hoặc dán diff và nói "review theo docs/mentor/review-checklists.md". Mentor trả về:

- Finding xếp theo **Cao / Trung bình / Thấp**, mỗi cái có `file:line`, vì sao sai, hậu quả, và **câu hỏi dẫn** thay vì code sửa.
- Một mục "Điểm tốt" ngắn — để bạn biết cái gì nên giữ.
- Một câu hỏi kiểm tra hiểu bài.

Finding mức Cao phải sửa trước merge. Mức Trung bình sửa hoặc mở issue. Mức Thấp tùy.

## 5. Khi bạn dùng tool AI khác

Mọi rule nằm trong file văn bản thường:

- `AGENTS.md` (root) — rule chung, tool nào cũng đọc.
- `.claude/skills/*/SKILL.md` — quy trình từng việc (mentor, review, spec, git, migration, docs).
- `docs/mentor/*` — nội dung học.

Với Cursor: `.cursor/rules/project.mdc` đã trỏ về `AGENTS.md`. Với Copilot: `.github/copilot-instructions.md`. Với Gemini CLI: `GEMINI.md`. Với ChatGPT/Claude.ai web: dán `AGENTS.md` + SKILL.md của việc đang làm vào đầu cuộc trò chuyện.

## 6. Nhịp học đề xuất

Mỗi buổi 2–3 giờ: 20 phút đọc đề + viết kế hoạch → 90 phút code + test → 20 phút tự review → 15 phút AI review + sửa → 10 phút learning log. Mỗi tuần một PR merge vào `main` là đủ; merge log sẽ tự ghi lại tiến độ.
