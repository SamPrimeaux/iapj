import { motion } from "motion/react";
import { useState } from "react";
import { photographyRefs } from "../data/articles";
import { resolveMedia } from "../lib/mediaResolver";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Lightbox } from "../components/Lightbox";
import { FadeImage } from "../components/FadeImage";

export function Photography() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const photos = photographyRefs.map((ref) => resolveMedia(ref));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--iapj-bg)] text-[var(--iapj-text-primary)]">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[var(--iapj-container-max)] px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <p className="mb-3 text-xs font-medium tracking-wider text-[var(--iapj-text-muted)]">
              Visual Archive
            </p>
            <h1 className="font-serif text-5xl font-medium tracking-tight text-[var(--iapj-text-primary)] md:text-6xl">
              Studio &amp; Hardware Plates
            </h1>
            <p className="mt-4 text-lg text-[var(--iapj-text-body)] max-w-2xl leading-relaxed">
              Editorial photography, industrial enclosures, architectural studies, and mechanical assemblies produced for InnerAnimalMedia and AgentSam.
            </p>
          </motion.div>
        </div>

        {/* Full Bleed Masonry Grid */}
        <div className="w-full px-1 pb-1">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-1 space-y-1">
            {photos.map((photo, idx) => (
              <motion.button
                type="button"
                key={photographyRefs[idx]}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "100px" }}
                transition={{ duration: 0.55, delay: (idx % 4) * 0.08 }}
                onClick={() => setSelectedIndex(idx)}
                className="group relative block w-full break-inside-avoid overflow-hidden bg-[var(--iapj-surface-subtle)] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--iapj-accent)]"
              >
                <FadeImage
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 w-full p-6 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-left">
                    <p className="text-[var(--iapj-media-ink)] font-serif text-lg tracking-wide">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      <Lightbox
        isOpen={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        src={selectedIndex !== null ? photos[selectedIndex].src : ""}
        alt={selectedIndex !== null ? photos[selectedIndex].alt : ""}
        caption={selectedIndex !== null ? photos[selectedIndex].caption : ""}
      />
    </div>
  );
}
