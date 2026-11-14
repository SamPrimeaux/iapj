import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { getSiteManifest } from "../lib/mediaResolver";
import { MenuOverlay } from "./MenuOverlay";
import { SearchOverlay } from "./SearchOverlay";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const manifest = getSiteManifest();

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 w-full border-b border-[var(--iapj-border)] bg-[var(--iapj-bg)]/90 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-[var(--iapj-container-max)] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)] transition-colors cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="font-serif text-xl font-semibold tracking-wide text-[var(--iapj-text-primary)]">
              {manifest.brand.title}
            </span>
          </Link>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search articles"
              className="p-2 text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)] transition-colors cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to={manifest.navigation.headerCta.path}
              className="hidden sm:inline-block whitespace-nowrap shrink-0 text-sm font-medium tracking-wider text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)] transition-colors"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {manifest.navigation.headerCta.label}
            </Link>
          </div>
        </div>
      </motion.header>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
