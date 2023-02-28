/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly APP_API_BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
