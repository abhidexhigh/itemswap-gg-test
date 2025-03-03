import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoLanguage, IoGlobeOutline, IoMdArrowDropdown } from "react-icons/io5"; // Globe icon
import { MdOutlineArrowDropDown } from "react-icons/md";
import "../../i18n";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setSelectedLanguage(lang);
    setShowMenu(false); // Close the menu after selection
  };

  useEffect(() => {
    const currentLang = localStorage.getItem("language");
    if (currentLang) {
      i18n.changeLanguage(currentLang);
      setSelectedLanguage(currentLang);
    }
  }, [i18n]);

  // const languages = {
  //   en: "English",
  //   ko: "한국어 (Korean)",
  //   "zh-CN": "中文 (Simplified Chinese)",
  //   ja: "日本語 (Japanese)",
  //   vi: "Tiếng Việt (Vietnamese)",
  //   es: "Español (Spanish)",
  //   ru: "Русский (Russian)",
  // };

  const languages = {
    en: "English",
    ko: "한국어",
    "zh-CN": "中文",
    ja: "日本語",
    vi: "Tiếng Việt",
    es: "Español",
    ru: "Русский",
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="text-[28px] p-2 flex items-center"
      >
        <IoGlobeOutline className="text-[24px] mr-2" />{" "}
        <div className="font-[sans-serif] capitalize !font-extrabold">
          {languages[selectedLanguage]}
        </div>{" "}
        <MdOutlineArrowDropDown className="!text-[18px]" />
      </button>
      {showMenu && (
        <div className="absolute right-0 w-72 mt-2 bg-gray-900 shadow-lg border rounded-md z-10">
          <ul>
            {Object.entries(languages).map(([code, name]) => (
              <li
                key={code}
                className={`px-4 py-2 hover:bg-gray-800 cursor-pointer ${selectedLanguage === code ? "bg-blue-500 text-white" : ""}`}
                onClick={() => changeLanguage(code)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
