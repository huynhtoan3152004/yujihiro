# Dữ liệu và hợp đồng API chung

> Phạm vi tham khảo mở rộng. Khi triển khai, dùng [DB tối thiểu](14-minimal-database-design.md) làm baseline: status thay cặp status/visibility, profile lưu như một aggregate, learning schema gọn hơn. Điều chỉnh DTO của slice trước khi code; không triển khai toàn bộ bảng dưới đây ngay.

Baseline v3. Java/Spring Boot, PostgreSQL, Flyway; frontend React dùng contract này. Learning chi tiết tại tài liệu 10.

Đây là contract thiết kế để triển khai từng giai đoạn, chưa phải OpenAPI đã thực thi. Khi bắt đầu mỗi slice, viết schema OpenAPI tương ứng và kiểm tra request/response theo spec; không dựng mọi bảng ngay.

## Quy ước

UUID cho ID; timestamp UTC với `timestamptz`; ngày habit theo timezone owner. Entity chỉnh sửa có `created_at`, `updated_at`, `version` optimistic lock. Slug unique trong từng loại nội dung; v1 slug bất biến sau lần publish đầu, muốn đổi cần spec redirect. Enum nghiệp vụ dùng string + DB check constraint.

Nội dung có `DRAFT | PUBLISHED | ARCHIVED` và `PRIVATE | PUBLIC`. Public query luôn yêu cầu cả `PUBLISHED` lẫn `PUBLIC`. Private cho admin xem; không thêm UNLISTED trước khi định nghĩa chính xác hành vi search/RAG.

V1 sửa nội dung đã publish sẽ cập nhật bản live ngay khi Save. Nếu muốn sửa nháp mà bản cũ vẫn live, thêm content revisions riêng ở phase sau; không ngầm giả định đã có workflow này.

## Mô hình theo giai đoạn

| Bảng | Các trường quan trọng và constraint |
|---|---|
| admin_users | id, email unique, password_hash, role, enabled |
| profiles | owner_id unique FK, display_name, roles JSONB, greeting, bio_markdown, focus_items JSONB, typing_texts JSONB, company, location, public_email, public_phone nullable |
| social_links | owner_id FK, platform, url, sort_order |
| skills | owner_id FK, name, category, description, sort_order |
| certifications | owner_id FK, name, issued_year, credential_url nullable |
| profile_stats | owner_id FK, label, display_value, source_note, sort_order; chỉ số suy ra như số project nên tính từ DB |
| projects | owner_id FK, slug unique, title, summary, body_markdown, emoji, category, tech_stack text[], repo_url/live_url nullable, team_size, lifecycle_status, personal_role, sort_order, featured, status, visibility, published_at |
| posts | owner_id FK, slug unique, title, excerpt, body_markdown, post_kind TECHNICAL/JOURNEY/REFLECTION, series_id nullable FK, status, visibility, published_at |
| tags / post_tags | tag slug unique; liên kết unique(post_id, tag_id) |
| series | owner_id FK, slug unique, title, description; thứ tự bài qua series_position trên post |
| problems / problem_sources | Problem nội bộ, nhiều nguồn/platform có link riêng; constraints theo tài liệu 10 |
| concepts / patterns / problem_patterns | Kiến thức nền, pattern và quan hệ với bài; curriculum sở hữu concept/pattern |
| solutions / solution_code_samples | Một approach có nhiều code sample ngôn ngữ; giải thích/invariant/complexity theo tài liệu 10 |
| attempts | owner_id FK, problem_id FK, attempted_at, outcome, duration_minutes, notes_markdown, next_review_on; private |
| roadmaps / roadmap_sections / roadmap_items | Lộ trình chứa concept, pattern, problem; đúng một FK mục tiêu; cấu trúc lộ trình chuẩn |
| learning_progress | owner_id + problem_id unique, state, next_review_on; trạng thái theo người, không nằm trên problems |
| habits / habit_checkins | owner_id, schedule, timezone; checkin unique(habit_id, local_date), value; private |
| vision_boards / vision_cards | owner_id, title, image_asset_id nullable, goal_text, target_date nullable, position; private |
| media_assets | owner_id, object_key unique, mime_type, size, visibility; không dùng URL tùy ý làm quyền |

MVP chỉ tạo identity + portfolio. Post/algorithm/personal tạo bằng migration khi đến slice. `lifecycle_status` của project (BUILDING/COMPLETED/OPERATING) khác publish status. Không dùng một bảng generic `items` chứa JSON cho tất cả.

Hỗ trợ LeetCode, Codeforces, AtCoder, CSES, HackerRank hoặc bài tự biên soạn qua problem_sources. Chỉ gộp nguồn khi thực sự cùng đề/constraints; bài cùng pattern thường là problem khác. Một problem có nhiều solution theo approach; solution có nhiều code samples. Nhật ký attempt không tự động công khai. [Tài liệu 10](10-learning-domain-api.md) là contract chi tiết cho learning.

Knowledge: `documents(id, project_id?, post_id?, solution_id?, concept_id?, pattern_id?, source_revision, visibility, index_state)` với đúng một FK nguồn không-null và unique trên mỗi FK; `chunks(document_id, source_revision, ordinal, heading, text, checksum, embedding_model, embedding_dimensions, embedding)` unique(document_id, source_revision, ordinal); `index_jobs(document_id, revision, kind, state, attempts, available_at, lease_until, last_error)` unique(document_id, revision, kind). Vector dimension chốt theo embedding model. Xem tài liệu 06 và 10; không index trace JSON thô hoặc nội dung đề từ website ngoài.

## Hợp đồng HTTP chung

Prefix `/api/v1`. List: `page` bắt đầu 0, `size` mặc định 20/tối đa 100; stable order có ID tie-breaker. Response `{ "items": [], "page": 0, "size": 20, "total": 0 }`. Nội dung public không chứa owner email nội bộ hoặc private notes.

Lỗi dạng `application/problem+json`: `type`, `title`, `status`, `detail`, `instance`, `code`, `fieldErrors` tùy chọn. 400 validation; 401 thiếu session; 403 không có quyền/CSRF; 404 public resource không tồn tại hoặc không public; 409 slug/version conflict; 429 quota; 503 provider tạm lỗi. Không trả stacktrace.

## Routes chính

| Method + path | Ý nghĩa |
|---|---|
| GET `/auth/csrf` | Cấp CSRF token cho client trước login/mutation |
| POST `/auth/login` | Email/password, CSRF; thành công set cookie |
| POST `/auth/logout` | CSRF; invalidate session |
| GET `/auth/me` | Admin session hiện tại hoặc 401 |
| GET `/public/profile` | Profile + socials + skills + certifications + stats public |
| PUT `/admin/profile` | Cập nhật profile, cần version; collections có endpoint CRUD bên dưới |
| POST/PUT/DELETE `/admin/{skills,social-links,certifications,profile-stats}[/{id}]` | Collection CRUD; PUT/DELETE có id, POST không có id |
| GET `/public/projects` | Pagination, filter tech, featured |
| GET `/public/projects/{slug}` | Case study published/public |
| GET/POST `/admin/projects` | List gồm drafts / tạo draft |
| GET/PUT `/admin/projects/{id}` | Chi tiết admin / cập nhật kèm version |
| POST `/admin/projects/{id}/{publish,unpublish,archive}` | Action với expectedVersion |
| GET `/public/posts` | Pagination, tag, series |
| GET `/public/posts/{slug}` | Markdown + metadata |
| GET/POST `/admin/posts` | List / tạo post |
| GET/PUT `/admin/posts/{id}` | Chi tiết / cập nhật |
| POST `/admin/posts/{id}/{publish,unpublish,archive}` | Action với expectedVersion |
| GET `/public/algorithms/problems` | Catalog published/public, lọc pattern/difficulty/platform; có thể chưa có editorial |
| GET `/public/algorithms/problems/{slug}` | Metadata + các solution public |
| GET/POST `/admin/algorithms/problems` | Catalog admin / tạo bài |
| PUT `/admin/algorithms/problems/{id}` | Cập nhật metadata |
| POST `/admin/algorithms/problems/{id}/solutions` | Tạo solution draft |
| GET/PUT `/admin/algorithms/solutions/{id}` | Đọc / cập nhật draft hoặc live |
| POST `/admin/algorithms/solutions/{id}/{publish,unpublish,archive}` | Workflow solution |
| GET/POST `/me/algorithm-attempts` | Lịch sử / ghi attempt |
| GET `/me/algorithm-progress` | Progress owner theo bài/pattern |
| GET `/me/algorithm-reviews?dueBefore=...` | Danh sách cần ôn |
| POST `/public/chat` | Body question; trả answer + citations + grounded; SPEC-005 |
| GET `/admin/index-jobs` | Trạng thái index, lỗi đã redact |
| POST `/admin/index-jobs/{id}/retry` | Retry có idempotency |

Notation `{publish,unpublish,archive}` là ba route riêng, không phải path literal. Habits/vision APIs được đặc tả khi kích hoạt các module đó.

## Ví dụ slice Project

POST `/admin/projects` tạo draft, không cho payload tự đặt owner:

```json
{
  "title": "Portfolio Knowledge Hub",
  "slug": "portfolio-knowledge-hub",
  "summary": "Portfolio và hành trình học backend của tôi.",
  "bodyMarkdown": "## Bài toán\n...\n## Đóng góp của tôi\n...",
  "techStack": ["Java", "PostgreSQL"],
  "lifecycleStatus": "BUILDING",
  "visibility": "PUBLIC",
  "repoUrl": null,
  "liveUrl": null
}
```

201 với Location `/api/v1/admin/projects/{id}`, DTO có `id`, `status: DRAFT`, `version: 0`. `title` 1–160 ký tự; slug lowercase 1–120, chữ/số/gạch nối; summary tối đa 500; Markdown tối đa 100.000 ký tự; techStack tối đa 30 phần tử; chỉ http/https cho repo/live URL.

Publish yêu cầu title, summary và body không trống. POST action `{ "expectedVersion": 0 }` chuyển sang PUBLISHED, lưu publishedAt và tăng version trong cùng transaction; trả DTO 200. Duplicate action trên trạng thái đã đạt với version hiện tại trả 200, không tạo thêm job; version cũ trả 409. Unpublish chuyển DRAFT và khóa public ngay; archive chuyển ARCHIVED. Muốn khôi phục archived dùng action restore riêng ở spec sau, không tự publish lại.

DTO detail public: id, slug, title, summary, bodyMarkdown, techStack, lifecycleStatus, links, personalRole, publishedAt. List không trả full body. Update là PUT đầy đủ editable fields + version; thiếu version trả 400. Sửa live tăng revision để RAG bỏ bản index cũ ngay.
