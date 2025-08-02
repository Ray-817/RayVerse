import clsx from "clsx";
import FeedbackForm from "@components/ui/FeedbackForm";
import ButtonMy from "@components/ui/ButtonMy";
import { useTranslation } from "react-i18next";
import { useDownloadResume } from "@hooks/useDownload";
import FadeInOnScroll from "@components/layout/FadeInOnScroll";

function Contact() {
  const { t } = useTranslation();
  const { handleDownload, loading } = useDownloadResume();

  const sectionClasses = clsx(
    "py-26 md:py-30 lg:py-34 mb-26 md:mb-30 lg:mb-34 scroll-offset",
    "flex flex-col justify-between items-center gap-100",
    "sm:flex-row sm:gap-30"
  );

  return (
    <FadeInOnScroll>
      <section className={sectionClasses} id="contact">
        <FeedbackForm />
        <div className="flex flex-col font-semibold justify-between items-center">
          <div className="sm:mr-50">
            <h3 className="text-6xl mb-8 md:text-5xl">{t("thank1")}</h3>
            <h3 className="text-6xl  md:text-5xl">{t("thank2")}</h3>
          </div>
          <div className="mt-15 sm:mr-54">
            <ButtonMy
              label={t("myResume")}
              onClick={handleDownload}
              disabled={loading}
            />
          </div>
        </div>
      </section>
    </FadeInOnScroll>
  );
}

export default Contact;
