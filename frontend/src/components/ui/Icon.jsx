import clsx from "clsx";

export default function Icon({ name, className }) {
  return (
    <svg className={clsx("w-6 h-6", className)} aria-hidden="true">
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
