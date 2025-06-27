const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const FORM_ENDPOINT =
  import.meta.env.VITE_FORM_ENDPOINT || "https://getform.io/f/azynzzzb";
const TIMEOUT_SEC = 10;
const DEFAULT_LANG = "en";
const PAGINATION_PAGE = 4;

const config = {
  API_BASE_URL,
  TIMEOUT_SEC,
  DEFAULT_LANG,
  PAGINATION_PAGE,
  FORM_ENDPOINT,
};

export default config;
