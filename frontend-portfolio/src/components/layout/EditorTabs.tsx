/**
 * EditorTabs.tsx — Thanh tab phía trên editor, y hệt VS Code
 * Hiển thị các tab file đang mở, click để chuyển tab, nút X để đóng tab
 */
import { X, FileCode, FileText, FileJson } from 'lucide-react';

/** Cấu trúc một tab */
export interface Tab {
  id: string;
  name: string;
  icon: string; // tsx | md | json
}

/** Map icon theo loại file */
function getTabIcon(icon: string) {
  switch (icon) {
    case 'tsx':  return <FileCode size={14} className="text-[#519aba] shrink-0" />;
    case 'md':   return <FileText size={14} className="text-[#519aba] shrink-0" />;
    case 'json': return <FileJson size={14} className="text-[#cbcb41] shrink-0" />;
    default:     return <FileText size={14} className="text-[var(--vscode-text-muted)] shrink-0" />;
  }
}

interface EditorTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export default function EditorTabs({ tabs, activeTab, onTabSelect, onTabClose }: EditorTabsProps) {
  return (
    <div className="flex items-end h-[35px] bg-[var(--vscode-tab-border)] overflow-x-auto shrink-0">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <div
            key={tab.id}
            onClick={() => onTabSelect(tab.id)}
            className={`
              group flex items-center gap-2 px-3 h-[35px] cursor-pointer
              text-[13px] border-r border-[var(--vscode-border)] shrink-0 min-w-0
              transition-colors duration-100
              ${isActive
                ? 'bg-[var(--vscode-tab-active)] text-white border-t-[1px] border-t-[#007acc]'
                : 'bg-[var(--vscode-tab-inactive)] text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-tab-active)]'
              }
            `}
          >
            {getTabIcon(tab.icon)}
            <span className="truncate max-w-[120px]">{tab.name}</span>
            {/* Nút đóng tab — hiện khi hover hoặc khi tab đang active */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Ngăn không cho click lan sang tab
                onTabClose(tab.id);
              }}
              className={`
                flex items-center justify-center w-[20px] h-[20px] rounded-sm
                transition-all duration-100
                ${isActive
                  ? 'opacity-100 hover:bg-white/10'
                  : 'opacity-0 group-hover:opacity-100 hover:bg-white/10'
                }
              `}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
