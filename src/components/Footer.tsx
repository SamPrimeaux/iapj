import { Link } from "react-router-dom";
import { getSiteManifest, resolveLink } from "../lib/mediaResolver";

export function Footer() {
  const manifest = getSiteManifest();
  const { brand, navigation } = manifest;

  return (
    <footer className="border-t border-[var(--iapj-border)] bg-[var(--iapj-surface-subtle)] py-14 mt-24">
      <div className="mx-auto max-w-[var(--iapj-container-max)] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="font-serif text-xl font-semibold tracking-wide text-[var(--iapj-text-primary)] w-fit"
            >
              {brand.title}
            </Link>
            <p className="text-sm text-[var(--iapj-text-muted)] max-w-xs leading-relaxed">
              {brand.tagline}
            </p>
          </div>

          {navigation.footerGroups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold tracking-wider text-[var(--iapj-text-muted)]">
                {group.heading}
              </h4>
              <nav className="flex flex-col gap-2.5" aria-label={group.heading}>
                {group.links.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-sm text-[var(--iapj-text-body)] hover:text-[var(--iapj-text-primary)] transition-colors w-fit"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold tracking-wider text-[var(--iapj-text-muted)]">
              {navigation.footerConnectHeading}
            </h4>
            <nav className="flex flex-col gap-2.5" aria-label={navigation.footerConnectHeading}>
              {navigation.footerConnectLinks.map((item) => {
                const href = resolveLink(item.urlRef);
                const isExternal = href.startsWith("http");
                return (
                  <a
                    key={item.id}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="text-sm text-[var(--iapj-text-body)] hover:text-[var(--iapj-text-primary)] transition-colors w-fit"
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--iapj-border)] pt-8 sm:flex-row text-center sm:text-left">
          <p className="text-xs text-[var(--iapj-text-muted)]">
            &copy; {new Date().getFullYear()} {brand.copyrightHolder}. All rights reserved.
          </p>
          <p className="text-xs text-[var(--iapj-text-muted)] max-w-md sm:text-right">
            {brand.attribution.prefix}{" "}
            <a
              href={resolveLink(brand.attribution.sourceRef)}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-[var(--iapj-text-primary)] transition-colors"
            >
              {brand.attribution.sourceLabel}
            </a>
            . {brand.attribution.suffix}
          </p>
        </div>
      </div>
    </footer>
  );
}
