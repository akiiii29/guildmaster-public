/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_DEMO_ACCESS_HASHES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
