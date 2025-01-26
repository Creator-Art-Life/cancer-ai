import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const ModeLanguage = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        className="cursor-pointer inline-flex justify-center items-center w-full rounded-md border border-[#2c2f32] bg-[#1c1c24] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#2c2f32]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {i18n.language === "en" ? "English" : "Русский"}
        <Languages className="w-4 h-4 ml-1" />
      </button>

      {isOpen && (
        <div
          className=" origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1c1c24] ring-1 ring-[#2c2f32] ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1">
            <button
              onClick={() => changeLanguage("en")}
              className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2c2f32] focus:outline-none focus:ring-1 focus:ring-[#1dc071]"
              role="menuitem"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("ru")}
              className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2c2f32] focus:outline-none focus:ring-1 focus:ring-[#1dc071]"
              role="menuitem"
            >
              Русский
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
