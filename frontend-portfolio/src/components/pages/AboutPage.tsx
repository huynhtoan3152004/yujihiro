/**
 * AboutPage.tsx — Trang About Me
 * Hiển thị giống file about.html như trong hình mẫu
 */
import { motion } from "framer-motion";
import { profile } from "@/data/siteData";

export default function AboutPage() {
  return (
    <div className="p-8 md:p-12 max-w-[800px]">
      {/* Header comment */}
      <motion.p
        className="text-[var(--syntax-comment)] text-[14px] mb-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        {"<!-- about.html — Yujihiro -->"}
      </motion.p>

      {/* Tiêu đề */}
      <motion.h1
        className="text-[48px] font-black text-white mb-2"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        About Me
      </motion.h1>

      <motion.p
        className="text-[var(--vscode-text-muted)] text-[14px] mb-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
      >
        {"// who I am · what I do · where I build"}
      </motion.p>

      {/* Bio card */}
      <motion.div
        className="border border-[var(--vscode-border)] rounded-lg p-6 mb-8 bg-[var(--vscode-sidebar-bg)]"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <p className="text-[14px] text-[var(--vscode-text)] leading-relaxed" dangerouslySetInnerHTML={{ __html: profile.bio }} />
      </motion.div>

      {/* Current Focus */}
      <motion.div
        className="border border-[var(--vscode-border)] rounded-lg p-6 bg-[var(--vscode-sidebar-bg)]"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        <h2 className="text-[var(--syntax-type)] text-[14px] font-bold uppercase tracking-[0.1em] mb-4">
          Current Focus
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px] text-[var(--vscode-text-muted)]">
          <li className="flex items-start gap-2"><span>🚀</span> Building scalable backend systems</li>
          <li className="flex items-start gap-2"><span>🧠</span> Learning system design patterns</li>
          <li className="flex items-start gap-2"><span>🔍</span> Exploring clean architecture</li>
          <li className="flex items-start gap-2"><span>💬</span> Talk to me about React, Express, PostgreSQL</li>
          <li className="flex items-start gap-2"><span>⚡</span> Making developer tools people love</li>
          <li className="flex items-start gap-2"><span>🌟</span> Always learning, always shipping</li>
        </ul>
      </motion.div>
    </div>
  );
}
