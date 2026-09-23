# Checklist review

Dùng cho **tự review** trước khi mở PR và cho AI review (`/review`). Mỗi mục là câu hỏi có/không. Finding được xếp: **Cao** (sai hành vi, bảo mật, mất dữ liệu), **Trung bình** (bảo trì, a11y, hiệu năng rõ ràng), **Thấp** (style).

## A. Chung (mọi PR)

- [ ] PR làm đúng **một** việc; tiêu đề `type(scope): …`.
- [ ] Có link spec/AC hoặc bài học; mô tả nêu "vì sao", không chỉ "làm gì".
- [ ] Lint/test/build pass; lệnh và kết quả được dán trong mô tả.
- [ ] Không có secret, `.env`, file build, `node_modules`, `graphify-out/` trong diff.
- [ ] Docs cập nhật hoặc giải thích vì sao không (tài liệu 19 mục 3).

## B. Backend Spring Boot

**Cấu trúc**
- [ ] Controller chỉ: nhận DTO, validate (`@Valid`), gọi service, trả response. Không có query, không có `if` nghiệp vụ.
- [ ] Service giữ transaction (`@Transactional` ở method ghi), quy tắc state transition, kiểm tra version.
- [ ] Repository không có logic; query đặt tên rõ hoặc `@Query` có comment.
- [ ] Entity không trả ra API; có DTO response riêng; mapper thuần.
- [ ] Constructor injection, field `final`; không `@Autowired` trên field.

**Dữ liệu**
- [ ] Migration Flyway có tên `V<n>__<mô-tả>.sql`, idempotent về ý nghĩa, không sửa migration đã merge.
- [ ] Ràng buộc DB khớp tài liệu 15: NOT NULL, UNIQUE, CHECK, FK với ON DELETE rõ.
- [ ] `ddl-auto=validate` pass với Testcontainers.
- [ ] Enum Java khớp CHECK constraint (có test hoặc ghi chú).
- [ ] Không N+1 rõ ràng trong list endpoint (kiểm tra log SQL một lần).

**Quyền và an toàn**
- [ ] Public endpoint chỉ trả PUBLISHED; test có case DRAFT/ARCHIVED không lộ dù biết slug.
- [ ] Admin endpoint yêu cầu session + CSRF; owner lấy từ session, không từ payload.
- [ ] Lỗi trả `application/problem+json`, không stacktrace; 400/401/403/404/409 đúng nghĩa.
- [ ] Không log mật khẩu/token/nội dung private.

**Test**
- [ ] Test hành vi đáng giá: transition, 409 khi stale version, constraint bị vi phạm, quyền.
- [ ] Không test getter/setter; không mock repository trong test tích hợp đã có DB thật.
- [ ] Image Testcontainers có tag cố định.

## C. Frontend React

- [ ] URL là nguồn sự thật cho trang; state UI (tab mở) tách khỏi route.
- [ ] Không side effect trong updater `setState`; effect có cleanup đầy đủ.
- [ ] Không `dangerouslySetInnerHTML`; Markdown qua pipeline an toàn.
- [ ] Component shadcn được dùng thay vì tự vẽ lại (Button/Card/Badge/Dialog…); variant qua `cva`, không nhân đôi class.
- [ ] Màu/kích thước qua token (`--vscode-*`, theme), không hex mới rải trong JSX.
- [ ] Type: union thay `string` cho id trang; props có interface; không `any`.
- [ ] Server state qua TanStack Query (khi đã thêm); có loading/error/empty state.
- [ ] a11y: element tương tác là `button`/`a`; có `aria-*` cho tab/nav; focus nhìn thấy; hoạt động bằng bàn phím.
- [ ] `key` ổn định và duy nhất (không index, không tên trùng).
- [ ] Lint 0 lỗi; không `eslint-disable` không giải thích.

## D. Docs

- [ ] `cd website && npm run build` pass (link, sidebar id).
- [ ] Tài liệu mới có ngày và trạng thái (Draft/Ready/Verified).
- [ ] Không có hai tài liệu mâu thuẫn; nếu thay thế, tài liệu cũ ghi "được thay bởi …".

## E. Mẫu báo cáo review của mentor

```text
## Review PR #12 — feat(be): project publish

### Cao
1. ProjectService.java:41 — publish không kiểm tra expectedVersion → hai admin ghi đè nhau.
   Hậu quả: AC-002.4 fail. Câu hỏi: entity đã có @Version chưa? Spring ném exception nào khi lệch?

### Trung bình
2. ProjectController.java:28 — trả entity trực tiếp; lộ cột nội bộ khi thêm field.

### Thấp
3. Tên `ProjectServiceImpl.doPublish` — "do" không nói gì; đặt theo hành vi.

### Điểm tốt
- Migration V2 có CHECK published_at đúng như tài liệu 15.

### Câu hỏi kiểm tra
- Nếu unpublish rồi publish lại, published_at giữ hay đổi? Vì sao?
```
