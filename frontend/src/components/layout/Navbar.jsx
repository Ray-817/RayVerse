import clsx from "clsx";
import { useState, useEffect } from "react";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";
import NavLinks from "@components/ui/NavLinks";

function Navbar() {
  // State to manage the open/close state of the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  // Control the body overflow when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Function to toggle the mobile menu open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle resume link click
  const getResumeLink = () => {
    console.log("Resume link clicked");
  };

  // Navbar styles
  const navClasses = clsx(
    "flex justify-between items-center",
    "py-4 px-10",
    "sticky top-0 z-100",
    "bg-background-light",
    "border-b border-gray-200"
  );

  // Toggle layer styles for the mobile menu
  const toggleLayerClasses = clsx(
    "fixed inset-0 bg-white bg-opacity-50 z-40 transition-opacity duration-200",
    isOpen ? "opacity-50 visible" : "opacity-0 invisible"
  );

  const mobileMenuClasses = clsx(
    "fixed top-0 left-0 h-full bg-white bg-opacity-50 shadow-lg z-50",
    "transform transition-transform duration-300 ease-in-out",
    "w-[60%]",
    isOpen ? "translate-x-0" : "-translate-x-full",
    "p-auto"
  );

  // Links container styles for bigger screens
  const linkDesktopContainerClasses = clsx(
    "gap-12",
    "items-center justify-between"
  );

  // // Links container styles for mobile screens
  const linkMobileContainerClasses = clsx(
    "flex flex-col items-center justify-center text-center",
    "gap-[8vh]",
    "w-full h-full"
  );

  // Navbar's Links styles
  const linkDesktopClasses = clsx("cursor: pointer;", "interactive-scale");

  const linkMobileClasses = clsx("text-6xl", "interactive-scale");

  // SVG icon styles
  const svgClasses = clsx(
    "w-25 h-25",
    "interactive-scale",

    {
      "rotate-90": isOpen,
    }
  );

  return (
    <nav className={navClasses}>
      {/* Mobile navigation links */}
      <div className="z-60 md:hidden">
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className=""
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls="mobile-menu"
        >
          <Icon name={isOpen ? "close" : "menu"} className={svgClasses} />
        </button>
      </div>

      {/* Toggle layer for mobile menu that will appear when the menu is opened*/}
      <div className={toggleLayerClasses} onClick={toggleMenu}></div>

      {/* Mobile menu */}
      <div className={mobileMenuClasses}>
        <div className={linkMobileContainerClasses}>
          <NavLinks linkClassName={linkMobileClasses} onClick={toggleMenu} />
        </div>
      </div>

      {/* Desktop navigation links */}
      <div className={clsx("hidden", "md:flex", linkDesktopContainerClasses)}>
        <NavLinks linkClassName={linkDesktopClasses} />
      </div>

      <Button label="resume" onClick={getResumeLink} />
    </nav>
  );
}

export default Navbar;
