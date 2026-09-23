# Audit frontend: công nghệ, shadcn và chất lượng code

Ngày kiểm tra: 22/09/2026. Phạm vi: `frontend-portfolio/` — đọc toàn bộ `src/`, cấu hình, và **đã chạy** `npm run lint` + `npm run build` để đối chiếu.

## 1. Kết quả chạy thật

| Lệnh | Kết quả |
|---|---|
| `npm run build` (`tsc -b && vite build`) | **Pass**. Bundle JS 355 kB (gzip 109 kB), CSS 30 kB |
| `npm run lint` | **3 lỗi**, đều `react-refresh/only-export-components` trong `ui/badge.tsx`, `ui/button.tsx`, `ui/tabs.tsx` (file export cả component lẫn `xxxVariants`) |

Build pass không có nghĩa UI đúng: TypeScript không biết class Tailwind có tồn tại hay không. Xem mục 3.

## 2. Công nghệ đang dùng (đọc từ `package.json` và code)

| Nhóm | Thư viện | Phiên bản | Nhận xét |
|---|---|---|---|
| Core | React, react-dom | 19.2 | Tốt |
| Build | Vite | 8.0 (Rolldown) | Mới, ổn |
| Ngôn ngữ | TypeScript | ~6.0 | `erasableSyntaxOnly`, `verbatimModuleSyntax` bật — chuẩn |
| Style | Tailwind CSS | **3.4.1** | Xung đột với bộ shadcn đã cài (mục 3) |
| Style | tailwindcss-animate **và** tw-animate-css | cả hai | Trùng vai trò; `tw-animate-css` chỉ chạy với Tailwind v4 |
| UI | shadcn (style `radix-nova`), radix-ui, class-variance-authority, clsx, tailwind-merge | | `shadcn` CLI đang nằm trong `dependencies` — sai chỗ, phải dùng qua `npx` |
| Icon | lucide-react | 1.11 | Tốt |
| Animation | framer-motion | 12 | Dùng đúng mức |
| Routing | react-router-dom | 7.14 | **Cài nhưng chưa dùng**; `main.tsx` không có Router |
| Font | @fontsource-variable/geist | | **Cài nhưng không import**; font thật đang lấy từ Google Fonts trong `index.html` |
| Lint | ESLint 10 + typescript-eslint + react-hooks + react-refresh | | Cấu hình flat đúng chuẩn Vite template |
| Test | — | | Chưa có Vitest/RTL |
| Format | — | | Chưa có Prettier; code trộn `'` và `"`, có/không dấu `;` |

## 3. shadcn: đã dùng đúng chưa? — **Chưa, và đây là vấn đề lớn nhất**

### 3.1 Bộ component sinh bởi shadcn CLI v4 (Tailwind v4) nhưng project chạy Tailwind v3

Bằng chứng trong `src/components/ui/*.tsx` (14 chỗ): `focus-visible:ring-3`, `has-data-[icon=inline-end]:pr-2`, `in-data-[slot=button-group]:rounded-lg`, `*:[img:first-child]:rounded-t-xl`, `@container/card-header`, `rounded-[min(var(--radius-md),10px)]`. Đây là cú pháp/variant **chỉ Tailwind v4 hiểu** (`in-*`, `has-data-*`, container query mặc định, biến `--radius-md`). Với Tailwind 3.4 các class này bị bỏ qua âm thầm — không lỗi build, chỉ render sai.

Ngoài ra `components.json` khai `style: "radix-nova"` (style của shadcn v4, cần biến màu dạng `--color-*` trong `@theme inline`), trong khi `index.css` định nghĩa biến kiểu cũ `--background: 0 0% 12%` (HSL triple của shadcn v3) và `tailwind.config.cjs` map `hsl(var(--border))`. Hai hệ không khớp; `components.json` còn trỏ tới `tailwind.config.js` trong khi file thật là `.cjs`.

### 3.2 Không một page nào dùng component shadcn

`grep` toàn bộ `src/` ngoài thư mục `ui/`: **0** import từ `@/components/ui`. Chín file `avatar, badge, button, card, dropdown-menu, input, sheet, skeleton, tabs` là code chết. Các page tự viết `<button className="px-5 py-2.5 bg-[#007acc] ...">` thay vì `<Button>`; tab, card, badge đều được tay viết lại bằng div.

Kết luận: shadcn hiện chỉ là "đã cài", chưa phải "đã dùng". Về mặt portfolio, điều này bị nhìn thấy ngay khi người đọc mở `components/ui`.

### 3.3 Hướng sửa (bạn tự làm, xem bài học 3 trong syllabus)

Chọn **một** trong hai, khuyến nghị A:

- **A. Lên Tailwind v4** (khớp với Vite 8 và bộ shadcn hiện có): cài `tailwindcss@4` + `@tailwindcss/vite`, bỏ `postcss.config.js`/`tailwind.config.cjs`, chuyển `index.css` sang `@import "tailwindcss"` + `@theme inline` với biến màu VS Code, bỏ `tailwindcss-animate`, giữ `tw-animate-css`. Chạy lại `npx shadcn@latest init` để `components.json` đúng, rồi `add` lại đúng các component sẽ dùng.
- **B. Ở lại Tailwind v3**: xóa 9 file `ui/`, đổi `components.json` sang style `default`/`new-york` của shadcn v2 với `tailwind.config`, `add` lại component. Ít việc hơn nhưng đi ngược hướng shadcn hiện tại.

Sau đó thay dần: CTA ở `HomePage` → `Button` (variant `default`/`outline`), card project → `Card`, tech badge → `Badge`, tab editor → giữ custom (VS Code look), Command Palette (ô search ở TitleBar) → `Command`/`Dialog` khi làm thật.

## 4. Chất lượng code — findings theo mức độ

### Mức cao (ảnh hưởng đúng/sai hoặc bảo mật)

1. **`dangerouslySetInnerHTML` với `profile.bio`** ở `HomePage.tsx:153` và `AboutPage.tsx:39`. Hôm nay dữ liệu là hằng số nên chưa nguy hiểm; khi nối CMS đây là lỗ XSS. Sửa: render Markdown qua `react-markdown` (không bật raw HTML) — đã có trong tài liệu 11.
2. **`closeTab` gọi `setActiveFile` bên trong updater của `setOpenTabs`** (`App.tsx`). Updater phải thuần; StrictMode chạy updater hai lần → side effect nhân đôi. Ngoài ra đóng tab cuối cùng không đổi `activeFile`, editor vẫn render trang cũ dù không còn tab. Sửa: tính `next` trước, rồi set hai state (hoặc gộp state tabs+active vào một `useReducer`).
3. **`TypingEffect`: `setTimeout` lồng không được clear** khi unmount (`HomePage.tsx`). Cleanup chỉ clear timer ngoài; timer trong (`setTimeout(() => setIsDeleting(true), 2000)`) vẫn chạy sau unmount. Sửa: lưu cả hai timer hoặc dùng một state machine với một timer.
4. **Chưa có routing**: URL không đổi khi chuyển trang, refresh về Home, không có deep link `/projects/:slug`. `react-router-dom` đã cài. Đây là gate của sprint 01.

### Mức trung bình (bảo trì, a11y)

5. **Tab editor là `<div onClick>`** (`EditorTabs.tsx`): không focus được bằng bàn phím, không có `role="tab"`/`aria-selected`. Activity bar và explorer dùng `<button>` đúng nhưng thiếu `aria-pressed`/`aria-current`.
6. **`PAGE_TAB_CONFIG: Record<string, ...>`** và `activeFile: string`: mất type-safety; nên là union `type PageId = 'home' | 'about' | ...` để `renderPage` không cần `default`.
7. **Màu hardcode rải rác**: `#519aba`, `#28c840`, `#c06bff`, `#dcb67a`, `#37373d`... trong 6 file, song song với biến `--vscode-*` trong `index.css`. Đưa hết vào token CSS/Tailwind theme; đây là bài "design token" khi lên Tailwind v4.
8. **Arbitrary values khắp nơi** (`text-[13px]`, `h-[35px]`, `w-[220px]`): hợp lý cho shell VS Code (kích thước cố định) nhưng nên đặt tên trong theme (`--tab-height`) để chỉnh một chỗ.
9. **`key={node.name}`** trong Sidebar: hai file cùng tên ở hai thư mục khác nhau sẽ trùng key. Dùng path đầy đủ.
10. **ActivityBar lặp code** hai vòng `map` giống hệt → tách `ActivityButton`.
11. **`tailwind.config.cjs` `content`** liệt kê `./pages`, `./components`, `./app` không tồn tại — vô hại nhưng cho thấy copy từ Next.js template.
12. **`SkillsPage` hardcode dữ liệu** ngay trong JSX, kể cả stack đã bỏ (`express`, `prisma`) — không nhất quán với hướng Spring Boot; phải lấy từ `siteData` rồi từ API.
13. **`README.md` có trong explorer nhưng `renderPage` không có case** → click ra HomePage.

### Mức thấp

14. Không có Prettier/format-on-save; không có `.editorconfig` (đã thêm ở root).
15. Không có test; chưa cần ngay nhưng `TypingEffect`, `closeTab`, trace functions sau này là ứng viên Vitest đầu tiên.
16. `index.html` load Google Fonts nhưng `@fontsource-variable/geist` cài mà không dùng → gỡ một trong hai.

## 5. Điểm tốt (giữ lại)

- Cấu trúc thư mục rõ: `layout/`, `pages/`, `ui/`, `data/`, `lib/`.
- Dữ liệu tách khỏi JSX trong `siteData.ts` — đúng hướng để thay bằng API.
- Comment tiếng Việt đầu file giải thích vai trò component — hữu ích cho học.
- `cn()` helper, alias `@/`, TS strict flags — đúng chuẩn.
- Framer Motion dùng có chừng mực (fade/stagger), không lạm dụng.

## 6. Thứ tự sửa đề xuất (mỗi mục là một PR nhỏ)

1. `fix(fe): closeTab side effect + last tab state` (30 phút, có thể viết test đầu tiên).
2. `chore(fe): move shadcn to devDeps, drop unused deps` (geist, tailwindcss-animate hoặc tw-animate-css, react-router giữ).
3. `feat(fe): react-router + URL cho 6 trang` (gate sprint 01).
4. `build(fe): Tailwind v4 + shadcn re-init` rồi `refactor(fe): dùng Button/Card/Badge`.
5. `refactor(fe): PageId union, design tokens, a11y tabs`.
6. `feat(fe): react-markdown thay dangerouslySetInnerHTML` (làm cùng slice CMS).

Mỗi PR: lint 0 lỗi, build pass, mô tả nêu rõ finding số mấy ở tài liệu này được đóng.
