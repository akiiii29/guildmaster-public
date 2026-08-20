const ACCESS_STORAGE_KEY = 'guildmaster-public-demo-access-v1'

function configuredAccessHashes() {
  return new Set((import.meta.env.VITE_PUBLIC_DEMO_ACCESS_HASHES ?? '').split(',').map((hash) => hash.trim().toLowerCase()).filter(Boolean))
}

function sha256Hex(value: string) {
  if (typeof crypto === 'undefined' || !crypto.subtle || typeof TextEncoder === 'undefined') return null
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)).then((digest) => Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(''))
}

export function hasTestAccess() {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(ACCESS_STORAGE_KEY) === 'granted'
  } catch {
    return false
  }
}

export async function verifyTestAccess(input: string) {
  const normalized = input.trim().toUpperCase()
  if (!normalized) return false
  const hash = await sha256Hex(normalized)
  if (!hash || !configuredAccessHashes().has(hash)) return false
  try {
    window.localStorage.setItem(ACCESS_STORAGE_KEY, 'granted')
  } catch {
    // The current session can still continue if storage is unavailable.
  }
  return true
}
