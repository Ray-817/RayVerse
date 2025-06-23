/* eslint-disable no-else-return */
import { fetchData } from "./api";
/**
 * 从后端获取简历的预签名下载链接。
 * @param {string} lang - 简历的语言（例如 'en' 或 'jp'）。
 * @returns {Promise<string>} 成功时返回预签名 URL。
 * @throws {Error} 如果获取失败，则抛出错误。
 */
export async function getResumeDownloadLink(lang) {
  const defaultLang = "en"; // 默认语言
  const requestLang = lang || defaultLang;

  try {
    const data = await fetchData(`/resumes?lang=${requestLang}`);

    // fetchData 已经处理了 response.ok 和解析 JSON 错误
    // 所以这里只需要检查 data.success 和 data.url
    if (data.url) {
      return data.url;
    } else {
      // 如果后端 API 返回 success: true 但没有 url，或者有其他非标准情况
      throw new Error(
        data.message || "Download URL not found in API response."
      );
    }
  } catch (error) {
    console.error("Error in getResumeDownloadLink service:", error);
    // 重新抛出 fetchData 已经抛出的错误
    throw error;
  }
}
