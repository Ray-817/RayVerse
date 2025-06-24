// src/components/VideoCarousel.jsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@components/ui/card"; // 假设您有这些 UI 组件
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel"; // shadcn/ui Carousel

import { fetchVideos } from "@services/videoService";

export function VideoCarousel() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const data = await fetchVideos(); // 调用封装好的 fetchVideos 函数
        setVideos(data);
      } catch (err) {
        setError("Failed to load videos. Please try again later.");
        console.error("Error in VideoCarousel:", err);
      } finally {
        setLoading(false);
      }
    };

    getVideos();
  }, []); // 空数组表示只在组件挂载时运行一次

  if (loading) {
    return <div className="text-center py-8">Loading videos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (videos.length === 0) {
    return <div className="text-center py-8">No videos available.</div>;
  }

  return (
    <div className="container mx-auto py-20 sm:py-40">
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
    </div>
  );
}
