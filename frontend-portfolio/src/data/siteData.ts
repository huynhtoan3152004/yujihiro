/**
 * siteData.ts — Dữ liệu mẫu cho toàn bộ Portfolio
 * 
 * ⚠️ ĐÂY LÀ DỮ LIỆU MẪU — sau này sẽ thay bằng API từ Backend
 * Tách riêng data ra file này để dễ thay đổi mà không cần sửa code giao diện
 */

// ============================================================
// THÔNG TIN CÁ NHÂN
// ============================================================
export const profile = {
  name: "Yujihiro",
  roles: ["Full-stack Developer", "Backend Engineer", "Problem Solver"],
  company: "@ Open to Work",
  greeting: "// hello world !! Welcome to my portfolio",
  /** Các dòng chữ sẽ được gõ lần lượt (typewriter effect) */
  typingTexts: [
    "Passionate about Clean Architecture & Scalable Systems",
    "Building products that matter with React & Express",
    "Turning coffee into code since 2022 ☕",
  ],
  bio: `I live at the crossroads of <strong>frontend engineering</strong>, <strong>backend development</strong>, and <strong>system design</strong>. I build systems that are genuinely <strong>intelligent</strong> and <strong>scalable</strong>.`,
};

// ============================================================
// THỐNG KÊ NHANH — hiển thị ở cuối Home page
// ============================================================
export const stats = [
  { value: "2+",  label: "YEARS",            icon: "📅" },
  { value: "10+", label: "PROJECTS",          icon: "🚀" },
  { value: "∞",   label: "CURIOSITY",         icon: "💡" },
  { value: "↑",   label: "ALWAYS LEARNING",   icon: "📈" },
];

// ============================================================
// LIÊN KẾT MẠNG XÃ HỘI — hiển thị ở footer
// ============================================================
export const socials = [
  { name: "GitHub",    icon: "github",   url: "https://github.com/yujihiro" },
  { name: "LinkedIn",  icon: "linkedin", url: "https://linkedin.com/in/yujihiro" },
  { name: "LeetCode",  icon: "code",     url: "https://leetcode.com/yujihiro" },
  { name: "Email",     icon: "mail",     url: "mailto:yujihiro.dev@gmail.com" },
];

// ============================================================
// DỮ LIỆU SIDEBAR — Cây thư mục file explorer
// ============================================================
export interface FileNode {
  name: string;
  type: "file" | "folder";
  icon?: string;   // tsx | js | json | md | css | ts | html
  pageId?: string;  // ID trang khi click
  children?: FileNode[];
}

export const fileTree: FileNode[] = [
  {
    name: "yujihiro-portfolio",
    type: "folder",
    children: [
      {
        name: "src",
        type: "folder",
        children: [
          { name: "home.tsx",       type: "file", icon: "tsx",  pageId: "home" },
          { name: "about.html",     type: "file", icon: "html", pageId: "about" },
          { name: "projects.js",    type: "file", icon: "js",   pageId: "projects" },
          { name: "skills.json",    type: "file", icon: "json", pageId: "skills" },
          { name: "experience.ts",  type: "file", icon: "ts",   pageId: "blog" },
          { name: "contact.css",    type: "file", icon: "css",  pageId: "contact" },
          { name: "README.md",      type: "file", icon: "md",   pageId: "readme" },
        ],
      },
    ],
  },
];

// ============================================================
// CẤU HÌNH TAB — Map giữa pageId và tên file hiển thị
// ============================================================
export const PAGE_TAB_CONFIG: Record<string, { name: string; icon: string }> = {
  home:     { name: "home.tsx",       icon: "tsx" },
  about:    { name: "about.html",     icon: "html" },
  projects: { name: "projects.js",    icon: "js" },
  skills:   { name: "skills.json",    icon: "json" },
  blog:     { name: "experience.ts",  icon: "ts" },
  contact:  { name: "contact.css",    icon: "css" },
  readme:   { name: "README.md",      icon: "md" },
};

// ============================================================
// DỰ ÁN MẪU
// ============================================================
export const projects = [
  {
    id: 1,
    emoji: "💜",
    category: "FULL STACK · EDUCATION",
    title: "Demif Learning Platform",
    description: "Nền tảng học tiếng Nhật gamification với hệ thống XP, leaderboard và subscription management.",
    techStack: ["React", "C# .NET", "PostgreSQL", "Azure"],
    githubUrl: "https://github.com/yujihiro/demif",
    liveUrl: null,
    teamSize: 5,
    status: "In production" as const,
  },
  {
    id: 2,
    emoji: "🚀",
    category: "FRONTEND · CREATIVE",
    title: "Portfolio VSCode Theme",
    description: "Portfolio cá nhân mô phỏng giao diện VS Code hoàn chỉnh với dark theme, tabs, sidebar và syntax highlighting.",
    techStack: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    githubUrl: "https://github.com/yujihiro/portfolio",
    liveUrl: "https://yujihiro.dev",
    teamSize: 1,
    status: "Building" as const,
  },
  {
    id: 3,
    emoji: "🛒",
    category: "FULL STACK · E-COMMERCE",
    title: "E-Commerce Dashboard",
    description: "Dashboard quản trị cho cửa hàng trực tuyến với hệ thống thanh toán Stripe và quản lý kho hàng real-time.",
    techStack: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    githubUrl: null,
    liveUrl: null,
    teamSize: 3,
    status: "Completed" as const,
  },
  {
    id: 4,
    emoji: "🤖",
    category: "AI · BACKEND",
    title: "AI Chat Assistant",
    description: "Chatbot hỗ trợ khách hàng tích hợp OpenAI GPT API với memory management và context switching.",
    techStack: ["Python", "FastAPI", "Redis", "OpenAI"],
    githubUrl: "https://github.com/yujihiro/ai-chat",
    liveUrl: null,
    teamSize: 2,
    status: "Completed" as const,
  },
];

// ============================================================
// BLOG MẪU
// ============================================================
export const blogPosts = [
  {
    id: 1,
    title: "Two Pointers — Kỹ thuật giải thuật cơ bản",
    tags: ["algorithm"],
    preview: "Phân tích kỹ thuật Two Pointers qua các bài LeetCode phổ biến...",
    date: "2026-04-20",
    readTime: "8 min",
  },
  {
    id: 2,
    title: "IELTS 7.0 — Lộ trình 6 tháng từ con số 0",
    tags: ["english"],
    preview: "Chia sẻ phương pháp tự học tiếng Anh hiệu quả nhất cho developer...",
    date: "2026-04-15",
    readTime: "12 min",
  },
  {
    id: 3,
    title: "Docker cho Frontend Developer — Hướng dẫn từ A-Z",
    tags: ["devops", "tech"],
    preview: "Từ cài đặt, viết Dockerfile đến triển khai với Docker Compose...",
    date: "2026-04-10",
    readTime: "15 min",
  },
];

// ============================================================
// LIÊN HỆ & CHỨNG CHỈ
// ============================================================
export const contact = {
  email: "yujihiro.dev@gmail.com",
  github: "github.com/yujihiro",
  linkedin: "linkedin.com/in/yujihiro",
  phone: "+84 xxx xxx xxx",
  location: "Hồ Chí Minh, Việt Nam 🇻🇳",
};

export const certifications = [
  { name: "AWS Cloud Practitioner", year: 2025 },
  { name: "Meta Frontend Developer", year: 2024 },
  { name: "IELTS 7.0",              year: 2024 },
  { name: "Google UX Design",       year: 2023 },
];
