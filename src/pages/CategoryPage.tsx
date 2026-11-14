import { motion } from "motion/react";
import { articles, type ArticleCategory } from "../data/articles";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArticleCard } from "../components/ArticleCard";

interface CategoryPageProps {
  category: ArticleCategory;
  eyebrow: string;
  title: string;
  description: string;
}

export function CategoryPage({ category, eyebrow, title, description }: CategoryPageProps) {
  const entries = articles.filter((article) => article.category === category);
  const featured = entries[0];
  const remaining = entries.slice(1);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--iapj-bg)] text-[var(--iapj-text-primary)]">
      <Header />

      <main className="flex-1">
        <section className="mx-auto max-w-[var(--iapj-container-max)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 border-b border-[var(--iapj-border)] pb-10"
          >
            <p className="mb-3 text-xs font-medium tracking-wider text-[var(--iapj-text-muted)]">
              {eyebrow}
            </p>
            <h1 className="font-serif text-5xl font-medium tracking-tight text-[var(--iapj-text-primary)] md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--iapj-text-body)]">
              {description}
            </p>
          </motion.div>

          {featured && (
            <div className="mb-16">
              <ArticleCard article={featured} featured index={0} />
            </div>
          )}

          {remaining.length > 0 && (
            <div className="border-t border-[var(--iapj-border)] pt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
              {remaining.map((article, idx) => (
                <ArticleCard key={article.id} article={article} index={idx + 1} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
