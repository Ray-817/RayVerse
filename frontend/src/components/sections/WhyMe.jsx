/* eslint-disable react/self-closing-comp */
import avatar from "../../assets/avatar.jpg";
import clsx from "clsx";
import AbilityChart from "@components/ui/AbilityChart";
import { useTranslation } from "react-i18next";
import FadeInOnScroll from "@components/layout/FadeInOnScroll";

function WhyMe() {
  const { t } = useTranslation();

  // birthday of Ray is 2002 Augest 17th=>(7,17)
  const age =
    new Date().getFullYear() -
    2002 -
    (new Date() < new Date(new Date().getFullYear(), 7, 17) ? 1 : 0);

  const sectionClasses =
    "py-26 md:py-30 lg:py-34 mb-26 md:mb-30 lg:mb-34 scroll-offset";

  const containerClasses = clsx(
    "flex flex-col items-center justify-between gap-y-30",
    "my-30 mx-30",
    "md:grid md:grid-cols-3 md:grid-rows-2 md:gap-8 md:my-5"
  );

  const infoClasses = clsx(
    "flex flex-col items-center justify-between gap-y-6"
  );
  const avatarContainerClasses = clsx("w-85 h-85 rounded-full overflow-hidden");

  const introClasses = clsx(
    "rounded-3xl border-2 border-background-dark px-15 py-10",
    "text-5xl leading-[1.7] text-justify indent-10",
    "shadow-xs",
    "md:col-span-2 md:leading-[1.6] md:text-4xl"
  );

  const chartClasses = clsx(
    "mt-8 w-[60vw] h-[60vw] max-w-[300px] max-h-[300px]",
    "md:w-45[vw]  md:h-45[vw] md:max-w-[700px] md:max-h-[550px] md:mt-0",
    "md:col-span-3 md:justify-self-center"
  );

  return (
    <FadeInOnScroll>
      <section className={sectionClasses} id="why">
        <h2>{t("why")}</h2>

        <div className={containerClasses}>
          <div className={infoClasses}>
            <div className={avatarContainerClasses}>
              <img
                src={avatar}
                alt="Ray Jiang"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mt-2">
              <span className="block text-6xl mb-5">Ray Jiang</span>
              <span className="block text-5xl">{age}</span>
            </div>
          </div>

          <div className={introClasses}>
            <p>{t("intro")}</p>
          </div>

          <div className={chartClasses}>
            <AbilityChart />
          </div>
        </div>
      </section>
    </FadeInOnScroll>
  );
}

export default WhyMe;
