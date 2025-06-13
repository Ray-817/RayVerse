import { useTranslation } from "react-i18next";

function NavLinks({ linkClassName, onClick }) {
  const { t } = useTranslation();

  return (
    <>
      <a href="#stack" className={linkClassName} onClick={onClick}>
        {t("tech")}
      </a>
      <a href="#why" className={linkClassName} onClick={onClick}>
        {t("why")}
      </a>
      <a href="#takes" className={linkClassName} onClick={onClick}>
        {t("takes")}
      </a>
      <a href="#gallery" className={linkClassName} onClick={onClick}>
        {t("hobby")}
      </a>
      <a href="#contact" className={linkClassName} onClick={onClick}>
        {t("contact")}
      </a>
    </>
  );
}

export default NavLinks;
