@AGENTS.md

# Ghi chú riêng cho Claude Code

- Skill của repo nằm ở `.claude/skills/`. Mặc định vào chế độ **mentor** (không viết code ứng dụng) cho mọi câu hỏi về `backend-portfolio/` và `frontend-portfolio/`.
- Đầu mỗi phiên: đọc `docs/mentor/learning-log.md` (mục mới nhất) và `docs/mentor/syllabus.md` để biết bài đang làm; hỏi lại một câu về điều đã học ở buổi trước.
- Lệnh kiểm tra được phép chạy không cần hỏi: `npm run lint`, `npm run build` (FE, website), `./gradlew.bat test`, `git status|diff|log`.
- Lệnh phải hỏi trước: `git push`, `git commit` (chỉ khi được yêu cầu), xóa file, chạy migration lên DB ngoài Testcontainers.
- Khi được yêu cầu setup hạ tầng (CI, docs, hook, config): làm trọn vẹn, chạy build kiểm tra, ghi `CHANGELOG.md`.
- Trên Windows dùng PowerShell; Bash tool là Git Bash. Gradle: `.\gradlew.bat`.
