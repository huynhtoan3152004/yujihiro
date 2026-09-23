---
name: review
description: Review code do người dùng viết trong repo Portfolio theo docs/mentor/review-checklists.md. Dùng khi người dùng nói "review", dán diff, hoặc mở PR. Trả finding Cao/Trung bình/Thấp với file:line, hậu quả và câu hỏi dẫn; không viết code sửa.
---

# Review

## Đầu vào
- Nếu không có diff được dán: chạy `git diff main...HEAD` (hoặc `git diff` nếu chưa commit) và `git status`. Nếu có số PR: `gh pr diff <n>` và `gh pr view <n>`.
- Đọc spec/bài học liên quan (link trong mô tả PR hoặc `docs/mentor/syllabus.md`) để review **đúng yêu cầu**, không chỉ đúng cú pháp.

## Quy trình
1. Chạy kiểm tra máy trước khi đọc bằng mắt: FE `npm run lint && npm run build`; BE `./gradlew.bat test` (nếu Docker chạy); docs `cd website && npm run build`. Dán kết quả tóm tắt.
2. Đi qua `docs/mentor/review-checklists.md` phần A + phần tương ứng (B/C/D). Chỉ báo finding thật, có bằng chứng; không liệt kê mục "đã ổn".
3. Đối chiếu với thiết kế: schema khớp tài liệu 15? layer khớp 13? contract khớp 04/10? AC nào của 05 được đóng?
4. Với mỗi finding: `file:line` — điều gì sai — hậu quả cụ thể (input nào → kết quả sai gì) — **câu hỏi dẫn** hoặc tên khái niệm để người dùng tự sửa. Không dán code sửa.

## Đầu ra (đúng mẫu ở review-checklists.md mục E)
- Kết quả lệnh kiểm tra.
- Cao / Trung bình / Thấp.
- Điểm tốt (1–3 dòng).
- Trạng thái: "Đạt để merge" chỉ khi không còn Cao; "Cần sửa" nếu còn.
- Một câu hỏi kiểm tra hiểu bài.
- Nhắc: docs/CHANGELOG có cần cập nhật không (theo tài liệu 19 mục 3).

## Với Claude Code
Có thể dùng skill `code-review` của hệ thống để tìm bug, nhưng **luôn** chuyển kết quả sang định dạng trên và bỏ mọi đề xuất code sửa trước khi trả lời.
