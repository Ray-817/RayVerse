import { fetchData } from "./api"; // 导入你封装好的 fetchData 函数

const VIDEO_BASE_ENDPOINT = "/videos";

/**
 * 从后端 API 获取视频数据。
 * @returns {Promise<Array<Object>>} 包含视频数据的 Promise，每个对象包含 id, title, videoUrl, posterUrl 等。
 * @throws {Error} 如果网络请求失败或响应不 OK。
 */
export async function fetchVideos() {
  const cacheKey = `all_videos_data`;
  const cachedData = localStorage.getItem(cacheKey);

  // --- 1. 检查 LocalStorage 缓存 ---
  if (cachedData) {
    try {
      const { videos: cachedVideos, expiresAt } = JSON.parse(cachedData);
      const isCacheValid = Date.now() < expiresAt;

      if (isCacheValid) {
        console.log(`[Cache Hit] Using cached video data.`);
        return cachedVideos;
      }
      if (!isCacheValid) {
        // 冗余检查，如果上面的 if 没通过，肯定就是 !isCacheValid
        console.log(`[Cache Expired] Cached video data expired.`);
        localStorage.removeItem(cacheKey);
      }
    } catch (e) {
      console.error("[Cache Error] Error parsing cached video data:", e);
      localStorage.removeItem(cacheKey);
    }
  }

  // --- 2. 缓存无效或不存在，从网络获取 ---
  try {
    console.log(`[Network Fetch] Fetching new video data from backend.`);
    // 调用通用的 fetchData 函数，它会返回后端响应的完整 JSON 对象
    const responseData = await fetchData(VIDEO_BASE_ENDPOINT);

    // --- 关键修改：从后端响应中提取实际的视频数组 ---
    // 你的后端返回的是 { status: "success", results: ..., videos: [...] }
    // 所以你需要访问 responseData.videos
    const videosArray = responseData.videos;

    if (!videosArray) {
      throw new Error(
        "Invalid video data structure from backend: 'videos' array not found."
      );
    }

    const backendExpiresInSeconds = 24 * 3600; // 后端设定的 24 小时
    const frontendCacheExpirationSeconds = backendExpiresInSeconds - 300; // 减去 5 分钟的安全裕度
    const expirationMs = frontendCacheExpirationSeconds * 1000;
    const finalExpirationMs = Math.max(expirationMs, 60 * 1000); // 确保至少 1 分钟

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        videos: videosArray,
        expiresAt: Date.now() + finalExpirationMs,
      })
    );

    return videosArray; // 返回实际的视频数组给组件
  } catch (error) {
    console.error("Error fetching videos in videoService:", error);
    throw error;
  }
}
