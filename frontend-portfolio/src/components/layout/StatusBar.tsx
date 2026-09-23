/**
 * StatusBar.tsx — Thanh trạng thái phía dưới cùng của VS Code
 * Hiển thị thông tin: branch Git, ngôn ngữ, line/column, encoding...
 */
import { GitBranch } from 'lucide-react';

interface StatusBarProps {
  /** Tên file đang mở để hiển thị ngôn ngữ */
  activeFile: string;
}

/** Xác định ngôn ngữ hiển thị dựa trên tên file */
function getLanguage(file: string): string {
  if (file === 'skills') return 'JSON';
  if (file === 'home') return 'Markdown';
  return 'TypeScript React';
}

export default function StatusBar({ activeFile }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between h-[22px] bg-[var(--vscode-statusbar-bg)] text-white text-[11px] px-2 shrink-0 select-none">
      {/* Bên trái — thông tin Git */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <span className="opacity-70">0 errors, 0 warnings</span>
      </div>

      {/* Bên phải — thông tin file */}
      <div className="flex items-center gap-4">
        <span>Ln 1, Col 1</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>{getLanguage(activeFile)}</span>
        <span>Prettier</span>
      </div>
    </div>
  );
}
