/**
 * App.tsx — Layout chính của ứng dụng Portfolio
 * 
 * Kết hợp tất cả các thành phần VS Code lại với nhau:
 * ┌──────────────────────────────────────────────┐
 * │ TitleBar                                      │
 * ├──────┬────────┬──────────────────────────────┤
 * │ Act  │ Side   │ EditorTabs                    │
 * │ ivi  │ bar    │─────────────────────────────  │
 * │ ty   │ (File  │                               │
 * │ Bar  │  Tree) │ Editor Content (Pages)        │
 * │      │        │                               │
 * ├──────┴────────┴──────────────────────────────┤
 * │ StatusBar                                     │
 * └──────────────────────────────────────────────┘
 */
import { useState, useCallback } from 'react';
import TitleBar from './components/layout/TitleBar';
import ActivityBar from './components/layout/ActivityBar';
import Sidebar from './components/layout/Sidebar';
import EditorTabs from './components/layout/EditorTabs';
import type { Tab } from './components/layout/EditorTabs';
import StatusBar from './components/layout/StatusBar';

// Pages
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ProjectsPage from './components/pages/ProjectsPage';
import BlogPage from './components/pages/BlogPage';
import ContactPage from './components/pages/ContactPage';
import SkillsPage from './components/pages/SkillsPage';
import { PAGE_TAB_CONFIG } from '@/data/siteData';

/** Render nội dung trang tương ứng */
function renderPage(pageId: string) {
  switch (pageId) {
    case 'home':     return <HomePage />;
    case 'about':    return <AboutPage />;
    case 'projects': return <ProjectsPage />;
    case 'blog':     return <BlogPage />;
    case 'contact':  return <ContactPage />;
    case 'skills':   return <SkillsPage />;
    default:         return <HomePage />;
  }
}

export default function App() {
  // Tab đang active trên activity bar
  const [activeSidebar, setActiveSidebar] = useState('explorer');
  // File/page đang mở trong editor
  const [activeFile, setActiveFile] = useState('home');
  // Trạng thái hiện/ẩn sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Danh sách các tab đang mở
  const [openTabs, setOpenTabs] = useState<Tab[]>([
    { id: 'home', name: PAGE_TAB_CONFIG['home'].name, icon: PAGE_TAB_CONFIG['home'].icon },
  ]);

  /** Mở một file mới (tạo tab + chuyển focus) */
  const openFile = useCallback((pageId: string) => {
    const config = PAGE_TAB_CONFIG[pageId];
    if (!config) return;

    // Nếu tab chưa tồn tại, thêm vào danh sách
    setOpenTabs((prev) => {
      if (prev.some((t) => t.id === pageId)) return prev;
      return [...prev, { id: pageId, name: config.name, icon: config.icon }];
    });

    setActiveFile(pageId);
  }, []);

  /** Đóng một tab */
  const closeTab = useCallback((tabId: string) => {
    setOpenTabs((prev) => {
      const next = prev.filter((t) => t.id !== tabId);
      // Nếu đóng tab đang active, chuyển sang tab cuối cùng
      if (tabId === activeFile && next.length > 0) {
        setActiveFile(next[next.length - 1].id);
      }
      return next;
    });
  }, [activeFile]);

  /** Xử lý click trên activity bar */
  const handleActivityClick = useCallback((tab: string) => {
    if (tab === activeSidebar && sidebarOpen) {
      // Click lần 2 vào icon đang active → ẩn sidebar (giống VS Code)
      setSidebarOpen(false);
    } else {
      setActiveSidebar(tab);
      setSidebarOpen(true);
    }
  }, [activeSidebar, sidebarOpen]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--vscode-bg)]">
      {/* ===== TITLE BAR ===== */}
      <TitleBar />

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar (thanh icon dọc) */}
        <ActivityBar
          activeTab={activeSidebar}
          onTabChange={handleActivityClick}
        />

        {/* Sidebar (File Explorer) — chỉ hiện khi sidebarOpen = true */}
        {sidebarOpen && (
          <Sidebar
            activeFile={activeFile}
            onFileSelect={openFile}
          />
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          {openTabs.length > 0 && (
            <EditorTabs
              tabs={openTabs}
              activeTab={activeFile}
              onTabSelect={setActiveFile}
              onTabClose={closeTab}
            />
          )}

          {/* Editor Content — Khu vực hiển thị nội dung chính */}
          <div className="flex-1 overflow-y-auto bg-[var(--vscode-bg)]">
            {/* Breadcrumb — đường dẫn file giống VS Code */}
            <div className="flex items-center gap-1 px-4 h-[22px] text-[11px] text-[var(--vscode-text-muted)] bg-[var(--vscode-bg)] border-b border-[var(--vscode-border)]">
              <span>yujihiro-portfolio</span>
              <span className="opacity-50">{'>'}</span>
              <span>src</span>
              <span className="opacity-50">{'>'}</span>
              <span className="text-[var(--vscode-text)]">
                {PAGE_TAB_CONFIG[activeFile]?.name || 'home.tsx'}
              </span>
            </div>

            {/* Nội dung trang */}
            <div className="min-h-full">
              {renderPage(activeFile)}
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATUS BAR ===== */}
      <StatusBar activeFile={activeFile} />
    </div>
  );
}
