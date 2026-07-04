import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 px-6"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-text-tertiary"
            animate={{ y: [0, -4, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
