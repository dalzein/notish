import React, { useEffect, useRef, useState } from "react";
import IconButton from "../IconButton/IconButton";
import styles from "./UtilityDropdown.module.css";

export default function UtilityDropdown({
  icon,
  name,
  width,
  children,
  setDropdownMenuStatus,
}) {
  const dropdownRef = useRef(null);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);

  useEffect(() => {
    const handleWindowClick = (e) => {
      if (dropdownRef.current?.contains(e.target)) return;

      setDropdownMenuStatus && setDropdownMenuStatus(name, false);
      setShowDropdownMenu(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => window.removeEventListener("click", handleWindowClick);
  }, [name, setDropdownMenuStatus]);

  const handleClick = () => {
    setDropdownMenuStatus && setDropdownMenuStatus(name, !showDropdownMenu);
    setShowDropdownMenu((previousValue) => !previousValue);
  };

  return (
    <div ref={dropdownRef}>
      <IconButton icon={icon} onClick={handleClick} />
      <div
        className={`${styles.dropdownMenu} ${
          showDropdownMenu ? styles.show : ""
        }`}
        style={{ width: width || "inherit" }}
      >
        {children}
      </div>
    </div>
  );
}
