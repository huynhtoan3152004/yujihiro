# Learning domain và contract

> Bản chức năng mở rộng. Schema để bắt đầu theo [DB tối thiểu](14-minimal-database-design.md): lessons dùng kind CONCEPT/PATTERN, solution code Java nằm cùng record, roadmap có thứ tự trước khi thêm DAG. Các contract/AC cần DAG và nội dung nhiều code samples được hoãn tới khi mở rộng; không tạo mọi bảng trong tài liệu này từ đầu.

Baseline v3. Java/Spring Boot sở hữu nghiệp vụ, PostgreSQL giữ dữ liệu và React/TypeScript chạy visualizer.

Đây là mô hình learning thống nhất của dự án. Chưa tạo migration/code. Chỉ tạo bảng khi slice tương ứng bắt đầu; common UUID/version/timestamps/status/visibility và error contract kế thừa tài liệu 04.

## Ownership

`curriculum` sở hữu concept, pattern, roadmap, prerequisites; `algorithms` sở hữu problem, sources, solution, code samples, attempts. Mỗi module sở hữu visualization config cho nội dung của mình; player/trace schema dùng chung ở FE. `publishing` sở hữu blog và các link biên tập từ blog. FK cross-module ở DB được phép cho tính toàn vẹn; Java gọi qua application interface, không import repository/entity nội bộ module khác.

## Entities

| Entity | Dữ liệu và ràng buộc |
|---|---|
| concepts | slug unique, title, summary, body_markdown, outcomes JSONB, checkpoints JSONB, estimated_minutes > 0, status/visibility, reviewed_at |
| patterns | slug unique, title, recognition_markdown, preconditions_markdown, invariant_markdown, template_markdown, counterexamples_markdown, checkpoints JSONB, status/visibility |
| pattern_concepts | pattern_id FK, concept_id FK, unique cặp; giúp tra kiến thức nền |
| concept_prerequisites | concept_id, prerequisite_id FK; unique cặp, không self-edge; service kiểm tra cycle |
| roadmaps | slug unique, title, audience, prerequisites_markdown, outcomes JSONB, revision, status/visibility |
| roadmap_sections | roadmap_id FK, title, description, position; unique(roadmap_id, position) |
| roadmap_items | section_id FK, position, concept_id?/pattern_id?/problem_id?, required; check đúng một target không-null, unique(section_id, position) |
| roadmap_item_prerequisites | item_id + prerequisite_item_id FK; cùng roadmap, không self/cycle |
| problems | slug unique, title, statement_summary_markdown tự viết, difficulty nội bộ, hints JSONB theo thứ tự, status/visibility, review_state, reviewed_at |
| platforms | code unique (LEETCODE/ATCODER/CODEFORCES/CSES/OTHER), label, homepage |
| problem_sources | problem_id FK, platform_id FK, external_key, url, source_difficulty nullable; unique(platform_id, external_key) |
| problem_concepts / problem_patterns | các FK mục tiêu + problem_id FK; unique cặp |
| solutions | problem_id FK, slug, title, intuition_markdown, brute_force_markdown, invariant_markdown, proof_markdown, walkthrough_markdown, pitfalls_markdown, checkpoints JSONB, time_analysis, space_analysis, reviewed_at, status/visibility; unique(problem_id, slug) |
| solution_code_samples | solution_id FK, language, runtime_note, code, verified_at nullable; unique(solution_id, language); một approach có code samples; v1 triển khai nội dung Java |
| problem_relations | from_problem_id, to_problem_id, kind SIMILAR/TRANSFER/COUNTEREXAMPLE, reason; unique bộ ba, không self |
| post_learning_links | post_id FK, concept_id?/pattern_id?/problem_id?/solution_id?, label/reason; đúng một target, unique từng cặp mục tiêu |
| concept_visualizations / solution_visualizations | parent FK, renderer_key allowlist, renderer_version, schema_version, preset_input JSONB, caption, position; unique(parent_id, position) |
| attempts | owner_id FK, problem_id FK, attempted_at, outcome, duration_minutes, notes_markdown; append history private |
| learning_progress | owner_id, problem_id, state, next_review_on, version; unique(owner_id, problem_id) |

Public content phải published/public. Problem có thể public dù chưa có lời giải: hiện source và “Editorial đang biên soạn”; không hiện code/solution draft. Solution public chỉ được phục vụ nếu cả problem cha public. Cùng một platform source không được tự gộp vào hai problem; hai đề gần giống nhưng constraints khác phải tách problem, thêm relation.

Difficulty nội bộ EASY/MEDIUM/HARD là đánh giá của tác giả, không chuyển rating Codeforces trực tiếp thành LeetCode difficulty. Luôn giữ source difficulty/rating nếu có và ghi rõ khác biệt.

Publish roadmap yêu cầu mọi required item có target public khả dụng; target bị unpublish về sau bị lọc khỏi public view và progress denominator, admin nhận cảnh báo để sửa lộ trình. Section rỗng bị ẩn. Reorder transactional, kiểm tra expectedVersion; sửa DAG serialize qua khóa roadmap/concept-graph tương ứng để tránh hai request cùng tạo cycle. Revision tăng khi thay đổi curriculum; item ID ổn định.

Target trùng trong cùng roadmap bị từ chối ở v1 (nếu muốn mục ôn lặp cần một loại item riêng). Self-edge/cycle/target không hợp lệ trả 400 với mã lỗi cụ thể; stale version trả 409. FK bảo đảm tồn tại, service bảo đảm scope và trạng thái public. Unique position khi reorder cần chiến lược deferrable constraint hoặc cập nhật vị trí tạm trong cùng transaction, không để người dùng thấy thứ tự trung gian.

## Progress khách và owner

Khách: localStorage `learning-progress:v1`, gồm schemaVersion, roadmapRevision, stable itemId, selfAssessment, updatedAt. Không lưu code riêng tư/token. Nếu đổi item/revision, giữ các ID còn tồn tại, loại mục đã xóa khỏi tỷ lệ hoàn thành; cho phép reset/export/import JSON có size/schema validation. Xóa browser data sẽ mất progress nếu chưa export.

Owner: server attempts + learning_progress. Các mốc READ/UNDERSTOOD của lesson và SOLVED/REVIEWING của problem là khác loại. UI không báo phần trăm mastery chung. V1 server chỉ đồng bộ problem progress của owner; guest và owner store không tự merge. Nếu làm learner accounts sau, bổ sung users/learner_progress, conflict policy, consent import local và privacy tests.

## API public

Prefix `/api/v1`; GET public không auth; query lọc quyền ở server; DTO không lộ nội dung draft qua count/related links. List kế thừa pagination tài liệu 04; roadmap detail tối đa 200 items v1, muốn lớn hơn thiết kế phân trang sections.

| Method/path | Contract |
|---|---|
| GET `/public/roadmaps` | items: id, slug, title, audience, revision, availableRequiredCount |
| GET `/public/roadmaps/{slug}` | sections/items, prerequisites, outcomes; targets có kind/id/title/url/availability |
| GET `/public/concepts/{slug}` | bodyMarkdown, outcomes, checkpoints, visualization configs, related patterns/problems |
| GET `/public/patterns/{slug}` | recognition/preconditions/invariant/template/counterexamples, prerequisites, problems |
| GET `/public/algorithms/problems?platform=...&pattern=...&difficulty=...` | id, slug, title, localDifficulty, sources, hasEditorial; filter kết hợp AND |
| GET `/public/algorithms/problems/{slug}` | summary, hints, sources, published approach summaries, relations; không kèm private attempts |
| GET `/public/algorithms/problems/{slug}/solutions/{solutionSlug}` | explanation sections, codeSamples, visualizationConfigs, checkpoints, reviewedAt |
| GET `/public/posts/{slug}` | Bổ sung postKind và relatedLearningLinks đã lọc visibility |

Hint/public solution không có yêu cầu bảo mật khỏi chính người đọc; progressive reveal là UX. Chỉ auth bảo vệ draft/private.

## API admin và owner

Mọi mutation admin cần session/CSRF/version; POST create trả 201, PUT trả 200, DELETE link/config trả 204, conflict trả 409. Không hard-delete nội dung đã publish v1: archive để giữ ID và lịch sử.

| Method/path | Contract |
|---|---|
| GET/POST `/admin/{concepts,patterns,roadmaps}` | List quản trị / tạo draft |
| GET/PUT `/admin/{concepts,patterns,roadmaps}/{id}` | Read/edit đầy đủ editable fields + version |
| POST `/admin/{concepts,patterns,roadmaps}/{id}/{publish,unpublish,archive}` | Action + expectedVersion |
| PUT `/admin/roadmaps/{id}/structure` | Thay sections/items/edges atomically, expectedVersion; stable IDs hiện có |
| PUT `/admin/concepts/{id}/prerequisites` | Target IDs + expectedVersion; reject cycle |
| PUT `/admin/patterns/{id}/concepts` | Danh sách concept IDs, expectedVersion |
| GET/POST `/admin/algorithms/problems` | List / tạo draft + metadata |
| GET/PUT `/admin/algorithms/problems/{id}` | Detail / update summary+hints+relations theo validation |
| POST `/admin/algorithms/problems/{id}/{publish,unpublish,archive}` | Workflow problem, cascade eligibility solution |
| PUT `/admin/algorithms/problems/{id}/sources` | Replace source list atomically; unique platform/external key |
| PUT `/admin/algorithms/problems/{id}/topics` | conceptIds, patternIds + expectedVersion |
| POST `/admin/algorithms/problems/{id}/solutions` | Create approach draft |
| GET/PUT `/admin/algorithms/solutions/{id}` | Read/update explanation + codeSamples, expectedVersion |
| POST `/admin/algorithms/solutions/{id}/{publish,unpublish,archive}` | Publish checklist + parent eligibility |
| PUT `/admin/concepts/{id}/visualizations` | Concept preset configs đã schema validate; không nhận script |
| PUT `/admin/algorithms/solutions/{id}/visualizations` | Solution preset configs đã schema validate; không nhận script |
| PUT `/admin/posts/{id}/learning-links` | Typed targets + reason; checked existence |
| POST `/me/algorithm-attempts` | problemId, outcome, durationMinutes, notes; owner từ session |
| PUT `/me/algorithm-progress/{problemId}` | state, nextReviewOn, expectedVersion |

Ký hiệu `{concepts,patterns,roadmaps}` là các route riêng, không phải path literal. Owner luôn lấy từ session, không từ payload. Solution APIs dùng prefix `/admin/algorithms/solutions` nhất quán.

## Trace contract trong FE

```ts
type TraceStep = {
  index: number;
  activeLineIds: string[];
  explanation: string;
  state: Record<string, unknown>; // từng renderer có discriminated schema cụ thể
  counters: { comparisons: number; writes: number };
};
type VisualizationConfig = {
  rendererKey: 'binary-search' | 'two-pointers' | 'sliding-window' |
    'stack' | 'reverse-linked-list' | 'bfs';
  rendererVersion: number;
  schemaVersion: number;
  presetInput: unknown; // validate theo rendererKey
};
```

Đây là sketch; triển khai phải có schema typed cho từng renderer, không truyền object tùy ý vào DOM. Backend config và FE registry phải cùng supported version. Renderer thiếu/version không hỗ trợ thì hiện explanation + thông báo, không crash trang. Step không persist vào DB v1; trace tạo deterministic từ input và implementation version.

## Thứ tự migration đề xuất

Sau portfolio/blog: concepts/patterns → problems/platforms/sources → solutions/code samples → roadmaps/sections/items/prerequisites → typed links → visualization configs → owner progress/attempts. Dữ liệu draft có thể seed để thử nhưng không public thành tài liệu thật. RAG thêm concept_id/pattern_id vào documents ở giai đoạn sau, cùng constraint đúng một nguồn.

Test đáng làm: duplicate source và topic links; cycle/concurrent DAG update; ordering atomic; public parent bị unpublish; lost update; tiến độ không tăng vì reload; trace edge cases và fixture đối chiếu editorial. Không cần test getter/setter đơn giản.
