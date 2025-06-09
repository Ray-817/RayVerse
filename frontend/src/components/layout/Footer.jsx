import Icon from "@components/ui/Icon";
import clsx from "clsx";

function Footer() {
  const iconContainerClasses = clsx(
    "flex",
    "gap-12",
    "items-center",
    "justify-center",
    "mb-8",
    "mt-12"
  );
  const iconClasses = clsx("w-15", "h-15", "text-logo", "cursor-pointer");
  const textClasses = clsx("text-small", "text-light-text", "text-center");
  return (
    <footer className={clsx("my-4", "border-t border-gray-300")}>
      <div className={iconContainerClasses}>
        <Icon name="github" className={iconClasses} />
        <Icon name="linkedin" className={iconClasses} />
        <Icon name="mail" className={iconClasses} />
      </div>
      <p className={textClasses}>
        &copy; {new Date().getFullYear()} RayVerse. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
