import siteManifest from "../content/site.manifest.json";

export interface MediaCatalogEntry {
  provider?: string;
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ResolvedMedia {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

// Vite-bundled local studio assets so paths work identically in dev and production builds
const bundledAssets = import.meta.glob<string>("/src/assets/images/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

declare global {
  interface Window {
    __IA_MEDIA_MAP__?: Record<
      string,
      MediaCatalogEntry | { src: string; alt?: string; caption?: string; width?: number; height?: number }
    >;
    __IA_LINK_MAP__?: Record<string, string>;
    __IA_SITE_MANIFEST__?: Partial<typeof siteManifest>;
  }
}

/**
 * Resolves logical asset keys (e.g., "media://cover-structured-decisions" or "cms://media_9821")
 * without baking external URLs into article data or JSX components.
 */
export function resolveMedia(
  mediaRef: string,
  customCatalog?: Record<string, MediaCatalogEntry>
): ResolvedMedia {
  if (typeof window !== "undefined" && window.__IA_MEDIA_MAP__?.[mediaRef]) {
    const runtimeEntry = window.__IA_MEDIA_MAP__[mediaRef];
    const rawSrc = "src" in runtimeEntry ? runtimeEntry.src : runtimeEntry.url;
    return {
      src: bundledAssets[rawSrc] ?? rawSrc,
      alt: runtimeEntry.alt ?? "",
      caption: runtimeEntry.caption,
      width: runtimeEntry.width,
      height: runtimeEntry.height,
    };
  }

  const catalog = customCatalog ?? (siteManifest.mediaCatalog as Record<string, MediaCatalogEntry>);
  const entry = catalog[mediaRef];

  if (entry) {
    return {
      src: bundledAssets[entry.url] ?? entry.url,
      alt: entry.alt ?? "",
      caption: entry.caption,
      width: entry.width,
      height: entry.height,
    };
  }

  return { src: "", alt: "" };
}

/**
 * Resolves logical navigation or external link refs (e.g., "social://github", "internal://about")
 * with optional CMS runtime override via window.__IA_LINK_MAP__.
 */
export function resolveLink(
  linkRef: string,
  customLinks?: Record<string, string>
): string {
  if (typeof window !== "undefined" && window.__IA_LINK_MAP__?.[linkRef]) {
    return window.__IA_LINK_MAP__[linkRef];
  }

  const links = customLinks ?? (siteManifest.linkCatalog as Record<string, string>);
  return links[linkRef] ?? "#";
}

export function getSiteManifest() {
  if (typeof window !== "undefined" && window.__IA_SITE_MANIFEST__) {
    return {
      ...siteManifest,
      ...window.__IA_SITE_MANIFEST__,
    };
  }
  return siteManifest;
}
