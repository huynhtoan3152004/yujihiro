# Changelog

Hai nguồn, hai mục đích:

| Nguồn | Ai ghi | Nội dung |
|---|---|---|
| [Merge log](merge-log.md) | GitHub Actions, tự động sau mỗi PR merge vào `main` | Ngày, PR, loại, phạm vi, tác giả. Mốc lớn (nhãn `major` hoặc `!`) được nổi bật |
| [CHANGELOG.md](https://github.com/huynhtoan3152004/yujihiro/blob/main/CHANGELOG.md) ở root | Người viết, theo Keep a Changelog | Ý nghĩa thay đổi cho người đọc: thêm bảng, đổi contract, ADR mới |

Quy tắc: PR nào đổi hành vi, schema hay contract thì thêm một dòng vào mục **Unreleased** của `CHANGELOG.md` trong cùng PR. Khi release, đổi Unreleased thành phiên bản + ngày.

Xem [quy trình đầy đủ](../19-docs-workflow.md).
