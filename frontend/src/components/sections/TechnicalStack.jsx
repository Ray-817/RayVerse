/* eslint-disable react/self-closing-comp */
import clsx from "clsx";
import Icon from "@components/ui/Icon";
import { useTranslation } from "react-i18next";
import FadeInOnScroll from "@components/layout/FadeInOnScroll";

function TechnicalStack() {
  const { t } = useTranslation();

  const sectionClasses = clsx(
    "flex flex-col items-center py-26 md:py-30 lg:py-34 mb-26 md:mb-30 lg:mb-34 scroll-offset"
  );

  const containerClasses = clsx(
    "flex flex-col gap-y-30 items-center justify-between gap-x-50",
    "sm:flex-row sm:space-x-8 lg:space-x-12",
    "w-[60vw] px-4",
    "my-36"
  );

  const cardClasses = clsx(
    "flex flex-col items-center bg-background-dark rounded-3xl p-6 md:p-8",
    "w-full max-w-md md:max-w-md",
    "shadow-xs mb-8 sm:mb-0"
  );

  const iconContainerClasses = clsx(
    "grid grid-cols-2 grid-rows-3 gap-y-15 gap-x-20",
    "justify-items-center",
    "px-10 py-5"
  );

  const logoClasses = clsx("w-25 h-25 fill-logo", "logo-hover-effect");

  const titleClasses = clsx("whitespace-nowrap mb-6", "text-6xl md:text-5xl");

  return (
    <FadeInOnScroll>
      <section className={sectionClasses} id="stack">
        <h2>{t("tech")}</h2>
        <div className={containerClasses}>
          <div className={cardClasses}>
            <span className={titleClasses}>{t("my_stack")}</span>
            <div className={iconContainerClasses}>
              <div title="React.js">
                <Icon name="react" className={logoClasses}></Icon>
              </div>

              <div title="Node.js">
                <Icon name="nodejs" className={logoClasses}></Icon>
              </div>

              <div title="MongoDB">
                <Icon name="mongodb" className={logoClasses}></Icon>
              </div>

              <div title="Tailwind CSS">
                <Icon name="tailwind" className={logoClasses}></Icon>
              </div>

              <div title="Cloudflare">
                <Icon name="cloudflare" className={logoClasses}></Icon>
              </div>

              <Icon name="ellipsis" className={logoClasses}></Icon>
            </div>
          </div>

          <div className={cardClasses}>
            <span className={titleClasses}>{t("to_learn")}</span>
            <div className={iconContainerClasses}>
              <div title="Vue.js">
                <Icon name="vue" className={logoClasses}></Icon>
              </div>

              <div title="TypeScript">
                <Icon name="typescript" className={logoClasses}></Icon>
              </div>

              <div title="Laravel(PHP)">
                <Icon name="laravel" className={logoClasses}></Icon>
              </div>

              <div title="Golang">
                <Icon name="go" className={logoClasses}></Icon>
              </div>

              <div title="Docker">
                <Icon name="docker" className={logoClasses}></Icon>
              </div>

              <Icon name="ellipsis" className={logoClasses}></Icon>
            </div>
          </div>
        </div>
      </section>
    </FadeInOnScroll>
  );
}

export default TechnicalStack;
