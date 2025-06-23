import { fetchData } from "./api";

const IMAGE_BASE_ENDPOINT = "/images";

export const getAllThumbnails = async () => {
  try {
    const data = await fetchData(`${IMAGE_BASE_ENDPOINT}/thumbnails`);
    return data;
  } catch (error) {
    console.error("Error fetching all thumbnails:", error);
    throw error; // 重新抛出以便组件可以处理
  }
};

export const getSingleImageBySlug = async (slug) => {
  try {
    const data = await fetchData(`${IMAGE_BASE_ENDPOINT}/slug/${slug}`);
    return data;
  } catch (error) {
    console.error(`Error fetching image with slug ${slug}:`, error);
    throw error;
  }
};
