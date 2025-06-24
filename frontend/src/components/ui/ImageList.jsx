/* eslint-disable indent */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import * as imageServices from "@services/imageService";
import { useAlert } from "@hooks/useAlert";
import Icon from "./Icon";

function ImageList() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLargeImage, setLoadingLargeImage] = useState(false);
  const [error, setError] = useState(null); // 用于错误处理
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchAllThumbnails = async () => {
      setLoading(true);
      setError(null);
      try {
        // 调用 services 中的函数
        const data = await imageServices.getAllThumbnails();
        setImages(data);
      } catch (err) {
        setError("Failed to load images. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllThumbnails();
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      // 优化：计算滚动条宽度并添加 padding-right，避免内容跳动
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        // 仅当有滚动条时才添加 padding
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = ""; // 清除 padding
    }

    // 清理函数
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [selectedImage]); // 只依赖 selectedArticle

  const handleImageClick = async (image) => {
    setSelectedImage(image);
    setLoadingLargeImage(true);
    setError(null);

    try {
      // 调用 services 中的函数，通过 slug 获取
      const fullImageData = await imageServices.getSingleImageBySlug(
        image.slug
      );

      const img = new Image();
      img.src = fullImageData.imageUrl;

      img.onload = () => {
        setSelectedImage(fullImageData);
        setLoadingLargeImage(false);
      };
      img.onerror = () => {
        console.error("Error loading large image:", fullImageData.imageUrl);
        setError("Failed to load full image.");
        setLoadingLargeImage(false);
      };
    } catch (err) {
      console.error("Error fetching large image details:", err);
      setError("Failed to load full image details.");
      showAlert(
        "destructive",
        `⛔Failed to get the Picture!`,
        "Please check your network and try again!"
      );
      setLoadingLargeImage(false);
    }
  };

  const closeModal = () => {
    setSelectedImage(null); // 清空选中图片，隐藏模态框
    setError(null); // 关闭模态框时也清除错误信息
  };

  // 关键改动：
  // 1. 移除 grid-rows-X，让行高由内容决定 (implicit rows)
  // 2. 保持 grid-cols-X 来控制列数和宽度
  // 3. 将 parentHeightClass 或 containerWidthClass 应用到 .imageGridClasses
  const imageGalleryWidthClass = "w-[70vw]"; // 默认宽度
  // 如果你需要响应式调整画廊宽度，可以在这里添加，例如：
  // const imageGalleryWidthClass = "w-[90vw] md:w-[70vw] lg:w-[60vw]";

  const imageGridClasses = clsx(
    `grid ${imageGalleryWidthClass} gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  );

  const parentMargin = error ? "my-20" : "my-40";
  const containerClasses = clsx(`mx-auto ${parentMargin}`);

  const loadingContainerClasses = clsx(
    "w-[50vw] h-[30vw] mt-30 flex items-center justify-center mx-auto"
  );

  // 为错误信息容器定义独立的宽度，如果需要的话
  const errorMessageContainerWidthClass = "w-[80vw] sm:w-[40vw]"; // 你之前错误状态的宽度

  return (
    <div className={containerClasses}>
      {loading ? (
        <div className={loadingContainerClasses}>
          <Icon
            name="loader"
            className="w-30 h-30 my-10 mx-auto animate-spin opacity-50"
          />
        </div>
      ) : error && images.length === 0 ? (
        // 将这个 div 的宽度独立设置，不再影响 imageGridClasses
        <div
          className={clsx(
            "flex flex-col rounded-lg text-center mt-30",
            errorMessageContainerWidthClass,
            "mx-auto"
          )}
        >
          {" "}
          {/* 居中错误信息容器 */}
          <Icon name="refresh" className="w-30 h-30 my-5 mx-auto " />
          <div className="flex flex-col items-center mb-20">
            <p className="text-5xl font-medium px-5 md:text-6xl ">
              We can&apos;t get any Images!
            </p>
            <p className="text-3xl px-5 mt-5 md:text-4xl">
              Please check your network and refresh again!
            </p>
          </div>
        </div>
      ) : (
        // 这里的 imageGridClasses 始终使用 imageGalleryWidthClass 定义的宽度
        <div className={imageGridClasses}>
          {images.map((image) => (
            <div
              key={image.id}
              className="w-full aspect-square cursor-pointer group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => handleImageClick(image)}
            >
              <img
                src={image.thumbnailUrl}
                alt={image.description}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold text-center px-2">
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedImage && (
        <div
          className="fixed bg-gray-200/50 inset-0 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="imgContainer" onClick={(e) => e.stopPropagation()}>
            {loadingLargeImage ? (
              <div className="w-[80vw] h-[30vh] flex items-center justify-center text-xl sm:w-[50vw] sm:h-[70vh]">
                {" "}
                {/* 调整这里：移除 opacity-30，使用深色背景 */}
                <Icon name="loader" className="w-40 h-40 animate-spin" />
              </div>
            ) : error ? (
              // 大图加载失败显示错误信息
              <div className="w-[80vw] h-[30vh] flex flex-col items-center justify-center text-4xl p-4 sm:w-[50vw] sm:h-[70vh] bg-gray-200">
                {" "}
                <Icon name="alert-tri" className="w-16 h-16 mb-4" />
                <span>{error} Please try again.</span>
              </div>
            ) : (
              // 大图加载成功后显示
              <img
                src={selectedImage.imageUrl} // 显示高清图片
                alt={selectedImage.description || selectedImage.title}
                className="max-w-[90vw] max-h-[85vh] object-contain mx-auto block pt-20 z-60"
              />
            )}

            {/* 关闭按钮 */}
            <button
              onClick={closeModal}
              className="absolute top-[9%] right-2 sm:top-[13%] sm:right-2 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
              aria-label="Close"
            >
              <Icon name="close" className="w-20 h-20" />{" "}
              {/* 使用你的 Icon 组件，并设置颜色和大小 */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageList;
