import { motion } from "motion/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getSiteManifest, resolveLink, resolveMedia } from "../lib/mediaResolver";
import { FadeImage } from "../components/FadeImage";

export function About() {
  const manifest = getSiteManifest();
  const { author, contact } = manifest;
  const portrait = resolveMedia(author.portraitRef);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--iapj-bg)] text-[var(--iapj-text-primary)]">
      <Header />
      <main className="flex-1">
        <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start"
          >
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/5] overflow-hidden bg-[var(--iapj-surface-subtle)] sticky top-24">
                <FadeImage
                  src={portrait.src}
                  alt={portrait.alt || author.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center pt-4 md:pt-0">
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-[var(--iapj-text-primary)] mb-8 tracking-tight">
                {author.aboutHeading}
              </h1>
              <div className="prose prose-lg iapj-prose prose-p:leading-relaxed">
                <p className="text-2xl font-serif italic text-[var(--iapj-text-primary)] mb-8 leading-snug">
                  {author.bio}
                </p>
                {author.aboutParagraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-16 pt-12 border-t border-[var(--iapj-border)]">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--iapj-text-primary)] mb-6">
                  {contact.heading}
                </h3>
                <div className="flex flex-col gap-3.5">
                  <a
                    href={resolveLink(contact.emailRef)}
                    className="text-[var(--iapj-text-body)] hover:text-[var(--iapj-text-primary)] transition-colors font-medium w-fit"
                  >
                    {contact.email}
                  </a>
                  {contact.socials.map((social) => (
                    <a
                      key={social.id}
                      href={resolveLink(social.urlRef)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--iapj-text-body)] hover:text-[var(--iapj-text-primary)] transition-colors font-medium w-fit"
                    >
                      {social.label}: {social.handle}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
