import clsx from "clsx";
import Combobox from "@components/ui/ComoboBox";

function MyTakes() {
  const sectionClasses = clsx(
    "py-26 ml-[16vw] md:py-30 lg:py-34 mb-26 md:mb-30 lg:mb-34 ",
    "scroll-offset"
  );

  const titleContainerClasses = clsx("flex");

  return (
    <section className={sectionClasses} id="takes">
      <div className={titleContainerClasses}>
        <h2 className="text-left">My Takes on</h2>
        <Combobox />
      </div>
    </section>
  );
}

export default MyTakes;
