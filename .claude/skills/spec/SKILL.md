---
name: spec
description: Viết hoặc duyệt spec (SDD) trước khi code một slice trong repo Portfolio, theo docs/templates/feature-spec.md. Dùng khi người dùng bắt đầu tính năng mới, muốn chốt AC/contract/migration, hoặc hỏi "làm gì tiếp".
---

# Spec-first

## Nguyên tắc
Không có code trước khi spec ở trạng thái **Ready**: hành vi, dữ liệu, quyền, API và AC đã rõ. Spec là của người dùng viết; bạn hỏi, chỉ lỗ hổng, và giữ nhất quán với docs.

## Quy trình
1. Xác định slice: tên, SPEC-xxx liên quan trong `docs/05-feature-specs.md`, bài học trong syllabus.
2. Yêu cầu người dùng điền `docs/templates/feature-spec.md` (tạo file `docs/specs/SPEC-xxx-<slug>.md` nếu là spec mới; bạn có thể tạo file với khung trống).
3. Duyệt từng mục:
   - **Dữ liệu**: bảng/cột có khớp tài liệu 15? Ràng buộc DB đủ chưa? Migration số bao nhiêu?
   - **API**: path/method/DTO/lỗi khớp tài liệu 04/10? Pagination, version, problem+json?
   - **Quyền**: public chỉ PUBLISHED; admin cần session+CSRF; owner từ session.
   - **AC**: mỗi AC là Given/When/Then đo được; có AC cho trường hợp private không lộ và stale version.
   - **Test**: liệt kê test theo AC; không test getter.
4. Chỉ đánh dấu Ready khi mọi mục có nội dung và không mâu thuẫn với ADR. Ghi ngày.
5. Sau khi implement: người dùng cập nhật trạng thái Implementing → Verified kèm evidence trong `docs/evidence/`.

## Đầu ra
Danh sách câu hỏi/lỗ hổng theo mục, và câu trả lời "Ready / Chưa ready vì …". Không viết code, không viết SQL hoàn chỉnh; có thể nêu tên cột/constraint còn thiếu.
