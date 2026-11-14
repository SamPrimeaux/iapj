import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { articles } from "../data/articles";
import { getSiteManifest } from "../lib/mediaResolver";
import { ArticleCard } from "../components/ArticleCard";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Home() {
  const manifest = getSiteManifest();
  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--iapj-bg)] text-[var(--iapj-text-primary)]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-[var(--iapj-container-max)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 max-w-3xl"
          >
            <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight text-[var(--iapj-text-primary)] sm:text-6xl md:text-7xl">
              {manifest.brand.heroTitlePrefix}{" "}
              <span className="italic text-[var(--iapj-text-muted)]">
                {manifest.brand.heroTitleHighlight}
              </span>{" "}
              {manifest.brand.heroTitleSuffix}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--iapj-text-body)] sm:text-xl">
              {manifest.brand.heroLead}
            </p>
          </motion.div>

          <ArticleCard article={featuredArticle} featured index={0} />
        </section>

        {/* Latest Articles */}
        <section className="mx-auto max-w-[var(--iapj-container-max)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between border-b border-[var(--iapj-border)] pb-4">
            <h2 className="text-sm font-semibold tracking-wider text-[var(--iapj-text-primary)]">
              Latest Entries
            </h2>
            <Link
              to="/essays"
              className="text-sm font-medium tracking-wider text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)] transition-colors whitespace-nowrap shrink-0"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
            {remainingArticles.map((article, idx) => (
              <ArticleCard key={article.id} article={article} index={idx + 1} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
