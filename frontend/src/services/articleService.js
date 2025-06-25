// src/services/articleService.js
import { fetchData } from "./api"; // 导入你封装好的 fetchData 函数
import config from "../config/appConfig";

const ARTICLE_BASE_ENDPOINT = "/articles";
/**
 * 从后端获取文章列表。
 *
 * @param {Object} params - 查询参数对象，例如 { page: 1, limit: 4, category: 'tech', fields: 'title,categories' }
 * @param {string} [params.category] - 可选。文章分类名称，如果为 'all' 或空，则不作为筛选条件。
 * @param {number} [params.page=1] - 可选。当前页码，默认为 1。
 * @param {number} [params.limit=config.PAGINATION_PAGE] - 可选。每页文章数量，默认为 4。
 * @param {string} [params.fields='title,categories'] - 可选。需要返回的字段，逗号分隔。
 * @returns {Promise<Object>} 包含文章列表、当前页码、总页数和总文章数的对象。
 * @throws {Error} 如果 API 请求失败或超时。
 */
export async function getArticles(params = {}) {
  // 构建查询字符串
  const queryParams = new URLSearchParams();

  // 默认参数
  const defaultParams = {
    page: 1,
    limit: config.PAGINATION_PAGE,
    lang: config.DEFAULT_LANG,
  };

  // 合并默认参数和传入的参数
  const mergedParams = { ...defaultParams, ...params };

  for (const key in mergedParams) {
    if (Object.prototype.hasOwnProperty.call(mergedParams, key)) {
      const value = mergedParams[key];
      // 确保值不为 undefined/null 并且不是 'all' (如果 'all' 不应该作为后端筛选条件)
      // 注意：'lang' 参数不能被过滤掉，即使它是默认值，也需要传递给后端
      if (
        value !== undefined &&
        value !== null &&
        !(key === "category" && value === "all")
      ) {
        if (key === "category") {
          queryParams.append("categories", value); // 转换为后端期望的 'categories'
        } else {
          queryParams.append(key, value);
        }
      }
    }
  }

  const queryString = queryParams.toString();
  // 使用 api.js 中封装的 fetchData 函数
  const data = await fetchData(
    `${ARTICLE_BASE_ENDPOINT}${queryString ? `?${queryString}` : ""}`
  );
  return data;
}

export const getSingleArticleBySlug = async (slug, lang) => {
  const cacheKey = `article_content_${slug}_${lang}`;
  const cachedData = localStorage.getItem(cacheKey);

  // --- 1. 检查 LocalStorage 缓存 ---
  if (cachedData) {
    try {
      const { article: cachedArticle, expiresAt } = JSON.parse(cachedData);
      // 检查缓存是否过期 (后端 R2 URL 通常有 24 小时有效期，所以前端缓存也设为 24 小时)
      const isCacheValid = Date.now() < expiresAt;

      if (isCacheValid) {
        console.log(
          `[Cache Hit] Using cached article content for slug: ${slug}, lang: ${lang}`
        );
        return cachedArticle; // 缓存有效，直接返回
      }
      if (!isCacheValid) {
        console.log(
          `[Cache Expired] Cached article content for slug: ${slug}, lang: ${lang} expired.`
        );
        localStorage.removeItem(cacheKey); // 移除过期缓存
      }
    } catch (e) {
      console.error("[Cache Error] Error parsing cached article data:", e);
      localStorage.removeItem(cacheKey); // 缓存数据损坏，移除
      // 继续执行，从网络获取数据
    }
  }

  // --- 2. 缓存无效或不存在，从网络获取 ---
  try {
    console.log(
      `[Network Fetch] Fetching new article content for slug: ${slug}, lang: ${lang}`
    );
    // 使用 api.js 中封装的 fetchData 函数
    const data = await fetchData(
      `${ARTICLE_BASE_ENDPOINT}/slug/${slug}?lang=${lang}`
    );

    // --- 3. 成功获取后，更新 LocalStorage 缓存 ---
    // 设置缓存有效期为 24 小时 (与后端 R2 URL 有效期一致)
    const expirationMs = 3600 * 24 * 1000; // 24小时的毫秒数
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        article: data,
        expiresAt: Date.now() + expirationMs,
      })
    );

    return data;
  } catch (error) {
    console.error(
      `[Network Error] Error fetching article with slug ${slug}:`,
      error
    );
    throw error; // 向上抛出错误，供组件层处理
  }
};
