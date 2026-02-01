const BASE_URL = 'http://192.168.1.27'

export function withBaseUrl(path?: string | null) {
  if (!path) return undefined
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}