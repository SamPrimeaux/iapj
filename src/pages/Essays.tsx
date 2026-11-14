import { useState } from "react";
import { motion } from "motion/react";
import { articles } from "../data/articles";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArticleCard } from "../components/ArticleCard";
import { cn } from "../lib/utils";

export function Essays() {
  const allTags = ["All", ...Array.from(new Set(articles.flatMap((a) => a.tags)))];
  const [activeTag, setActiveTag] = useState<string>("All");

  const filtered =
    activeTag === "All"
      ? articles
      : articles.filter((article) => article.tags.includes(activeTag));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--iapj-bg)] text-[var(--iapj-text-primary)]">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-[var(--iapj-container-max)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 border-b border-[var(--iapj-border)] pb-10"
          >
            <p className="mb-3 text-xs font-medium tracking-wider text-[var(--iapj-text-muted)]">
              Archive
            </p>
            <h1 className="font-serif text-5xl font-medium tracking-tight text-[var(--iapj-text-primary)] md:text-6xl">
              Essays &amp; Field Manuals
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--iapj-text-body)]">
              Canonical architecture guides on Systematic Autonomous Machinery (SAM), Go edge runtimes, and UI/UX design systems.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Filter essays by topic"
            >
              {allTags.map((tag) => {
                const isSelected = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTag(tag)}
                    className={cn(
                      "px-3.5 py-1.5 text-xs font-medium tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer border",
                      isSelected
                        ? "border-[var(--iapj-border-strong)] bg-[var(--iapj-accent)] text-[var(--iapj-accent-contrast)]"
                        : "border-[var(--iapj-border)] bg-transparent text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)] hover:border-[var(--iapj-text-muted)]"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
            {filtered.map((article, idx) => (
              <ArticleCard key={article.id} article={article} index={idx} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
