import { useTranslation } from "react-i18next";
import ImageList from "@components/ui/ImageList";
import { VideoCarousel } from "@components/ui/VideoCarousel";

function HobbiesGallery() {
  const { t } = useTranslation();

  const sectionClasses =
    "flex flex-col items-center justify-center py-26 md:py-30 lg:py-34 mb-26 md:mb-30 lg:mb-34 scroll-offset";
  return (
    <section className={sectionClasses} id="gallery">
      <h2>{t("hobby")}</h2>
      <ImageList />
      <VideoCarousel />
    </section>
  );
}

export default HobbiesGallery;
