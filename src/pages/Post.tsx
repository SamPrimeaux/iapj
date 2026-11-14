import { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { articles } from "../data/articles";
import { resolveMedia } from "../lib/mediaResolver";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthorInfo } from "../components/AuthorInfo";
import { QuoteEmbed } from "../components/QuoteEmbed";
import { ImageEmbed } from "../components/ImageEmbed";
import { Gallery } from "../components/Gallery";
import { FadeImage } from "../components/FadeImage";

function CodeBlock({ language, label, content }: { language: string; label?: string; content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable in non-secure context
    }
  };

  return (
    <div className="my-10 overflow-hidden border border-[var(--iapj-border)] bg-[var(--iapj-surface-subtle)]">
      <div className="flex items-center justify-between border-b border-[var(--iapj-border)] px-4 py-2.5 text-xs text-[var(--iapj-text-muted)]">
        <span className="font-mono tracking-tight">
          {label ? `${label} · ${language}` : language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto bg-transparent p-5 text-[13px] leading-relaxed font-mono text-[var(--iapj-text-primary)]">
        <code>{content}</code>
      </pre>
    </div>
  );
}

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const article = currentIndex >= 0 ? articles[currentIndex] : undefined;

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 260]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  if (!article) {
    return <Navigate to="/essays" replace />;
  }

  const cover = resolveMedia(article.coverImageRef);
  const previousArticle = currentIndex > 0 ? articles[currentIndex - 1] : undefined;
  const nextArticle =
    currentIndex < articles.length - 1 ? articles[currentIndex + 1] : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--iapj-bg)] text-[var(--iapj-text-primary)]">
      <Header />

      <main className="flex-1">
        {/* Immersive Hero using invariant dark media tokens */}
        <div className="relative h-[68vh] min-h-[480px] w-full overflow-hidden bg-[var(--iapj-media-backdrop)]">
          <motion.div style={{ y, opacity }} className="absolute inset-0">
            <FadeImage
              src={cover.src}
              alt={cover.alt || article.title}
              className="h-full w-full object-cover opacity-65"
            />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 md:p-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-5 flex flex-wrap items-center gap-2.5 text-xs font-medium tracking-wider text-[var(--iapj-media-ink-muted)]">
                <span>{article.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{article.date}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{article.readTime}</span>
              </div>

              <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-[var(--iapj-media-ink)] sm:text-5xl md:text-6xl">
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Article Body */}
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="prose prose-lg iapj-prose mx-auto prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-relaxed"
          >
            <p className="lead text-2xl font-serif italic text-[var(--iapj-text-primary)] mb-12">
              {article.excerpt}
            </p>

            {article.sections.map((section, idx) => {
              const sectionImage = section.imageRef
                ? resolveMedia(section.imageRef)
                : undefined;
              const sectionGallery = section.galleryRefs
                ? section.galleryRefs.map((ref) => {
                    const resolved = resolveMedia(ref);
                    return {
                      src: resolved.src,
                      alt: resolved.alt,
                      caption: resolved.caption,
                    };
                  })
                : undefined;

              return (
                <section key={idx} className="mb-10">
                  {section.heading && (
                    <h2 className="text-3xl mt-16 mb-6 text-[var(--iapj-text-primary)]">
                      {section.heading}
                    </h2>
                  )}

                  {section.subheading && (
                    <h3 className="text-2xl mt-10 mb-4 text-[var(--iapj-text-primary)]">
                      {section.subheading}
                    </h3>
                  )}

                  {section.paragraphs?.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}

                  {section.callout && (
                    <div className="not-prose my-10 border border-[var(--iapj-border)] bg-[var(--iapj-surface-subtle)] p-6 sm:p-8">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--iapj-text-muted)]">
                        {section.callout.label}
                      </p>
                      <p className="font-serif text-xl leading-relaxed text-[var(--iapj-text-primary)]">
                        {section.callout.text}
                      </p>
                    </div>
                  )}

                  {section.bullets && (
                    <ul className="my-6 space-y-3">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {bullet.label && (
                            <strong className="font-semibold text-[var(--iapj-text-primary)]">
                              {bullet.label}:{" "}
                            </strong>
                          )}
                          <span>{bullet.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.table && (
                    <div className="not-prose my-10 overflow-x-auto border border-[var(--iapj-border)]">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-[var(--iapj-border)] bg-[var(--iapj-surface-subtle)]">
                            {section.table.headers.map((header, hIdx) => (
                              <th
                                key={hIdx}
                                className="px-4 py-3 font-medium tracking-wide text-[var(--iapj-text-primary)]"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--iapj-border)]">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="px-4 py-3 align-top text-[var(--iapj-text-body)] tabular-nums"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.code && (
                    <div className="not-prose">
                      <CodeBlock
                        language={section.code.language}
                        label={section.code.label}
                        content={section.code.content}
                      />
                    </div>
                  )}

                  {section.quote && (
                    <QuoteEmbed
                      quote={section.quote.quote}
                      author={section.quote.author}
                      source={section.quote.source}
                    />
                  )}

                  {sectionImage && (
                    <ImageEmbed
                      src={sectionImage.src}
                      alt={sectionImage.alt}
                      caption={sectionImage.caption}
                      size="wide"
                    />
                  )}

                  {sectionGallery && <Gallery images={sectionGallery} />}
                </section>
              );
            })}
          </motion.div>

          <AuthorInfo author={article.author} />

          {/* Sequential Article Navigation */}
          <nav
            aria-label="Adjacent essays"
            className="mt-16 grid grid-cols-1 gap-6 border-t border-[var(--iapj-border)] pt-10 sm:grid-cols-2"
          >
            <div>
              {previousArticle && (
                <Link
                  to={`/essays/${previousArticle.slug}`}
                  className="group flex flex-col gap-2"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-[var(--iapj-text-muted)]">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous Entry</span>
                  </span>
                  <span className="font-serif text-lg text-[var(--iapj-text-primary)] group-hover:text-[var(--iapj-link-hover)] transition-colors">
                    {previousArticle.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {nextArticle && (
                <Link
                  to={`/essays/${nextArticle.slug}`}
                  className="group flex flex-col gap-2 sm:items-end"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-[var(--iapj-text-muted)]">
                    <span>Next Entry</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-serif text-lg text-[var(--iapj-text-primary)] group-hover:text-[var(--iapj-link-hover)] transition-colors">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </article>
      </main>

      <Footer />
    </div>
  );
}
