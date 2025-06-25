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
    <footer className={clsx("my-4", "border-t border-gray-200")}>
      <div className={iconContainerClasses}>
        <a
          href="https://github.com/Ray-817"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Icon name="github" className={iconClasses} />
        </a>

        <a
          href="https://www.linkedin.com/in/rayjiang728"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Icon name="linkedin" className={iconClasses} />
        </a>

        <a href="mailto:jiangzerui728@gmail.com" aria-label="Email">
          <Icon name="mail" className={iconClasses} />
        </a>
      </div>
      <p className={textClasses}>
        &copy; {new Date().getFullYear()} RayVerse. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
