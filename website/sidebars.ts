import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// Doc id = tên file bỏ tiền tố số và đuôi .md (Docusaurus tự strip "NN-").
// Khi thêm tài liệu mới trong ../docs, thêm id vào đúng nhóm dưới đây;
// build sẽ fail nếu id không tồn tại — đó là chủ ý để sidebar không lệch docs.

const sidebars: SidebarsConfig = {
  docs: [
    'README',
    {
      type: 'category',
      label: '1. Hiện trạng & quyết định',
      collapsed: false,
      items: ['current-state', 'stack-decisions', 'repository-strategy', 'frontend-audit'],
    },
    {
      type: 'category',
      label: '2. Kiến trúc & dữ liệu',
      items: [
        'architecture',
        'source-structure',
        'database-design-v4',
        'minimal-database-design',
        'data-and-api',
        'learning-domain-api',
      ],
    },
    {
      type: 'category',
      label: '3. Sản phẩm & đặc tả',
      items: ['product-learning-experience', 'feature-specs', 'rag'],
    },
    {
      type: 'category',
      label: '4. Kế hoạch & công nghệ',
      items: [
        'learning-roadmap',
        'delivery-backlog',
        'technology-adoption',
        'spring-initializr',
        'references-and-tools',
      ],
    },
    {
      type: 'category',
      label: '5. Quy trình, CI/CD & docs',
      items: ['docs-workflow', 'ci-cd', 'templates/feature-spec', 'templates/learning-content'],
    },
  ],
  mentor: [
    'mentor/README',
    'mentor/how-we-work',
    'mentor/syllabus',
    'mentor/review-checklists',
    {
      type: 'category',
      label: 'Bài học',
      collapsed: false,
      items: ['mentor/lessons/lesson-01-foundation', 'mentor/lessons/lesson-02-first-slice'],
    },
    'mentor/learning-log',
  ],
  changelog: ['changelog/README', 'changelog/merge-log'],
};

export default sidebars;
