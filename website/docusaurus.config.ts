import {themes as prismThemes} from 'prism-react-renderer';
import type {Config, PluginConfig} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Plugin nội bộ nạp Tailwind v4 qua PostCSS — cách chính thức Docusaurus
// khuyến nghị (không cần postcss.config.js riêng). Component thật (Button,
// Card, Badge...) nằm ở src/components/ui, dùng được ngay trong file .mdx
// qua src/theme/MDXComponents.tsx. Xem docs/17-frontend-audit.md để biết vì
// sao bộ tương tự bên frontend-portfolio/ đang bị lệch phiên bản Tailwind.
function tailwindPlugin(): PluginConfig {
  return {
    name: 'tailwind-plugin',
    configurePostCss(postcssOptions) {
      postcssOptions.plugins.push(require('@tailwindcss/postcss'));
      return postcssOptions;
    },
  };
}

// Chạy trong Node.js — không dùng browser API/JSX ở đây.
//
// Site tài liệu của monorepo Portfolio. Nguồn nội dung là thư mục ../docs
// (không copy docs vào website/ để tránh hai bản không đồng bộ).
//
// Biến môi trường dùng khi deploy (CI sẽ đặt):
//   DOCS_URL       ví dụ https://<user>.github.io
//   DOCS_BASE_URL  ví dụ /portfolio/   (GitHub Pages project site)
//   GITHUB_REPOSITORY  owner/repo (GitHub Actions tự cung cấp)

const repo = process.env.GITHUB_REPOSITORY ?? 'huynhtoan3152004/yujihiro';
const [organizationName, projectName] = repo.split('/');
const repoUrl = `https://github.com/${repo}`;

const config: Config = {
  title: 'Portfolio & Learning Hub — Docs',
  tagline: 'Thiết kế, quyết định kiến trúc, lộ trình học và nhật ký thay đổi',
  favicon: 'img/favicon.svg', // trùng brand mark với frontend-portfolio/public/favicon.svg

  future: {
    v4: true,
    faster: true,
  },

  url: process.env.DOCS_URL ?? 'https://yujihiro.github.io',
  baseUrl: process.env.DOCS_BASE_URL ?? '/',

  organizationName,
  projectName,
  trailingSlash: false,

  // Link hỏng phải làm build fail để docs không chết link sau mỗi lần merge.
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',
  markdown: {
    // .md = CommonMark thuần (an toàn với { } < > trong văn bản kỹ thuật),
    // .mdx = MDX khi cần component. Không ép toàn bộ docs qua MDX.
    format: 'detect',
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [tailwindPlugin],

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/', // docs-only mode: trang chủ là docs/README.mdx
          sidebarPath: './sidebars.ts',
          editUrl: `${repoUrl}/edit/main/`,
          // Cần git history; repo local có thể chưa commit → chỉ bật trên CI.
          showLastUpdateTime: Boolean(process.env.CI),
          showLastUpdateAuthor: false,
          exclude: ['**/evidence/**/*.log'],
        },
        blog: false,
        pages: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.svg',
    // Dark-only, khớp frontend-portfolio/index.html (class="dark" cố định, không có switch).
    // Bật lại respectPrefersColorScheme/switch nếu sau này FE có light mode.
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Portfolio Docs',
      logo: {alt: 'Portfolio', src: 'img/logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Tài liệu'},
        {type: 'docSidebar', sidebarId: 'mentor', position: 'left', label: 'Học & Mentor'},
        {to: '/changelog', label: 'Changelog', position: 'left'},
        {href: repoUrl, label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Bắt đầu',
          items: [
            {label: 'Tổng quan', to: '/'},
            {label: 'Hiện trạng mã nguồn', to: '/current-state'},
            {label: 'Thiết kế database', to: '/database-design-v4'},
          ],
        },
        {
          title: 'Quy trình',
          items: [
            {label: 'Cách làm việc với mentor', to: '/mentor/how-we-work'},
            {label: 'Quy ước Git & PR', to: '/docs-workflow'},
            {label: 'Merge log', to: '/changelog/merge-log'},
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Yujihiro. Docs được build tự động từ nhánh main.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['java', 'sql', 'bash', 'yaml', 'json', 'groovy'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
