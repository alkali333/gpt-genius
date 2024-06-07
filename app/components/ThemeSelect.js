"use client";
import React, { useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

const themes = {
  light: { name: "cupcake", icon: BsMoonFill },
  dark: { name: "synthwave", icon: BsSunFill },
};

const ThemeSelect = () => {
  const [themeType, setThemeType] = useState("light");

  const toggleTheme = () => {
    const newThemeType = themeType === "light" ? "dark" : "light";
    document.documentElement.setAttribute(
      "data-theme",
      themes[newThemeType].name
    );
    setThemeType(newThemeType);
  };

  const IconComponent = themes[themeType].icon;

  return (
    <button className="btn btn-sm btn-outline" onClick={toggleTheme}>
      <IconComponent className="h-4 w-4" />
    </button>
  );
};

export default ThemeSelect;
