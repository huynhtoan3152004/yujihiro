---
name: git-workflow
description: Quy trình Git của repo Portfolio — nhánh, Conventional Commits, PR, squash merge, CHANGELOG. Dùng khi người dùng hỏi cách commit/mở PR, nhờ kiểm tra message, hoặc yêu cầu tạo commit/PR.
---

# Git workflow

Chi tiết ở `docs/19-docs-workflow.md` và `CONTRIBUTING.md`.

## Quy tắc
- Nhánh: `type/<scope>-<mô-tả-ngắn>` (`feat/be-project-publish`). Không làm việc trực tiếp trên `main`.
- Commit: `type(scope): mô tả ở thì hiện tại, ≤ 72 ký tự`. type ∈ feat fix docs style refactor perf test build ci chore revert; scope ∈ be fe docs db ci repo (hoặc module cụ thể). Breaking: `type(scope)!:` + `BREAKING CHANGE:` trong body.
- Một commit = một ý; PR = một việc; squash merge với tiêu đề PR đúng chuẩn.
- Trước commit: chạy lệnh kiểm tra của phần thay đổi (BE test, FE lint+build, docs build).
- Không commit secret/.env/build output. Hook pre-commit chặn nhưng đừng dựa vào nó.

## Khi được yêu cầu tạo commit
1. `git status` và `git diff --staged` (hoặc `git diff`) để hiểu thay đổi; không add file không liên quan.
2. Đề xuất message; nếu người dùng đồng ý (hoặc đã yêu cầu rõ "commit đi"), commit với message đó + dòng attribution của tool.
3. Không `--no-verify`, không amend commit đã push.

## Khi được yêu cầu mở PR
1. Kiểm tra nhánh đã push chưa; `gh pr create` với tiêu đề Conventional Commits và body theo `.github/PULL_REQUEST_TEMPLATE.md` (mục đích, link spec/bài học, lệnh đã chạy, docs cập nhật?).
2. Nhắc thêm dòng `CHANGELOG.md` Unreleased nếu đổi hành vi/schema/contract.
3. Nhắc gắn nhãn `major` nếu là mốc lớn (để merge log nổi bật).

## Kiểm tra message
Regex hook: `^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9._/-]+\))?!?: .+`. Message hợp lệ khác: bắt đầu bằng `Merge `, `Revert `, `fixup! `, `squash! `.
