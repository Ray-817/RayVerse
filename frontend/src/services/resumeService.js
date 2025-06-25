/* eslint-disable no-else-return */
import { fetchData } from "./api";

/**
 * 从后端获取简历的预签名下载链接，并支持 LocalStorage 缓存。
 *
 * @param {string} lang - 简历的语言（例如 'en' 或 'jp'）。
 * @returns {Promise<string>} 成功时返回预签名 URL。
 * @throws {Error} 如果获取失败，则抛出错误。
 */
export async function getResumeDownloadLink(lang) {
  const defaultLang = "en"; // 默认语言
  const requestLang = lang || defaultLang; // 确定请求的语言

  const cacheKey = `resume_link_${requestLang}`; // 为不同语言的简历使用不同的缓存键
  const cachedData = localStorage.getItem(cacheKey);

  // --- 1. 检查 LocalStorage 缓存 ---
  if (cachedData) {
    try {
      const { url: cachedUrl, expiresAt } = JSON.parse(cachedData);
      // 检查缓存是否过期 (与后端 R2 URL 有效期保持一致，例如 24 小时)
      const isCacheValid = Date.now() < expiresAt;

      if (isCacheValid) {
        console.log(
          `[Cache Hit] Using cached resume link for language: ${requestLang}`
        );
        return cachedUrl; // 缓存有效，直接返回
      }
      if (!isCacheValid) {
        console.log(
          `[Cache Expired] Cached resume link for language: ${requestLang} expired.`
        );
        localStorage.removeItem(cacheKey); // 移除过期缓存
      }
    } catch (e) {
      console.error("[Cache Error] Error parsing cached resume link data:", e);
      localStorage.removeItem(cacheKey); // 缓存数据损坏，移除
      // 继续执行，从网络获取数据
    }
  }

  // --- 2. 缓存无效或不存在，从网络获取 ---
  try {
    console.log(
      `[Network Fetch] Fetching new resume link for language: ${requestLang}.`
    );
    const data = await fetchData(`/resumes?lang=${requestLang}`);

    if (data.url) {
      // --- 3. 成功获取后，更新 LocalStorage 缓存 ---
      // 设置缓存有效期为 24 小时 (与后端 R2 URL 有效期一致)
      const expirationMs = 3600 * 24 * 1000; // 24小时的毫秒数
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          url: data.url,
          expiresAt: Date.now() + expirationMs,
        })
      );

      return data.url;
    } else {
      // 如果后端 API 返回 success: true 但没有 url，或者有其他非标准情况
      throw new Error(
        data.message || "Download URL not found in API response."
      );
    }
  } catch (error) {
    console.error("Error in getResumeDownloadLink service:", error);
    throw error; // 重新抛出 fetchData 已经抛出的错误
  }
}
