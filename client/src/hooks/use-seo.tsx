import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  ogType?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Crack-CU";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export function useSEO({ title, description, path, ogType = "website", noIndex = false }: SEOProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);

    if (path) {
      const canonicalUrl = `${BASE_URL}${path}`;
      setCanonical(canonicalUrl);
      setMeta("og:url", canonicalUrl, true);
    }

    if (noIndex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) robotsMeta.remove();
    }

    return () => {
      document.title = `${SITE_NAME} - Don't Just Study, Crack It!`;
    };
  }, [title, description, path, ogType, noIndex]);
}
