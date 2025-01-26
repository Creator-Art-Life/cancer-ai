interface ImportMetaEnv {
  VITE_DATA_BASE_URL: string;
  VITE_PRIVY_APP_ID: string;
  VITE_GEMINI_API_KEY: string;
  // Добавьте другие переменные окружения, которые используете
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
