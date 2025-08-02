import clsx from "clsx";

export default function Icon({ name, className }) {
  return (
    <svg className={clsx(className)} aria-hidden="true">
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
