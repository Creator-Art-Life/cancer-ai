import { CustomButton } from ".";
import { menu, search, sun } from "../assets";
import { useEffect, useState } from "react";
import { IconHeartHandshake } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { navlinks } from "../constants";
import { ModeLanguage } from "@/i18n/ModeLanguage";
import AuthComponent from "@/utils/AuthComponent";
import { useTranslation } from "react-i18next";
import { Icon } from "./Sidebar";

function Navbar() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { authenticated, handleLoginLogout } = AuthComponent();
  const { t } = useTranslation();

  return (
    <div className="mb-[35px] flex flex-col-reverse justify-between gap-6 md:flex-row">
      <div className="flex h-[52px] max-w-[458px] flex-row rounded-[100px] bg-[#1c1c24] py-2 pl-4 pr-2 lg:flex-1">
        <input
          type="text"
          placeholder="Search for records"
          className="flex w-full bg-transparent font-epilogue text-[14px] font-normal text-white outline-none placeholder:text-[#4b5264]"
        />
        <div className="flex h-full w-[72px] cursor-pointer items-center justify-center rounded-[20px] bg-[#4acd8d]">
          <img
            src={search}
            alt="search"
            className="h-[15px] w-[15px] object-contain"
          />
        </div>
      </div>

      <div className="hidden flex-row justify-end gap-2 sm:flex">
        <ModeLanguage />
        {!authenticated ? (
          <CustomButton
            btnType="button"
            title={authenticated ? "Log Out" : "Log In"}
            styles={authenticated ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
            handleClick={handleLoginLogout}
          />
        ) : (
          <Link to="/profile">
            <button className="cursor-pointer px-4 py-2 bg-[#8c6dfd] text-white rounded-md hover:bg-[#1dc071]">
              <p className="font-semibold">{t("Profile")}</p>
            </button>
          </Link>
        )}
      </div>

      <div className="relative flex items-center justify-between sm:hidden">
        <div className="flex h-[40px] w-full cursor-pointer items-center justify-start gap-2">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#2c2f32]">
            <IconHeartHandshake size={40} color="#1ec070" className="p-2" />
          </div>
          <div className="flex h-[40px] w-[45px] items-center justify-center rounded-[10px] bg-[#2c2f32]">
            <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
          </div>
        </div>
        <img
          src={menu}
          alt="menu"
          className="h-[34px] w-[34px] cursor-pointer object-contain"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />
        <div
          className={` rounded-xl absolute left-0 right-0 top-[60px] z-10 bg-[#1c1c24] py-4 shadow-secondary ${
            !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4 ">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${
                  isActive === link.name && "bg-[#3a3a43]"
                }`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img
                  src={link.imgUrl}
                  alt={link.name}
                  className={`h-[24px] w-[24px] object-contain ${
                    isActive === link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue text-[14px] font-semibold ${
                    isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {link.name}
                </p>
              </li>
            ))}
            <li
              key={"Login"}
              className={`flex p-4 `}
              // onClick={() => {
              //   setIsActive(link.name);
              //   setToggleDrawer(false);
              //   navigate(link.link);
              // }}
            >
              <CustomButton
                btnType="button"
                title={authenticated ? "Log Out" : "Log In"}
                styles={authenticated ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
                handleClick={handleLoginLogout}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const IconTheme = ({
  styles,
  imgUrl,
}: {
  styles: string;
  imgUrl: string;
}) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    try {
      localStorage.setItem("theme", newTheme);
      console.log("Theme saved to localStorage:", newTheme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }

    document.documentElement.setAttribute("vite-ui-theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("vite-ui-theme", savedTheme);
    console.log("Initial theme set from localStorage:", savedTheme);
  }, []);

  return (
    <div
      className={`h-[48px] w-[48px] rounded-[10px] flex items-center justify-center ${styles}`}
      onClick={toggleTheme}
    >
      <img src={imgUrl} alt="theme-icon" className="h-6 w-6" />
    </div>
  );
};

export default Navbar;
