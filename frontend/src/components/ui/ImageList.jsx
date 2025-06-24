/* eslint-disable indent */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import clsx from "clsx";
import React, { useState, useEffect, useCallback } from "react";
import * as imageServices from "@services/imageService";
import { useAlert } from "@hooks/useAlert";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";

function ImageList() {
  const [images, setImages] = useState([]);
  // const [selectedImage, setSelectedImage] = useState(null); // 移除这里直接控制modal的state
  const [loading, setLoading] = useState(true);
  // const [loadingLargeImage, setLoadingLargeImage] = useState(false); // 模态框内部的加载状态
  // const [error, setError] = useState(null); // 用于整体列表错误处理
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  // ***** 模态框相关状态 *****
  const [selectedImage, setSelectedImage] = useState(null); // 存储模态框内要显示的图片数据 (初始为缩略图，成功后为完整图)
  const [loadingLargeImage, setLoadingLargeImage] = useState(false); // 控制模态框内部的加载状态
  const [largeImageError, setLargeImageError] = useState(null); // 模态框内部的图片加载错误 (虽然最终会关闭modal)
  const [modalImageSlug, setModalImageSlug] = useState(null); // 控制模态框内容异步加载的触发器
  const [initialFetchError, setInitialFetchError] = useState(null); // 用于初始缩略图列表的错误

  useEffect(() => {
    const fetchAllThumbnails = async () => {
      setLoading(true);
      setInitialFetchError(null); // 重置初始加载错误
      try {
        const data = await imageServices.getAllThumbnails();
        setImages(data);
      } catch (err) {
        const title = t("failFetchImages");
        const message = t("checkNetworkMessage");
        console.error("Error fetching thumbnails:", err);
        setInitialFetchError(t("failFetchImages")); // 设置初始加载错误信息
        showAlert("destructive", title, message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllThumbnails();
  }, [showAlert, t]); // 依赖项中添加 showAlert 和 t

  // ***** 模态框相关：控制 body 滚动条和 padding *****
  useEffect(() => {
    if (selectedImage) {
      // 只要 selectedImage 有值 (模态框打开)
      document.body.style.overflow = "hidden";
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      // selectedImage 为 null (模态框关闭)
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [selectedImage]);

  // ***** 新增 useEffect 钩子：负责根据 modalImageSlug 加载大图内容 *****
  const fetchAndSetModalImage = useCallback(
    async (slug) => {
      if (!slug) return;

      setLoadingLargeImage(true); // 立即设置为加载状态，在模态框内部显示加载器
      setLargeImageError(null); // 清除旧的错误信息

      try {
        // 1. 调用 services 获取大图详情（包含 imageUrl）
        const fullImageData = await imageServices.getSingleImageBySlug(slug);

        // 2. 创建 Image 对象来预加载图片，检查图片文件是否能加载
        const img = new Image();
        img.src = fullImageData.imageUrl;

        // 3. 监听 Image 对象的加载成功事件
        img.onload = () => {
          setSelectedImage(fullImageData); // 图片文件加载成功，更新为完整图片数据
          setLoadingLargeImage(false); // 停止加载
        };

        // 4. 监听 Image 对象的加载失败事件
        img.onerror = () => {
          console.error("Error loading full image:", fullImageData.imageUrl);
          setLargeImageError(t("failLoadFullImage")); // 设置错误状态（虽然最终会关闭）
          showAlert(
            "destructive",
            t("failLoadFullImage"),
            t("imageLoadErrorMessage")
          ); // 弹出提示
          setLoadingLargeImage(false); // 停止加载
          setModalImageSlug(null); // 关闭模态框（通过清空 slug）
          setSelectedImage(null); // 清空 selectedImage，确保模态框关闭
        };
      } catch (err) {
        // 5. 如果 imageServices.getSingleImageBySlug API 调用本身失败
        console.error("Error fetching large image details via API:", err);
        setLargeImageError(t("failGetImages")); // 设置错误状态（虽然最终会关闭）
        showAlert("destructive", t("failLoadImage"), t("checkNetworkMessage")); // 弹出提示
        setLoadingLargeImage(false); // 停止加载
        setModalImageSlug(null); // 关闭模态框
        setSelectedImage(null); // 清空 selectedImage，确保模态框关闭
      }
    },
    [showAlert, t]
  );

  useEffect(() => {
    if (modalImageSlug) {
      fetchAndSetModalImage(modalImageSlug);
    } else {
      // 如果 modalImageSlug 为 null (模态框被关闭)，重置相关状态
      setSelectedImage(null);
      setLoadingLargeImage(false);
      setLargeImageError(null);
    }
  }, [modalImageSlug, fetchAndSetModalImage]);

  // ***** handleImageClick 现在只负责设置 modalImageSlug *****
  const handleImageClick = useCallback((image) => {
    // 1. 立即设置 selectedImage 为点击的缩略图数据
    // 这会立即打开模态框，并显示缩略图作为占位符（如果你的 image 对象包含 thumbnailUrl）
    setSelectedImage(image);
    // 2. 设置 modalImageSlug 来触发 useEffect 异步加载大图
    setModalImageSlug(image.slug);
    // loadingLargeImage 会在 fetchAndSetModalImage 中被设置为 true
  }, []);

  // 关闭模态框
  const closeModal = useCallback(() => {
    setModalImageSlug(null);
  }, []);

  const imageGalleryWidthClass = "w-[70vw]";
  const imageGridClasses = clsx(
    `grid ${imageGalleryWidthClass} gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  );

  const parentMargin = initialFetchError ? "my-20" : "my-40"; // 使用 initialFetchError
  const containerClasses = clsx(`mx-auto ${parentMargin}`);

  const loadingContainerClasses = clsx(
    "w-[50vw] h-[30vw] mt-30 flex items-center justify-center mx-auto"
  );

  const errorMessageContainerWidthClass = "w-[80vw] sm:w-[40vw]";

  return (
    <div className={containerClasses}>
      {loading ? (
        <div className={loadingContainerClasses}>
          <Icon
            name="loader"
            className="w-30 h-30 my-10 mx-auto animate-spin opacity-50"
          />
        </div>
      ) : initialFetchError && images.length === 0 ? (
        <div
          className={clsx(
            "flex flex-col rounded-lg text-center mt-30",
            errorMessageContainerWidthClass,
            "mx-auto"
          )}
        >
          <Icon name="refresh" className="w-30 h-30 my-5 mx-auto " />
          <div className="flex flex-col items-center mb-20">
            <p className="text-5xl font-medium px-5 md:text-6xl ">
              {t("failFetchImages")}
            </p>
            <p className="text-3xl px-5 mt-5 md:text-4xl">
              {t("checkNetworkMessage")}
            </p>
          </div>
        </div>
      ) : (
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

      {/* 模态框渲染条件：只有当 selectedImage 有值时才渲染 */}
      {selectedImage && ( // 只要 selectedImage 有值，模态框就会被渲染
        <div
          className="fixed bg-gray-200/50 inset-0 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="imgContainer" onClick={(e) => e.stopPropagation()}>
            {loadingLargeImage ? (
              // 如果正在加载大图，显示加载动画
              <div className="w-[80vw] h-[30vh] flex items-center justify-center text-xl sm:w-[50vw] sm:h-[70vh]">
                <Icon name="loader" className="w-40 h-40 animate-spin" />
              </div>
            ) : (
              // 加载结束后，显示图片。如果加载失败，selectedImage 会被设为 null，模态框会关闭
              // 所以这里不需要再处理 error 状态
              <img
                src={selectedImage.imageUrl || selectedImage.thumbnailUrl} // 优先使用 imageUrl (完整图)，如果还没有则用 thumbnailUrl (点击时传进来的缩略图)
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
              <Icon name="close" className="w-20 h-20" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageList;
