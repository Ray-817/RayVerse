import clsx from "clsx";

function Hero() {
  const heroClasses = clsx(
    "relative w-full h-[90vh] bg-no-repeat",
    "md:bg-[url(/src/assets/bgDesktop.svg)] bg-left",
    "md:bg-[length:70%_auto] md: bg-[position:center_30%] md:h-[60vh]",
    "lg:h-[75vh]",
    "pb-26 md:pb-30 lg:pb-34 mb-26 md:mb-30 lg:mb-34"
  );

  const patternClasses = clsx(
    "relative w-full h-[90vh] bg-background-light",
    "overflow-hidden"
  );
  const circleSmallClasses = clsx(
    "absolute w-150 h-150 rounded-full bg-primary opacity-100"
  );

  const circleBigClasses = clsx(
    "absolute w-300 h-300 rounded-full bg-primary opacity-100"
  );

  const triangleClasses = clsx(
    "absolute bg-primary opacity-100",
    "w-[100%] h-[40%]"
  );

  const textContainerClasses = clsx(
    "absolute top-1/2 right-0 transform -translate-y-1/2",
    "sm:top-1/2 right-0 transform -translate-y-[60%]",
    "pr-8 md:pr-16 lg:pr-24",
    "md:mt-10",
    "flex flex-col items-end text-left",
    "w-full sm:w-2/3 lg:w-2/3 xl:w-2/3"
  );

  const boldTextClasses = clsx(
    "text-[7vh] sm:text-[8vh] md:text-[9vh] lg:text-[15vh] font-semibold leading-tight"
  );
  const thinTextClasses = clsx(
    "text-[8vh] sm:text-[9vh] md:text-[10vh] lg:text-[16vh] font-thin leading-tight"
  );

  return (
    <section className={heroClasses}>
      <div className={clsx(patternClasses, "sm:hidden")}>
        <div
          className={circleSmallClasses}
          style={{ top: "-9%", left: "-20%" }}
        />

        <div
          className={triangleClasses}
          style={{
            clipPath: "polygon(0 25%, 0% 60%, 55% 0%)",
            top: "50%",
            left: "0%",
          }}
        />

        <div
          className={circleBigClasses}
          style={{
            top: "70%",
            left: "40%",
          }}
        />
      </div>

      <div className={textContainerClasses}>
        <span className={boldTextClasses}>Welcome</span>
        <span className={thinTextClasses}>to RAY&apos;s</span>
        <span className={boldTextClasses}>World</span>
      </div>
    </section>
  );
}

export default Hero;
