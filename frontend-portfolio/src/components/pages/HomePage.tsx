/**
 * HomePage.tsx — Trang chủ Portfolio
 *
 * Giao diện giống hình mẫu (Aahana Bobade style):
 * - Comment "hello world"
 * - Tên lớn bold + gradient
 * - Role badges
 * - Typing animation (chữ chạy)
 * - Đoạn bio với bold keywords
 * - 3 nút CTA (Projects, About, Contact)
 * - Stats section (Years, Projects, Curiosity...)
 * - Social links
 *
 * ⚠️ Toàn bộ dữ liệu lấy từ data/siteData.ts
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Folder, User, Mail, Code, ExternalLink } from "lucide-react";
import { profile, stats, socials } from "@/data/siteData";

// ============================================================
// TYPING EFFECT — Component hiệu ứng gõ chữ tự động
// ============================================================
function TypingEffect({ texts }: { texts: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentIndex];
    const speed = isDeleting ? 30 : 60; // Xoá nhanh hơn gõ

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Đang gõ — thêm từng ký tự
        setDisplayText(currentFullText.slice(0, displayText.length + 1));
        if (displayText.length === currentFullText.length) {
          // Gõ xong — đợi 2s rồi xoá
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Đang xoá — bớt từng ký tự
        setDisplayText(currentFullText.slice(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span className="text-[var(--vscode-text-muted)]">
      {displayText}
      <span className="animate-pulse text-[var(--syntax-keyword)]">|</span>
    </span>
  );
}

// ============================================================
// SOCIAL ICON — Map tên icon thành Lucide component
// ============================================================
function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "github":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.2-3.8s-1.2-.4-3.9 1.4a13.4 13.4 0 0 0-7 0C6.3 2.7 5.1 3.1 5.1 3.1a5.5 5.5 0 0 0-.2 3.8 5.5 5.5 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "code":     return <Code size={14} />;
    case "mail":     return <Mail size={14} />;
    default:         return <ExternalLink size={14} />;
  }
}

// ============================================================
// HOME PAGE CHÍNH
// ============================================================
export default function HomePage() {
  // Animation variants — cấu hình chuyển động cho framer-motion
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="p-8 md:p-12 max-w-[900px]">

      {/* COMMENT — dòng chào */}
      <motion.p
        className="text-[var(--syntax-comment)] text-[14px] mb-6"
        initial="hidden" animate="visible" custom={0} variants={fadeUp}
      >
        {profile.greeting}
      </motion.p>

      {/* TÊN LỚN — gradient text */}
      <motion.h1
        className="text-[60px] md:text-[80px] font-black leading-[0.95] tracking-tight mb-2"
        initial="hidden" animate="visible" custom={1} variants={fadeUp}
      >
        <span className="text-white">{profile.name.slice(0, 4)}</span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6bca] via-[#c06bff] to-[#6b8aff]">
          {profile.name.slice(4)}
        </span>
      </motion.h1>

      {/* ROLE BADGES */}
      <motion.div
        className="flex flex-wrap gap-2 mt-6 mb-4"
        initial="hidden" animate="visible" custom={2} variants={fadeUp}
      >
        {profile.roles.map((role) => (
          <span key={role} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)] text-[12px] text-[var(--vscode-text)]">
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            {role}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#c06bff]/40 bg-[#c06bff]/10 text-[12px] text-[#c06bff]">
          <span className="w-2 h-2 rounded-full bg-[#c06bff]" />
          {profile.company}
        </span>
      </motion.div>

      {/* TYPING ANIMATION */}
      <motion.div
        className="text-[14px] mb-6 h-[22px]"
        initial="hidden" animate="visible" custom={3} variants={fadeUp}
      >
        <TypingEffect texts={profile.typingTexts} />
      </motion.div>

      {/* BIO — mô tả ngắn */}
      <motion.div
        className="text-[14px] text-[var(--vscode-text-muted)] leading-relaxed mb-8 max-w-[600px]"
        initial="hidden" animate="visible" custom={4} variants={fadeUp}
        dangerouslySetInnerHTML={{ __html: profile.bio }}
      />

      {/* CTA BUTTONS */}
      <motion.div
        className="flex flex-wrap gap-3 mb-12"
        initial="hidden" animate="visible" custom={5} variants={fadeUp}
      >
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#007acc] hover:bg-[#006bb3] text-white text-[13px] font-medium rounded transition-colors">
          <Folder size={14} /> Projects
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-[var(--vscode-border)] hover:bg-white/5 text-[var(--vscode-text)] text-[13px] font-medium rounded transition-colors">
          <User size={14} /> About Me
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-[var(--vscode-border)] hover:bg-white/5 text-[var(--vscode-text)] text-[13px] font-medium rounded transition-colors">
          <Mail size={14} /> Contact
        </button>
      </motion.div>

      {/* STATS SECTION */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-[var(--vscode-border)] rounded-lg overflow-hidden mb-10"
        initial="hidden" animate="visible" custom={6} variants={fadeUp}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center justify-center py-6 ${
              i < stats.length - 1 ? "border-r border-[var(--vscode-border)]" : ""
            }`}
          >
            <span className="text-[28px] font-black text-white">{stat.value}</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-[var(--vscode-text-muted)] mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* SOCIAL LINKS */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial="hidden" animate="visible" custom={7} variants={fadeUp}
      >
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--vscode-border)] rounded text-[12px] text-[var(--vscode-text-muted)] hover:text-white hover:border-[var(--vscode-text-muted)] transition-colors"
          >
            <SocialIcon name={social.icon} />
            {social.name}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
