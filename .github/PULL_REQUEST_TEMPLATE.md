<!-- Tiêu đề PR theo Conventional Commits: type(scope): mô tả. Squash merge dùng tiêu đề này. -->

## Mục đích

<!-- Vì sao cần thay đổi này? Link spec / AC / bài học. -->

- Spec / AC:
- Bài học (docs/mentor/syllabus.md):

## Thay đổi chính

-

## Quyết định đáng chú ý

<!-- Có gì bạn đã cân nhắc và chọn khác? Vì sao? -->

## Đã kiểm tra

<!-- Dán lệnh và kết quả tóm tắt -->

```text
```

## Checklist

- [ ] Tiêu đề PR đúng `type(scope): …`
- [ ] Docs cập nhật, hoặc giải thích vì sao không cần
- [ ] `CHANGELOG.md` Unreleased có dòng mới (nếu đổi hành vi/schema/contract)
- [ ] Không có secret / `.env` / build output trong diff
- [ ] Migration (nếu có): chạy trên DB rỗng, có kế hoạch rollback
- [ ] Tự review theo `docs/mentor/review-checklists.md`
- [ ] Gắn nhãn `major` nếu là mốc lớn
