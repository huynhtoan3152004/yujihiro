/**
 * ProjectsPage.tsx — Trang hiển thị dự án
 * Giao diện card grid giống hình mẫu
 * ⚠️ Dữ liệu lấy từ data/siteData.ts
 */
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { projects } from "@/data/siteData";

export default function ProjectsPage() {
  return (
    <div className="p-8 md:p-12 max-w-[900px]">
      {/* Header */}
      <motion.p
        className="text-[var(--syntax-comment)] text-[14px] italic mb-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        {"// projects.js : things I've built & shipped"}
      </motion.p>
      <motion.h1
        className="text-[40px] font-black text-white mb-2"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        Projects
      </motion.h1>
      <motion.p
        className="text-[var(--vscode-text-muted)] text-[13px] mb-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
      >
        {"const projects = [ ...shipped, ...building ]"}
      </motion.p>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="border border-[var(--vscode-border)] rounded-lg p-6 bg-[var(--vscode-sidebar-bg)] hover:border-[var(--vscode-text-muted)] transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            {/* Emoji + Category */}
            <div className="text-[24px] mb-3">{project.emoji}</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--syntax-type)]">
                {project.category}
              </span>
              <div className="flex gap-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[var(--vscode-text-muted)] border border-[var(--vscode-border)] rounded px-2 py-0.5 hover:text-white hover:border-white/30 transition-colors flex items-center gap-1">
                    GitHub <ExternalLink size={10} />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#28c840] border border-[#28c840]/30 rounded px-2 py-0.5 hover:bg-[#28c840]/10 transition-colors flex items-center gap-1">
                    Live <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>

            {/* Title + Description */}
            <h3 className="text-[18px] font-bold text-white mb-2 group-hover:text-[var(--syntax-variable)] transition-colors">
              {project.title}
            </h3>
            <p className="text-[13px] text-[var(--vscode-text-muted)] leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-2 py-0.5 text-[11px] border border-[var(--vscode-border)] rounded text-[var(--vscode-text-muted)]">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
