/* eslint-disable indent */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
import clsx from "clsx";
import React, { useState, useEffect, useCallback } from "react";
import * as imageServices from "@services/imageService";
import { useAlert } from "@hooks/useAlert";
import Icon from "./Icon";
import { useTranslation } from "react-i18next";
import { ModalPortal } from "@components/layout/ModalPortal";

function ImageList() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingLargeImage, setLoadingLargeImage] = useState(false);
  const [largeImageError, setLargeImageError] = useState(null);
  const [modalImageSlug, setModalImageSlug] = useState(null);
  const [initialFetchError, setInitialFetchError] = useState(null);

  useEffect(() => {
    const fetchAllThumbnails = async () => {
      setLoading(true);
      setInitialFetchError(null);
      try {
        const data = await imageServices.getAllThumbnails();
        setImages(data);
      } catch (err) {
        const title = t("failFetchImages");
        const message = t("checkNetworkMessage");
        console.error("Error fetching thumbnails:", err);
        setInitialFetchError(t("failFetchImages"));
        showAlert("destructive", title, message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllThumbnails();
  }, [showAlert, t]);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [selectedImage]);

  const fetchAndSetModalImage = useCallback(
    async (slug) => {
      if (!slug) return;
      setLoadingLargeImage(true);
      setLargeImageError(null);
      try {
        const fullImageData = await imageServices.getSingleImageBySlug(slug);
        const img = new Image();
        img.src = fullImageData.imageUrl;
        img.onload = () => {
          setSelectedImage(fullImageData);
          setLoadingLargeImage(false);
        };
        img.onerror = () => {
          console.error("Error loading full image:", fullImageData.imageUrl);
          setLargeImageError(t("failLoadFullImage"));
          showAlert(
            "destructive",
            t("failLoadFullImage"),
            t("imageLoadErrorMessage")
          );
          setLoadingLargeImage(false);
          setModalImageSlug(null);
          setSelectedImage(null);
        };
      } catch (err) {
        console.error("Error fetching large image details via API:", err);
        setLargeImageError(t("failGetImages"));
        showAlert("destructive", t("failLoadImage"), t("checkNetworkMessage"));
        setLoadingLargeImage(false);
        setModalImageSlug(null);
        setSelectedImage(null);
      }
    },
    [showAlert, t]
  );

  useEffect(() => {
    if (modalImageSlug) {
      fetchAndSetModalImage(modalImageSlug);
    } else {
      setSelectedImage(null);
      setLoadingLargeImage(false);
      setLargeImageError(null);
    }
  }, [modalImageSlug, fetchAndSetModalImage]);

  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
    setModalImageSlug(image.slug);
  }, []);

  const closeModal = useCallback(() => {
    setModalImageSlug(null);
  }, []);

  const imageGalleryWidthClass = "w-[70vw]";
  const imageGridClasses = clsx(
    `grid ${imageGalleryWidthClass} gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
  );
  const parentMargin = initialFetchError ? "my-20" : "my-40";
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
      <ModalPortal
        isOpen={!!selectedImage}
        onClose={closeModal}
        isLoading={loadingLargeImage}
        type="image"
      >
        {selectedImage && !loadingLargeImage && (
          <img
            src={selectedImage.imageUrl || selectedImage.thumbnailUrl}
            alt={selectedImage.description || selectedImage.title}
            className="max-w-[90vw] max-h-[85vh] object-contain mx-auto block z-60"
          />
        )}
      </ModalPortal>
    </div>
  );
}

export default ImageList;
