/**
 * SkillsPage.tsx — Trang skills render dưới dạng package.json
 */
import { motion } from "framer-motion";

export default function SkillsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="p-8 md:p-12 font-mono text-[13px] leading-[22px] max-w-[800px]">
      <motion.p
        className="text-[var(--syntax-comment)] text-[14px] mb-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        {"// package.json — Kỹ năng được thể hiện như dependencies 📦"}
      </motion.p>

      <motion.div variants={container} initial="hidden" animate="show" className="text-[var(--vscode-text)]">
        <motion.div variants={item}>
          <span className="text-[var(--syntax-bracket)]">{"{"}</span>
        </motion.div>

        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-string)]">"name"</span>
          <span className="text-[var(--syntax-operator)]">: </span>
          <span className="text-[var(--syntax-string)]">"@yujihiro/skills"</span>
          <span className="text-[var(--syntax-operator)]">,</span>
        </motion.div>

        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-string)]">"version"</span>
          <span className="text-[var(--syntax-operator)]">: </span>
          <span className="text-[var(--syntax-string)]">"2026.4.25"</span>
          <span className="text-[var(--syntax-operator)]">,</span>
        </motion.div>

        <motion.div variants={item} className="pl-4 mb-4">
          <span className="text-[var(--syntax-string)]">"author"</span>
          <span className="text-[var(--syntax-operator)]">: </span>
          <span className="text-[var(--syntax-string)]">"Yujihiro"</span>
          <span className="text-[var(--syntax-operator)]">,</span>
        </motion.div>

        {/* Frontend Skills */}
        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-string)]">"dependencies"</span>
          <span className="text-[var(--syntax-operator)]">: </span>
          <span className="text-[var(--syntax-bracket)]">{"{"}</span>
          <span className="text-[var(--syntax-comment)] pl-2">{"// Frontend"}</span>
        </motion.div>
        
        {[
          { name: "react", version: "^19.x" },
          { name: "next.js", version: "^15.x" },
          { name: "typescript", version: "^5.x" },
          { name: "tailwind-css", version: "^4.x" },
          { name: "framer-motion", version: "^11.x" },
        ].map((dep, idx, arr) => (
          <motion.div key={dep.name} variants={item} className="pl-8">
            <span className="text-[var(--syntax-string)]">"{dep.name}"</span>
            <span className="text-[var(--syntax-operator)]">: </span>
            <span className="text-[var(--syntax-string)]">"{dep.version}"</span>
            {idx < arr.length - 1 && <span className="text-[var(--syntax-operator)]">,</span>}
          </motion.div>
        ))}
        
        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-bracket)]">{"}"}</span>
          <span className="text-[var(--syntax-operator)]">,</span>
        </motion.div>

        <motion.div variants={item} className="mb-4"></motion.div>

        {/* Backend Skills */}
        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-string)]">"devDependencies"</span>
          <span className="text-[var(--syntax-operator)]">: </span>
          <span className="text-[var(--syntax-bracket)]">{"{"}</span>
          <span className="text-[var(--syntax-comment)] pl-2">{"// Backend"}</span>
        </motion.div>

        {[
          { name: "node.js", version: "^23.x" },
          { name: "express", version: "^5.x" },
          { name: "prisma", version: "latest" },
          { name: "postgresql", version: "^16" },
          { name: "docker", version: "^27.x" },
        ].map((dep, idx, arr) => (
          <motion.div key={dep.name} variants={item} className="pl-8">
            <span className="text-[var(--syntax-string)]">"{dep.name}"</span>
            <span className="text-[var(--syntax-operator)]">: </span>
            <span className="text-[var(--syntax-string)]">"{dep.version}"</span>
            {idx < arr.length - 1 && <span className="text-[var(--syntax-operator)]">,</span>}
          </motion.div>
        ))}

        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-bracket)]">{"}"}</span>
          <span className="text-[var(--syntax-operator)]">,</span>
        </motion.div>

        <motion.div variants={item} className="mb-4"></motion.div>

        {/* Soft Skills */}
        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-string)]">"scripts"</span>
          <span className="text-[var(--syntax-operator)]">: </span>
          <span className="text-[var(--syntax-bracket)]">{"{"}</span>
          <span className="text-[var(--syntax-comment)] pl-2">{"// Soft Skills"}</span>
        </motion.div>

        {[
          { name: "teamwork", value: "Agile & Scrum methodology" },
          { name: "communication", value: "English (IELTS 7.0)" },
          { name: "problem-solving", value: "LeetCode 200+ solved" },
          { name: "learning", value: "never.stop()" },
        ].map((dep, idx, arr) => (
          <motion.div key={dep.name} variants={item} className="pl-8">
            <span className="text-[var(--syntax-string)]">"{dep.name}"</span>
            <span className="text-[var(--syntax-operator)]">: </span>
            <span className="text-[var(--syntax-string)]">"{dep.value}"</span>
            {idx < arr.length - 1 && <span className="text-[var(--syntax-operator)]">,</span>}
          </motion.div>
        ))}

        <motion.div variants={item} className="pl-4">
          <span className="text-[var(--syntax-bracket)]">{"}"}</span>
        </motion.div>

        <motion.div variants={item}>
          <span className="text-[var(--syntax-bracket)]">{"}"}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
