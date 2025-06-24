import clsx from "clsx";
function Contact() {
  const sectionClasses = clsx(
    "py-26 md:py-30 lg:py-34 mb-26 md:mb-30 lg:mb-34 scroll-offset",
    "flex flex-col justify-between items-center",
    "sm: flex-row"
  );

  return <section className={sectionClasses} id="contact" />;
}

export default Contact;
