/**
 * TitleBar.tsx — Thanh tiêu đề kiểu macOS
 * 
 * Bao gồm:
 * - 3 nút tròn đỏ/vàng/xanh (traffic lights)
 * - Menu bar (File, Edit, View...)
 * - Ô Search ở giữa (Command Palette style)
 */
import { Search } from "lucide-react";

export default function TitleBar() {
  // Menu items — giống thanh menu macOS
  const menus = ["File", "Edit", "View", "Go", "Run", "Terminal", "Help"];

  return (
    <div className="flex items-center h-[38px] bg-[var(--vscode-titlebar-bg)] border-b border-[var(--vscode-border)] select-none shrink-0 px-3 gap-4">

      {/* 3 nút tròn macOS (chỉ trang trí) */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 cursor-pointer" title="Close" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 cursor-pointer" title="Minimize" />
        <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 cursor-pointer" title="Maximize" />
      </div>

      {/* Menu bar */}
      <div className="flex items-center gap-1 shrink-0">
        {menus.map((item) => (
          <button
            key={item}
            className="px-2 py-0.5 text-[12px] text-[var(--vscode-text-muted)] hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Spacer — đẩy search ra giữa */}
      <div className="flex-1" />

      {/* Ô Search giống Command Palette */}
      <div className="flex items-center gap-2 bg-[#3c3c3c] rounded-md px-3 py-1 min-w-[260px] max-w-[400px] cursor-pointer hover:bg-[#454545] transition-colors">
        <Search size={13} className="text-[var(--vscode-text-muted)] shrink-0" />
        <span className="text-[12px] text-[var(--vscode-text-muted)]">
          yujihiro-portfolio : portfolio
        </span>
        {/* Phím tắt */}
        <div className="ml-auto flex items-center gap-1">
          <kbd className="text-[10px] bg-[#555] text-[#ccc] px-1.5 py-0.5 rounded">⌘</kbd>
          <kbd className="text-[10px] bg-[#555] text-[#ccc] px-1.5 py-0.5 rounded">P</kbd>
        </div>
      </div>

      {/* Spacer cuối */}
      <div className="flex-1" />
    </div>
  );
}
