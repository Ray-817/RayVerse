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
  try {
    // 注意：我们将 lang 作为查询参数传递
    const data = await fetchData(
      `${ARTICLE_BASE_ENDPOINT}/slug/${slug}?lang=${lang}`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    throw error;
  }
};
