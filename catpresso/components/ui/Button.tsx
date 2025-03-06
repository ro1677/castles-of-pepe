import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="px-4 py-2 bg-orangeAccent text-white rounded-md hover:bg-orange-700 transition"
      {...props}
    >
      {children}
    </button>
  );
};

