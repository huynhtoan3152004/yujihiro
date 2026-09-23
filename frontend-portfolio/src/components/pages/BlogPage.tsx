/**
 * BlogPage.tsx — Trang Blog render dưới dạng TypeScript code file
 */
import { motion } from "framer-motion";
import { blogPosts } from "@/data/siteData";

export default function BlogPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-8 md:p-12 font-mono text-[13px] leading-[22px] max-w-[800px]">
      <motion.p
        className="text-[var(--syntax-comment)] text-[14px] mb-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        {"// experience.ts — Space lưu trữ bài viết & chia sẻ kinh nghiệm"}
      </motion.p>

      <motion.div variants={container} initial="hidden" animate="show" className="text-[var(--vscode-text)]">
        {/* Type Definition */}
        <motion.div variants={item} className="mb-6">
          <div><span className="text-[var(--syntax-keyword)]">type</span> <span className="text-[var(--syntax-type)]">Experience</span> <span className="text-[var(--syntax-operator)]">=</span> <span className="text-[var(--syntax-bracket)]">{"{"}</span></div>
          <div className="pl-4"><span className="text-[var(--syntax-variable)]">id</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-type)]">number</span><span className="text-[var(--syntax-operator)]">;</span></div>
          <div className="pl-4"><span className="text-[var(--syntax-variable)]">title</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-type)]">string</span><span className="text-[var(--syntax-operator)]">;</span></div>
          <div className="pl-4"><span className="text-[var(--syntax-variable)]">tags</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-type)]">string</span><span className="text-[var(--syntax-operator)]">[];</span></div>
          <div className="pl-4"><span className="text-[var(--syntax-variable)]">preview</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-type)]">string</span><span className="text-[var(--syntax-operator)]">;</span></div>
          <div className="pl-4"><span className="text-[var(--syntax-variable)]">date</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-type)]">string</span><span className="text-[var(--syntax-operator)]">;</span></div>
          <div className="pl-4"><span className="text-[var(--syntax-variable)]">readTime</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-type)]">string</span><span className="text-[var(--syntax-operator)]">;</span></div>
          <div><span className="text-[var(--syntax-bracket)]">{"}"}</span><span className="text-[var(--syntax-operator)]">;</span></div>
        </motion.div>

        {/* Array Declaration */}
        <motion.div variants={item} className="mb-2">
          <span className="text-[var(--syntax-keyword)]">export const</span> <span className="text-[var(--syntax-variable)]">experiences</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-type)]">Experience</span><span className="text-[var(--syntax-operator)]">[]</span> <span className="text-[var(--syntax-operator)]">=</span> <span className="text-[var(--syntax-bracket)]">{"["}</span>
        </motion.div>

        {/* Array Data */}
        <div className="pl-4 border-l border-[var(--vscode-border)] ml-2">
          {blogPosts.map((post, idx) => (
            <motion.div key={post.id} variants={item} className="mb-4">
              <div><span className="text-[var(--syntax-bracket)]">{"{"}</span></div>
              <div className="pl-4"><span className="text-[var(--syntax-variable)]">id</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-number)]">{post.id}</span><span className="text-[var(--syntax-operator)]">,</span></div>
              <div className="pl-4"><span className="text-[var(--syntax-variable)]">title</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-string)]">"{post.title}"</span><span className="text-[var(--syntax-operator)]">,</span></div>
              <div className="pl-4">
                <span className="text-[var(--syntax-variable)]">tags</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-bracket)]">{"["}</span>
                {post.tags.map((tag, i) => (
                  <span key={tag}>
                    <span className="text-[var(--syntax-string)]">"{tag}"</span>
                    {i < post.tags.length - 1 && <span className="text-[var(--syntax-operator)]">, </span>}
                  </span>
                ))}
                <span className="text-[var(--syntax-bracket)]">{"]"}</span><span className="text-[var(--syntax-operator)]">,</span>
              </div>
              <div className="pl-4"><span className="text-[var(--syntax-variable)]">preview</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-string)]">"{post.preview}"</span><span className="text-[var(--syntax-operator)]">,</span></div>
              <div className="pl-4"><span className="text-[var(--syntax-variable)]">date</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-string)]">"{post.date}"</span><span className="text-[var(--syntax-operator)]">,</span></div>
              <div className="pl-4"><span className="text-[var(--syntax-variable)]">readTime</span><span className="text-[var(--syntax-operator)]">:</span> <span className="text-[var(--syntax-string)]">"{post.readTime}"</span><span className="text-[var(--syntax-operator)]">,</span></div>
              <div>
                <span className="text-[var(--syntax-bracket)]">{"}"}</span>
                {idx < blogPosts.length - 1 && <span className="text-[var(--syntax-operator)]">,</span>}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item}>
          <span className="text-[var(--syntax-bracket)]">{"]"}</span><span className="text-[var(--syntax-operator)]">;</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
