import React, { useState } from "react";
import IconButton from "../IconButton/IconButton";
import "./UtilityDropdown.css";

function UtilityDropdown(props) {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);

  function handleClick(e) {
    e.stopPropagation();
    props.setDropdownMenuStatus &&
      props.setDropdownMenuStatus(props.name, !showDropdownMenu);
    setShowDropdownMenu((previousValue) => !previousValue);
  }

  function handleBlur(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;

    props.setDropdownMenuStatus &&
      props.setDropdownMenuStatus(props.name, false);
    setShowDropdownMenu(false);
  }

  return (
    <div onBlur={handleBlur}>
      <IconButton icon={props.icon} onClick={handleClick} />
      <div className={`dropdown-menu ${showDropdownMenu ? "show" : ""}`}>
        {props.children}
      </div>
    </div>
  );
}

export default UtilityDropdown;
