import { fetchData } from "./api"; // 导入你封装好的 fetchData 函数

/**
 * 从后端 API 获取视频数据。
 * @returns {Promise<Array<Object>>} 包含视频数据的 Promise，每个对象包含 id, title, videoUrl, posterUrl 等。
 * @throws {Error} 如果网络请求失败或响应不 OK。
 */
export async function fetchVideos() {
  try {
    const videos = await fetchData("/videos"); // 调用通用的 fetchData 函数
    return videos;
  } catch (error) {
    console.error("Error fetching videos in videoService:", error);
    // 根据需要，你可以选择重新抛出错误，或者返回一个特定的错误状态
    throw error;
  }
}
