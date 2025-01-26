import React from "react";

interface ButtonProps {
  btnType: "submit" | "reset" | "button" | undefined;
  title: string;
  handleClick?: React.MouseEventHandler<HTMLButtonElement>;
  styles: string;
}

const CustomButton = ({ btnType, title, handleClick, styles }: ButtonProps) => {
  return (
    <button
      type={btnType}
      className={`cursor-pointer rounded-[10px] px-4 py-1 font-epilogue text-[16px] font-semibold leading-[24px] text-white ${styles}`}
      onClick={handleClick}
      style={{ height: "40px" }}
    >
      {title}
    </button>
  );
};

export default CustomButton;
