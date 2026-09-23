/**
 * Sidebar.tsx — Panel File Explorer bên trái
 * 
 * Hiển thị cây thư mục giống VS Code.
 * Dữ liệu file tree được import từ data/siteData.ts
 */
import { useState } from "react";
import { ChevronRight, ChevronDown, FolderOpen, Folder } from "lucide-react";
import { fileTree } from "@/data/siteData";
import type { FileNode } from "@/data/siteData";

// ============================================================
// ICON FILE — Xác định icon + màu theo loại file
// ============================================================
const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  tsx:  { icon: "⚛",  color: "#519aba" },
  js:   { icon: "JS", color: "#f0db4f" },
  ts:   { icon: "TS", color: "#007acc" },
  json: { icon: "{ }", color: "#cbcb41" },
  md:   { icon: "M↓", color: "#519aba" },
  css:  { icon: "#",  color: "#42a5f5" },
  html: { icon: "<>", color: "#e44d26" },
};

function FileIcon({ type }: { type?: string }) {
  const config = FILE_ICONS[type || ""] || { icon: "📄", color: "#888" };
  return (
    <span
      className="text-[10px] font-bold w-[18px] text-center shrink-0 leading-none"
      style={{ color: config.color }}
    >
      {config.icon}
    </span>
  );
}

// ============================================================
// COMPONENT CHÍNH
// ============================================================
interface SidebarProps {
  activeFile: string;
  onFileSelect: (pageId: string) => void;
}

export default function Sidebar({ activeFile, onFileSelect }: SidebarProps) {
  return (
    <div className="w-[220px] bg-[var(--vscode-sidebar-bg)] border-r border-[var(--vscode-border)] flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 h-[35px] text-[11px] uppercase tracking-[0.1em] text-[var(--vscode-text-muted)] font-semibold shrink-0">
        Portfolio
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto px-1 pb-4">
        {fileTree.map((node) => (
          <TreeNode key={node.name} node={node} depth={0} activeFile={activeFile} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TreeNode — Component đệ quy render từng node
// ============================================================
function TreeNode({ node, depth, activeFile, onFileSelect }: {
  node: FileNode;
  depth: number;
  activeFile: string;
  onFileSelect: (pageId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const indent = depth * 12 + 8;

  // --- FOLDER ---
  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 w-full py-[3px] pr-2 text-[13px] text-[var(--vscode-text)] hover:bg-white/5 rounded-sm"
          style={{ paddingLeft: `${indent}px` }}
        >
          {isOpen ? <ChevronDown size={14} className="text-[var(--vscode-text-muted)]" /> : <ChevronRight size={14} className="text-[var(--vscode-text-muted)]" />}
          {isOpen ? <FolderOpen size={14} className="text-[#dcb67a]" /> : <Folder size={14} className="text-[#dcb67a]" />}
          <span className="ml-1 truncate">{node.name}</span>
        </button>
        {isOpen && node.children?.map((child) => (
          <TreeNode key={child.name} node={child} depth={depth + 1} activeFile={activeFile} onFileSelect={onFileSelect} />
        ))}
      </div>
    );
  }

  // --- FILE ---
  const isActive = node.pageId === activeFile;
  return (
    <button
      onClick={() => node.pageId && onFileSelect(node.pageId)}
      className={`flex items-center gap-1.5 w-full py-[3px] pr-2 text-[13px] rounded-sm transition-colors ${
        isActive ? "bg-[#37373d] text-white" : "text-[var(--vscode-text)] hover:bg-white/5"
      }`}
      style={{ paddingLeft: `${indent + 14}px` }}
    >
      <FileIcon type={node.icon} />
      <span className="truncate">{node.name}</span>
    </button>
  );
}
