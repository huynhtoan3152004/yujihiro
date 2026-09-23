/**
 * ActivityBar.tsx — Thanh icon dọc bên trái nhất của VS Code
 * Chứa các icon điều hướng (Explorer, Search, Git, Extensions...) giống y hệt VS Code
 * Khi click vào icon sẽ chuyển trang tương ứng
 */
import {
  Files,        // Explorer icon
  Search,       // Search icon
  GitBranch,    // Source Control icon
  Blocks,       // Extensions icon
  User,         // About (thay cho Accounts)
  Settings,     // Settings icon (phía dưới)
} from 'lucide-react';

/** Danh sách các mục điều hướng chính */
const topItems = [
  { id: 'explorer', icon: Files,     label: 'Explorer' },
  { id: 'search',   icon: Search,    label: 'Search' },
  { id: 'git',      icon: GitBranch, label: 'Source Control' },
  { id: 'extensions', icon: Blocks,  label: 'Extensions' },
];

/** Các mục ở phía dưới activity bar */
const bottomItems = [
  { id: 'about',    icon: User,     label: 'About' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface ActivityBarProps {
  /** Tab hiện tại đang được chọn */
  activeTab: string;
  /** Callback khi click vào một icon */
  onTabChange: (tab: string) => void;
}

export default function ActivityBar({ activeTab, onTabChange }: ActivityBarProps) {
  return (
    <div className="flex flex-col justify-between w-[48px] bg-[var(--vscode-activitybar-bg)] border-r border-[var(--vscode-border)] shrink-0">
      {/* Nhóm icon phía trên */}
      <div className="flex flex-col items-center gap-0">
        {topItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={`
                relative flex items-center justify-center w-full h-[48px]
                transition-colors duration-150
                ${isActive
                  ? 'text-white'
                  : 'text-[var(--vscode-text-muted)] hover:text-white'
                }
              `}
            >
              {/* Thanh highlight bên trái khi đang active */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
              )}
              <Icon size={24} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>

      {/* Nhóm icon phía dưới */}
      <div className="flex flex-col items-center gap-0 mb-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={`
                relative flex items-center justify-center w-full h-[48px]
                transition-colors duration-150
                ${isActive
                  ? 'text-white'
                  : 'text-[var(--vscode-text-muted)] hover:text-white'
                }
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
              )}
              <Icon size={24} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
