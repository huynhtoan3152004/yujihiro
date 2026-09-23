# website/ — site tài liệu (Docusaurus)

Site này render thư mục `../docs` của monorepo. Không copy hay viết tài liệu trong `website/`; mọi nội dung nằm ở `docs/`.

## Chạy local

```bash
cd website
npm ci
npm start
```

Mở http://localhost:3000. Sửa file trong `docs/` sẽ hot-reload.

## Kiểm tra trước khi mở PR

```bash
cd website
npm run build
```

Build fail khi có link hỏng, id trong `sidebars.ts` không tồn tại, hoặc Markdown lỗi. CI chạy đúng lệnh này trên mọi PR chạm `docs/**` hoặc `website/**`.

## Deploy

Workflow `.github/workflows/docs-deploy.yml` build và đẩy lên GitHub Pages mỗi khi có commit vào `main`. Xem [docs/19-docs-workflow.md](../docs/19-docs-workflow.md) để hiểu toàn bộ quy trình, gồm merge log tự động.

## Thêm tài liệu mới

1. Tạo `docs/NN-ten-tai-lieu.md` (tiền tố số chỉ để sắp xếp; id là phần còn lại).
2. Thêm id vào nhóm phù hợp trong `sidebars.ts`.
3. Nếu là quyết định kiến trúc, ghi thêm một dòng trong `CHANGELOG.md` mục Unreleased.
