const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const API_KEY = import.meta.env.VITE_API_KEY;
const TIMEOUT_SEC = 10;
const DEFAULT_LANG = "en";
const PAGINATION_PAGE = 4;

const config = {
  API_BASE_URL,
  API_KEY,
  TIMEOUT_SEC,
  DEFAULT_LANG,
  PAGINATION_PAGE,
};

export default config;
