import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className="
        px-5 py-2
        rounded-xl
        bg-white/10
        border border-white/20
        backdrop-blur-md
        text-white
        font-medium
        transition
        hover:bg-white/20
        hover:cursor-pointer
        active:scale-[0.98]
      "
        >
            {children}
        </button>
    );
};