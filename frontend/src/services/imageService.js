// src/services/imageService.js
import { fetchData } from "./api"; // 导入你封装好的 fetchData 函数
// import config from "../config/appConfig"; // 如果有用到全局配置（例如默认语言或分页大小），可以保留

const IMAGE_BASE_ENDPOINT = "/images";

/**
 * 从后端获取所有缩略图列表，并支持 LocalStorage 缓存。
 *
 * @returns {Promise<Array>} 包含缩略图数据的数组，每项包含 thumbnailUrl (R2 预签名 URL)。
 * @throws {Error} 如果 API 请求失败或缓存解析失败。
 */
export const getAllThumbnails = async () => {
  const cacheKey = `all_thumbnails`; // 定义缓存键，对于所有缩略图列表，可以是一个固定键
  const cachedData = localStorage.getItem(cacheKey);

  // --- 1. 检查 LocalStorage 缓存 ---
  if (cachedData) {
    try {
      const { thumbnails: cachedThumbnails, expiresAt } =
        JSON.parse(cachedData);
      // 检查缓存是否过期 (与后端 R2 URL 有效期保持一致，例如 24 小时)
      const isCacheValid = Date.now() < expiresAt;

      if (isCacheValid) {
        console.log(`[Cache Hit] Using cached thumbnails.`);
        return cachedThumbnails; // 缓存有效，直接返回
      }
      if (!isCacheValid) {
        console.log(`[Cache Expired] Cached thumbnails expired.`);
        localStorage.removeItem(cacheKey); // 移除过期缓存
      }
    } catch (e) {
      console.error("[Cache Error] Error parsing cached thumbnails data:", e);
      localStorage.removeItem(cacheKey); // 缓存数据损坏，移除
      // 继续执行，从网络获取数据
    }
  }

  // --- 2. 缓存无效或不存在，从网络获取 ---
  try {
    console.log(`[Network Fetch] Fetching new thumbnails from backend.`);
    const data = await fetchData(`${IMAGE_BASE_ENDPOINT}/thumbnails`);

    // --- 3. 成功获取后，更新 LocalStorage 缓存 ---
    // 设置缓存有效期为 24 小时 (与后端 R2 URL 有效期一致)
    const expirationMs = 3600 * 24 * 1000; // 24小时的毫秒数
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        thumbnails: data,
        expiresAt: Date.now() + expirationMs,
      })
    );

    return data;
  } catch (error) {
    console.error("Error fetching all thumbnails:", error);
    throw error; // 向上抛出错误，以便组件可以处理
  }
};

/**
 * 根据 slug 从后端获取单张图片详情，并支持 LocalStorage 缓存。
 *
 * @param {string} slug - 图片的唯一标识符。
 * @returns {Promise<Object>} 图片详情数据，包含 imageUrl (R2 预签名 URL)。
 * @throws {Error} 如果 API 请求失败或缓存解析失败。
 */
export const getSingleImageBySlug = async (slug) => {
  const cacheKey = `image_content_${slug}`;
  const cachedData = localStorage.getItem(cacheKey);

  // --- 1. 检查 LocalStorage 缓存 ---
  if (cachedData) {
    try {
      const { image: cachedImage, expiresAt } = JSON.parse(cachedData);
      const isCacheValid = Date.now() < expiresAt;

      if (isCacheValid) {
        console.log(`[Cache Hit] Using cached image content for slug: ${slug}`);
        return cachedImage; // 缓存有效，直接返回
      }
      if (!isCacheValid) {
        console.log(
          `[Cache Expired] Cached image content for slug: ${slug} expired.`
        );
        localStorage.removeItem(cacheKey); // 移除过期缓存
      }
    } catch (e) {
      console.error("[Cache Error] Error parsing cached image data:", e);
      localStorage.removeItem(cacheKey); // 缓存数据损坏，移除
      // 继续执行，从网络获取数据
    }
  }

  // --- 2. 缓存无效或不存在，从网络获取 ---
  try {
    console.log(`[Network Fetch] Fetching new image content for slug: ${slug}`);
    const data = await fetchData(`${IMAGE_BASE_ENDPOINT}/slug/${slug}`);

    // --- 3. 成功获取后，更新 LocalStorage 缓存 ---
    // 设置缓存有效期为 24 小时 (与后端 R2 URL 有效期一致)
    const expirationMs = 3600 * 24 * 1000; // 24小时的毫秒数
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        image: data,
        expiresAt: Date.now() + expirationMs,
      })
    );

    return data;
  } catch (error) {
    console.error(
      `[Network Error] Error fetching image with slug ${slug}:`,
      error
    );
    throw error;
  }
};
