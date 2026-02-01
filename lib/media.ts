const BASE_URL = "http://162.43.37.225";

export function withBaseUrl(path?: string | null) {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}
