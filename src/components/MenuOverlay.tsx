import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getSiteManifest, resolveLink } from "../lib/mediaResolver";
import { cn } from "../lib/utils";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const location = useLocation();
  const manifest = getSiteManifest();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] backdrop-blur-sm"
            style={{ backgroundColor: "var(--iapj-overlay-scrim)" }}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            aria-label="Site navigation"
            className="fixed inset-y-0 left-0 z-[100] w-full max-w-[var(--iapj-drawer-width)] bg-[var(--iapj-surface-elevated)] border-r border-[var(--iapj-border)] shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-[var(--iapj-border)]">
              <span className="font-serif text-lg font-semibold tracking-wide text-[var(--iapj-text-primary)]">
                {manifest.brand.title}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2 text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 justify-center">
              {manifest.navigation.drawer.map((link, idx) => {
                const isActive =
                  link.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(link.path);
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      className={cn(
                        "font-serif text-3xl sm:text-4xl transition-colors inline-block",
                        isActive
                          ? "text-[var(--iapj-text-primary)] underline underline-offset-8 decoration-1"
                          : "text-[var(--iapj-text-muted)] hover:text-[var(--iapj-text-primary)]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="p-8 border-t border-[var(--iapj-border)]">
              <div className="flex flex-wrap gap-5 text-xs font-medium tracking-wider text-[var(--iapj-text-muted)]">
                {manifest.contact.socials.map((social) => (
                  <a
                    key={social.id}
                    href={resolveLink(social.urlRef)}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[var(--iapj-text-primary)] transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
