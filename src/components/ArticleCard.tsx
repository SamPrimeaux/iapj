import { Link } from "react-router-dom";
import { motion } from "motion/react";
import type { Article } from "../data/articles";
import { cn } from "../lib/utils";
import { resolveMedia } from "../lib/mediaResolver";
import { FadeImage } from "./FadeImage";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  index: number;
}

export function ArticleCard({ article, featured = false, index }: ArticleCardProps) {
  const cover = resolveMedia(article.coverImageRef);
  const avatar = resolveMedia(article.author.avatarRef);
  const articleHref = `/essays/${article.slug}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group flex flex-col gap-6",
        featured ? "md:flex-row md:items-center md:gap-12" : ""
      )}
    >
      <Link
        to={articleHref}
        className={cn(
          "block overflow-hidden bg-[var(--iapj-surface-subtle)]",
          featured ? "aspect-[16/9] md:aspect-[4/3] md:w-3/5" : "aspect-[16/10] w-full"
        )}
      >
        <FadeImage
          src={cover.src}
          alt={cover.alt || article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={featured ? "eager" : "lazy"}
        />
      </Link>

      <div className={cn("flex flex-col", featured ? "md:w-2/5" : "")}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wider text-[var(--iapj-text-muted)]">
          <span>{article.date}</span>
          <span aria-hidden="true">·</span>
          <span>{article.categoryLabel}</span>
        </div>

        <Link to={articleHref} className="group-hover:text-[var(--iapj-link-hover)] transition-colors">
          <h2
            className={cn(
              "font-serif leading-tight text-[var(--iapj-text-primary)]",
              featured ? "text-3xl md:text-4xl lg:text-[2.65rem] mb-4" : "text-2xl mb-3"
            )}
          >
            {article.title}
          </h2>
        </Link>

        <p
          className={cn(
            "text-[var(--iapj-text-body)] leading-relaxed",
            featured ? "text-base lg:text-lg mb-6" : "text-sm mb-4 line-clamp-3"
          )}
        >
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[var(--iapj-surface-subtle)]">
            <FadeImage
              src={avatar.src}
              alt={avatar.alt || article.author.name}
              className="h-full w-full object-cover grayscale"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-[var(--iapj-text-primary)]">
              {article.author.name}
            </span>
            <span className="text-xs text-[var(--iapj-text-muted)] tabular-nums">
              {article.readTime}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
