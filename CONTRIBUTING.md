# Đóng góp / quy trình làm việc

Repo này hiện do một người phát triển, nhưng quy trình được thiết kế như một team nhỏ để luyện thói quen. Chi tiết và sơ đồ ở [docs/19-docs-workflow.md](docs/19-docs-workflow.md).

## Thiết lập một lần trên mỗi máy

```bash
git config core.hooksPath .githooks
```

Yêu cầu: JDK 21, Node 20+ (đang dùng 24), Docker Desktop (Testcontainers), Git 2.40+. Windows: hook chạy qua Git Bash đi kèm Git for Windows.

## Vòng làm việc

1. `git switch main && git pull`
2. `git switch -c feat/<scope>-<mô-tả>`
3. Viết spec hoặc cập nhật spec (SDD) nếu đổi hành vi — xem `.claude/skills/spec/SKILL.md`.
4. Code + test. Chạy kiểm tra của phần thay đổi:
   - Backend: `cd backend-portfolio && ./gradlew.bat test`
   - Frontend: `cd frontend-portfolio && npm run lint && npm run build`
   - Docs: `cd website && npm run build`
5. Tự review theo `docs/mentor/review-checklists.md`.
6. Commit theo Conventional Commits (`feat(be): …`). Hook từ chối message sai chuẩn và commit chứa `.env`/file lớn.
7. `gh pr create --fill`, điền template. CI phải xanh (4 check bắt buộc: `Backend · test`, `Frontend · lint + build`, `Docs · build`, `PR title`; check của phần không đổi hiện *skipped* = pass). Squash merge.
8. Sau merge: CI ghi merge log và deploy docs. Bạn cập nhật `docs/mentor/learning-log.md` nếu là bài học.

## Commit message

```text
type(scope): mô tả ngắn, thì hiện tại

[body: vì sao, không phải làm gì]

[BREAKING CHANGE: ...]
```

type: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert. scope: be, fe, docs, db, ci, repo (hoặc module: `be/project`).

## Docs đổi cùng code

PR chạm `backend-portfolio/src` hoặc `frontend-portfolio/src` mà không chạm `docs/` sẽ nhận comment nhắc. Trả lời bằng cập nhật docs hoặc giải thích trong PR. Đổi hành vi/schema/contract thì thêm dòng vào `CHANGELOG.md` mục Unreleased.

## Không bao giờ

- Push thẳng lên `main`, force-push `main`.
- Commit secret, `.env`, `node_modules`, `build/`, `dist/`, `graphify-out/`.
- Sửa migration Flyway đã merge (tạo migration mới).
- Merge khi CI đỏ hoặc còn finding mức Cao.
