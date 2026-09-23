# Frontend Portfolio & Learning Hub

Frontend hiện có dùng React, TypeScript, Vite, Tailwind và các component UI trong src/. Backend chính là Spring Boot trong ../backend-portfolio/.

## Chạy và kiểm tra

Từ thư mục frontend-portfolio/, dùng npm ci để cài theo lockfile, npm run dev để chạy local, npm run build để kiểm tra TypeScript/build và npm run lint để chạy lint. Các lệnh cần môi trường Node/npm tương thích dependencies hiện có.

## Hướng triển khai

VSCodeLayout cho portfolio; BlogLayout cho bài cá nhân; LearningLayout cho roadmap, concept, pattern và problem workspace. Dùng React Router cho URL; API prefix /api/v1. Hiện App còn dùng state chuyển trang và dữ liệu mẫu, chưa hoàn tất các layout/API này.

Markdown được render có kiểm soát. Visualizer chạy thuật toán TypeScript đã review, đối chiếu với code Java trong lời giải; không chạy code khách nhập. Guest progress local; nội dung riêng của owner lấy qua API bảo vệ bằng session.

- [Tổng quan](../docs/README.mdx).
- [Trải nghiệm sản phẩm](../docs/09-product-learning-experience.md).
- [Thư viện đã chọn](../docs/11-technology-adoption.md).
- [Backlog](../docs/12-delivery-backlog.md).

## Deploy (Vercel)

`vercel.json` proxy `/api/*` sang backend trên VPS để FE và API cùng origin (cookie/CSRF đơn giản, xem [ADR-012](../docs/02-stack-decisions.md#adr-012--deploy-fe-trên-vercel-be-trên-vps-cùng-origin-qua-rewrite-proxy) và [tài liệu 16](../docs/16-repository-strategy.md#deploy-fe-trên-vercel-be-trên-vps--vẫn-không-cần-tách-repo)). Trước khi deploy thật:

1. Sửa `REPLACE_WITH_DOMAIN` trong `vercel.json` thành domain thật của backend.
2. Vercel dashboard → Project Settings → Root Directory = `frontend-portfolio`. Bỏ qua build khi thư mục này không đổi đã khai báo sẵn bằng `ignoreCommand` trong `vercel.json`.
3. Project Settings → Deployment Checks → thêm check GitHub `Frontend · lint + build` để production chỉ lên khi CI xanh. Toàn bộ pipeline ở [tài liệu 20](../docs/20-ci-cd.md).
