---
name: docs-sync
description: Giữ docs/, sidebar Docusaurus và CHANGELOG đồng bộ với thay đổi code trong repo Portfolio. Dùng sau khi một slice xong, khi CI nhắc "code đổi mà docs không đổi", hoặc khi thêm tài liệu mới.
---

# Docs sync

## Khi nào phải cập nhật gì
Theo bảng ở `docs/19-docs-workflow.md` mục 3: endpoint/DTO → 04/10; migration khác thiết kế → 15; quyết định kiến trúc → ADR mới trong 02; AC hoàn thành → 05 + `docs/evidence/`; thư viện mới → 11; bài học xong → `docs/mentor/learning-log.md` và trạng thái trong `syllabus.md`.

## Quy trình
1. `git diff main...HEAD --stat` để biết thư mục đổi. Xác định tài liệu cần đổi theo bảng trên.
2. Sửa tài liệu ở `docs/` (không sửa trong `website/`). Tài liệu mới: `docs/NN-slug.md`, có ngày và trạng thái ở đầu.
3. Thêm id vào `website/sidebars.ts` đúng nhóm. Id = tên file bỏ tiền tố `NN-` và `.md`; file trong thư mục con có tiền tố thư mục (`mentor/lessons/lesson-03-...`).
4. Thêm dòng vào `CHANGELOG.md` mục Unreleased (Added/Changed/Fixed/Removed).
5. Chạy `cd website && npm run build`. Sửa mọi link hỏng (build fail là chủ ý).
6. Nếu tài liệu mới thay thế tài liệu cũ: thêm ghi chú "Được thay bởi …" ở đầu tài liệu cũ, không xóa.

## Được phép
Sửa trực tiếp `docs/**`, `website/sidebars.ts`, `CHANGELOG.md`. Không sửa `docs/changelog/merge-log.md` phần bảng (do CI ghi).
