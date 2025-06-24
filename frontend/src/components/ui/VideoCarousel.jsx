// src/components/VideoCarousel.jsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import Icon from "./Icon";

import { useAlert } from "@hooks/useAlert";

import { fetchVideos } from "@services/videoService";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

export function VideoCarousel() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  useEffect(() => {
    const getVideos = async () => {
      try {
        const data = await fetchVideos(); // 调用封装好的 fetchVideos 函数
        setVideos(data);
      } catch (err) {
        const title = t("failFetchVideos");
        const message = t("checkNetworkMessage");
        setError(title);
        console.error("Error in VideoCarousel:", err);
        showAlert("destructive", title, message);
      } finally {
        setLoading(false);
      }
    };

    getVideos();
  }, [showAlert, t]); // 空数组表示只在组件挂载时运行一次

  const errorMessageContainerWidthClass = "w-[80vw] sm:w-[40vw]";

  const loadingContainerClasses = clsx(
    "w-[50vw] h-[30vw] mt-30 flex items-center justify-center mx-auto"
  );
  return (
    <div className="container mx-auto py-20 sm:py-40">
      {loading ? (
        <div className={loadingContainerClasses}>
          <Icon
            name="loader"
            className="w-30 h-30 my-10 mx-auto animate-spin opacity-50"
          />
        </div>
      ) : error && videos.length === 0 ? (
        // 将这个 div 的宽度独立设置，不再影响 imageGridClasses
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
              {t("failFetchVideos")}
            </p>
            <p className="text-3xl px-5 mt-5 md:text-4xl">
              {t("checkNetworkMessage")}
            </p>
          </div>
        </div>
      ) : (
        <Carousel className="w-full max-w-[75vw] sm:max-w-[75vw] mx-auto">
          <CarouselContent>
            {videos.videos.map((video) => (
              <CarouselItem key={video.id}>
                <div className="p-1">
                  <Card className=" bg-transparent shadow-none border-none">
                    <CardContent className="flex flex-col aspect-video items-center justify-center p-6">
                      <video
                        src={video.videoUrl} // 使用后端提供的预签名 URL
                        poster={video.posterUrl} // 使用后端提供的预签名 URL
                        controls
                        className="object-contain bg-background-dark rounded-lg"
                        preload="metadata" // 建议使用 metadata 或 auto
                      >
                        Your Browser Doesn&apos;t Support Video Player!
                      </video>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="w-20 h-20 cursor-pointer" />
          <CarouselNext className="w-20 h-20 cursor-pointer" />
        </Carousel>
      )}
    </div>
  );
}
