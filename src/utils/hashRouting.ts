export type HashRoute = {
  section: string | null;
  params: URLSearchParams;
};

export const parseHash = (hash: string): HashRoute => {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!trimmed) {
    return { section: null, params: new URLSearchParams() };
  }

  const [sectionPart, query = ""] = trimmed.split("?");
  return {
    section: sectionPart || null,
    params: new URLSearchParams(query),
  };
};

export const buildHash = (
  section: string,
  params?: Record<string, string | number | null | undefined>
) => {
  const search = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;
      search.set(key, String(value));
    });
  }
  const query = search.toString();
  return `#${section}${query ? `?${query}` : ""}`;
};

export const setHash = (
  section: string,
  params?: Record<string, string | number | null | undefined>,
  options?: { replace?: boolean }
) => {
  const hash = buildHash(section, params);
  if (options?.replace) {
    window.history.replaceState(null, "", hash);
  } else {
    window.location.hash = hash;
  }
};

export const getShareUrl = (
  section: string,
  params?: Record<string, string | number | null | undefined>
) => `${window.location.origin}${window.location.pathname}${buildHash(section, params)}`;
