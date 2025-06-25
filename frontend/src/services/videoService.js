import { fetchData } from "./api"; // 导入你封装好的 fetchData 函数

const VIDEO_BASE_ENDPOINT = "/videos";

/**
 * 从后端 API 获取视频数据。
 * @returns {Promise<Array<Object>>} 包含视频数据的 Promise，每个对象包含 id, title, videoUrl, posterUrl 等。
 * @throws {Error} 如果网络请求失败或响应不 OK。
 */
export async function fetchVideos() {
  const cacheKey = `all_videos_data`; // 为视频列表定义一个固定的缓存键
  const cachedData = localStorage.getItem(cacheKey);

  // --- 1. 检查 LocalStorage 缓存 ---
  if (cachedData) {
    try {
      const { videos: cachedVideos, expiresAt } = JSON.parse(cachedData);
      // 检查缓存是否过期 (与后端 R2 URL 有效期保持一致，例如 24 小时)
      const isCacheValid = Date.now() < expiresAt;

      if (isCacheValid) {
        console.log(`[Cache Hit] Using cached video data.`);
        return cachedVideos; // 缓存有效，直接返回
      }
      if (!isCacheValid) {
        console.log(`[Cache Expired] Cached video data expired.`);
        localStorage.removeItem(cacheKey); // 移除过期缓存
      }
    } catch (e) {
      console.error("[Cache Error] Error parsing cached video data:", e);
      localStorage.removeItem(cacheKey); // 缓存数据损坏，移除
      // 继续执行，从网络获取数据
    }
  }

  // --- 2. 缓存无效或不存在，从网络获取 ---
  try {
    console.log(`[Network Fetch] Fetching new video data from backend.`);
    const videos = await fetchData(VIDEO_BASE_ENDPOINT); // 调用通用的 fetchData 函数

    // --- 3. 成功获取后，更新 LocalStorage 缓存 ---
    // 设置缓存有效期为 24 小时 (与后端 R2 URL 有效期一致)
    const expirationMs = 3600 * 24 * 1000; // 24小时的毫秒数
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        videos: videos,
        expiresAt: Date.now() + expirationMs,
      })
    );

    return videos;
  } catch (error) {
    console.error("Error fetching videos in videoService:", error);
    throw error; // 重新抛出错误，供组件层处理
  }
}
