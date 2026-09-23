# Công cụ và repo tham khảo

Ngày: 22/09/2026. Gồm phân tích Graphify và danh sách repo mã nguồn mở đáng học cho từng phần của dự án. Chỉ liệt kê thứ có liên quan trực tiếp; mỗi mục ghi *học gì từ nó*, không phải *copy gì*.

## 1. Graphify (graphify.com / github.com/safishamsi/graphify)

### Nó là gì

Công cụ mã nguồn mở (Apache-2.0/MIT) biến một thư mục code + docs + SQL schema thành **knowledge graph** có thể truy vấn, dành cho AI coding assistant. Cài dưới dạng *skill* cho Claude Code, Cursor, Codex, Gemini CLI, Copilot CLI... Điểm khác biệt so với vector search: parse AST bằng tree-sitter **trên máy**, mỗi cạnh trong graph đều giải thích được và có `file:line`; code-only không cần API key. Có bản hosted (app.graphify.com) và bản self-host.

Cài đặt và dùng:

```bash
uv tool install graphifyy
graphify install            # đăng ký skill với AI tool đang dùng
# trong Claude Code / Cursor:
/graphify .                 # build graph
/graphify query "what connects ProjectService to Flyway migrations?"
graphify update .           # sau khi git pull
```

Nó ghi vào repo thư mục `graphify-out/` (graph.json, graph.html, GRAPH_REPORT.md, cache/) và có thể sửa `CLAUDE.md`/`AGENTS.md`/`.cursor/rules/graphify.mdc` để AI biết dùng graph.

### Có nên đưa vào repo không?

**Chưa, ở giai đoạn này. Cân nhắc lại khi backend vượt khoảng 150–200 file.**

Lý do:

- Repo hiện có **~25 file source** (FE 24 file, BE 5 file). AI đọc thẳng còn rẻ hơn build graph; lợi ích "71x ít token" chỉ có nghĩa khi codebase lớn.
- Mục tiêu của bạn là **tự code và hiểu code**; công cụ giúp AI hiểu code nhanh hơn không phải ưu tiên khi chính bạn đang là người viết từng file.
- `graphify-out/` là artifact sinh ra, commit vào repo làm nhiễu diff và PR review.
- Graphify tự sửa `CLAUDE.md`/`AGENTS.md` — xung đột với bộ rule đã thiết kế trong repo.

Khi dùng sau này:

- Cài trên máy (`uv tool install`), **không** thêm vào dependencies của FE/BE.
- Thêm `graphify-out/` vào `.gitignore` (đã thêm sẵn) — mỗi máy tự build; hoặc commit chỉ `GRAPH_REPORT.md` nếu muốn có tài liệu kiến trúc tự sinh.
- Không cho nó ghi vào `CLAUDE.md`; nếu cần, thêm một dòng thủ công trong `AGENTS.md` phần "Công cụ".

Giá trị thật cho dự án này về sau: khi có 13 bảng + RAG + nhiều controller, câu hỏi kiểu "endpoint nào chạm bảng `solutions`?" trả lời qua graph nhanh và có citation — hữu ích cho review và cho chính bạn khi quay lại code sau vài tháng.

## 2. Repo mã nguồn mở đáng học (theo phần của dự án)

### Backend Spring Boot

| Repo | Học gì | Áp dụng vào đâu |
|---|---|---|
| [spring-projects/spring-petclinic](https://github.com/spring-projects/spring-petclinic) | Cấu trúc chuẩn Spring Boot, JPA, validation, test slice, Testcontainers, Flyway/Liquibase | Cách tổ chức test, `@DataJpaTest`, naming |
| [sivaprasadreddy/spring-modular-monolith](https://github.com/sivaprasadreddy/spring-modular-monolith) | Modular monolith với Spring Modulith: ranh giới module, event giữa module, test từng module | ADR-002 (module identity/portfolio/publishing/learning); bước "tách service" tài liệu 03 |
| [sivaprasadreddy/spring-boot-application-architecture-patterns](https://github.com/sivaprasadreddy/spring-boot-application-architecture-patterns) | So sánh package-by-layer vs package-by-feature vs hexagonal trên cùng một app | Quyết định giữ layer (tài liệu 13) hay chuyển feature khi lớn |
| [gothinkster/spring-boot-realworld-example-app](https://github.com/gothinkster/spring-boot-realworld-example-app) | Blog engine hoàn chỉnh (articles, tags, slug, auth) theo spec RealWorld | `posts`, slug, tag filter, pagination contract |
| [spring-projects/spring-security-samples](https://github.com/spring-projects/spring-security-samples) | Session cookie + CSRF cho SPA, login JSON | SPEC-001 (session/CSRF), `SecurityFilterChain` |
| [testcontainers/testcontainers-java-spring-boot-quickstart](https://github.com/testcontainers/testcontainers-java-spring-boot-quickstart) | `@ServiceConnection`, pin image, test migration trên DB thật | Sửa `postgres:latest` → tag cố định |
| [spring-projects/spring-ai-examples](https://github.com/spring-projects/spring-ai-examples) | Embedding, pgvector store, RAG advisor | Tháng 7 (tài liệu 06) |

### Frontend React + shadcn

| Repo | Học gì | Áp dụng vào đâu |
|---|---|---|
| [satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) | Admin dashboard Vite + shadcn + TanStack Router/Query, form với react-hook-form + zod, theme, command palette | Toàn bộ `/admin/*` CMS; cấu trúc `features/` |
| [shadcn-ui/ui](https://github.com/shadcn-ui/ui) (thư mục `apps/v4`) | Cách shadcn v4 tổ chức theme `@theme inline`, token màu, Tailwind v4 | Nâng cấp Tailwind v4 (tài liệu 17 mục 3.3) |
| [itsnitinr/vscode-portfolio](https://github.com/itsnitinr/vscode-portfolio) | Portfolio giao diện VS Code (Next.js): routing theo file, theme switcher | So sánh cách họ map trang ↔ file explorer; **không** copy UI |
| [remarkjs/react-markdown](https://github.com/remarkjs/react-markdown) | Render Markdown an toàn, plugin remark-gfm, không raw HTML | Thay `dangerouslySetInnerHTML` |
| [TanStack/query](https://github.com/TanStack/query) (examples/react) | Server state, invalidation sau mutation, loading/error state | Nối FE với `/api/v1` |

### Learning Hub / visualizer

| Repo | Học gì | Áp dụng vào đâu |
|---|---|---|
| [algorithm-visualizer/algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer) | Tách "tracer" (sinh bước) khỏi "renderer" (vẽ) | `buildTrace(input) -> Step[]` ở tài liệu 09 |
| [clementmihailescu/Pathfinding-Visualizer](https://github.com/clementmihailescu/Pathfinding-Visualizer) | BFS/DFS visualizer đơn giản bằng React | Visualizer BFS |
| [xyflow/xyflow](https://github.com/xyflow/xyflow) | React Flow: node/edge, layout | Roadmap map view |

### Docs, quy trình, AI rules

| Repo | Học gì | Áp dụng vào đâu |
|---|---|---|
| [facebook/docusaurus](https://github.com/facebook/docusaurus) (website/) | Cách chính Docusaurus tổ chức docs, versioning, sidebar | `website/` |
| [conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint) | Chuẩn Conventional Commits | Hook `commit-msg` (đã viết dạng shell không cần Node) |
| [googleapis/release-please](https://github.com/googleapis/release-please) | Tự sinh CHANGELOG + release PR từ commit | Bật khi có release v1 |
| [agentskills.io](https://agentskills.io) | Chuẩn mở Agent Skills (SKILL.md) dùng chung Claude/Codex/Cursor | `.claude/skills/` |
| [github/awesome-copilot](https://github.com/github/awesome-copilot) | Mẫu instructions/prompt cho Copilot | `.github/copilot-instructions.md` |

## 3. Cách dùng danh sách này (để không thành vibe-code)

1. Đọc repo tham khảo **sau khi** đã tự viết bản đầu tiên của tính năng tương ứng, rồi so sánh và ghi vào learning log điều bạn làm khác và vì sao.
2. Không copy file. Nếu một đoạn > 10 dòng thực sự giống, viết lại bằng tay và ghi nguồn trong PR.
3. Mỗi repo chỉ lấy **một** ý chính (cột "Học gì"). Lấy nhiều hơn là dấu hiệu đang copy kiến trúc thay vì học.
