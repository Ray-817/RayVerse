function NavLinks({ linkClassName, onClick }) {
  return (
    <>
      <a href="#stack" className={linkClassName} onClick={onClick}>
        Technical Stack
      </a>
      <a href="#why" className={linkClassName} onClick={onClick}>
        Why Me
      </a>
      <a href="#takes" className={linkClassName} onClick={onClick}>
        My Takes
      </a>
      <a href="#gallery" className={linkClassName} onClick={onClick}>
        Hobbies Gallery
      </a>
      <a href="#contact" className={linkClassName} onClick={onClick}>
        Contact
      </a>
    </>
  );
}

export default NavLinks;
