/* eslint-disable react/button-has-type */
import clsx from "clsx";

function ButtonMy({
  label,
  onClick,
  variant = "primary-my",
  icon = null,
  className,
}) {
  // Define base style classes for button
  const baseClasses = clsx(
    "inline-flex items-center justify-center",
    "px-6 py-4",
    "rounded-full",
    "font-semibold",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "text-transform: uppercase",
    "interactive-scale"
  );
  // Define variant class for button
  const variantClasses = clsx({
    // Resume & Submit button styles
    "bg-primary-my": variant === "primary-my",
    // Like button style
    "bg-background-light": variant === "secondary",
  });
  // Define sytle classes for icon and label
  const iconClasses = clsx("border-primary-my", "border-0.5");
  const labelClasses = clsx("text-6xl", "md:text-4xl", "mx-2 my-3");

  return (
    <button
      className={clsx(baseClasses, variantClasses, className)}
      onClick={onClick}
    >
      {/* If icon is provided, render it, Otherwise, render the label*/}
      {icon && <span className={iconClasses}>{icon}</span>}
      <span className={labelClasses}>{label}</span>
    </button>
  );
}

export default ButtonMy;
