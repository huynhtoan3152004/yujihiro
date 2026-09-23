/**
 * ContactPage.tsx — Trang Contact render dưới dạng CSS variables
 */
import { motion } from "framer-motion";
import { contact } from "@/data/siteData";

export default function ContactPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="p-8 md:p-12 font-mono text-[13px] leading-[22px] max-w-[800px]">
      <motion.p
        className="text-[var(--syntax-comment)] text-[14px] mb-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        {"/* contact.css — How to reach me */"}
      </motion.p>

      <motion.div variants={container} initial="hidden" animate="show" className="text-[var(--vscode-text)]">
        {/* Selector */}
        <motion.div variants={item}>
          <span className="text-[#d7ba7d]">.contact-info</span> <span className="text-[var(--syntax-bracket)]">{"{"}</span>
        </motion.div>

        {/* CSS Variables */}
        <div className="pl-6 border-l border-[var(--vscode-border)] ml-2">
          {Object.entries(contact).map(([key, value]) => (
            <motion.div key={key} variants={item} className="mb-1">
              <span className="text-[#9cdcfe]">--{key}</span>
              <span className="text-[var(--syntax-operator)]">: </span>
              <span className="text-[var(--syntax-string)]">"{value}"</span>
              <span className="text-[var(--syntax-operator)]">;</span>
            </motion.div>
          ))}
          
          <motion.div variants={item} className="mb-1 mt-4">
            <span className="text-[#9cdcfe]">display</span>
            <span className="text-[var(--syntax-operator)]">: </span>
            <span className="text-[#569cd6]">flex</span>
            <span className="text-[var(--syntax-operator)]">;</span>
          </motion.div>
          
          <motion.div variants={item} className="mb-1">
            <span className="text-[#9cdcfe]">align-items</span>
            <span className="text-[var(--syntax-operator)]">: </span>
            <span className="text-[#569cd6]">center</span>
            <span className="text-[var(--syntax-operator)]">;</span>
          </motion.div>
          
          <motion.div variants={item} className="mb-1">
            <span className="text-[#9cdcfe]">cursor</span>
            <span className="text-[var(--syntax-operator)]">: </span>
            <span className="text-[#569cd6]">pointer</span>
            <span className="text-[var(--syntax-operator)]">;</span>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <span className="text-[var(--syntax-bracket)]">{"}"}</span>
        </motion.div>
        
        <motion.div variants={item} className="mt-8">
          <span className="text-[var(--syntax-comment)]">{"/* Drop a message to mailto:yujihiro.dev@gmail.com */"}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
