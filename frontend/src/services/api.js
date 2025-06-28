import config from "@config/appConfig";

const API_BASE_URL = config.API_BASE_URL; // 根据你的后端地址调整
// 使用 import.meta.env 来获取 Vite 环境变量
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
/**
 * 封装基础的 fetch 请求
 * @param {string} endpoint API 路径 (例如: '/articles')
 * @param {Object} options fetch 请求选项 (method, headers, body等)
 * @returns {Promise<Response>} fetch 响应对象
 * @throws {Error} 如果网络请求失败
 */
export async function fetchData(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await Promise.race([
      fetch(url, {
        headers: {
          "Content-Type": "application/json",
          // 如果有其他需要，例如认证 token
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        ...options,
      }),
      timeout(config.TIMEOUT_SEC),
    ]);

    if (!response.ok) {
      // 如果响应状态码不是 2xx，抛出错误
      const errorData = await response.json(); // 尝试解析后端返回的错误信息
      throw new Error(
        errorData.message || "Something went wrong on the server."
      );
    }

    return response.json(); // 返回 JSON 数据
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // 重新抛出错误，让调用者处理
  }
}
