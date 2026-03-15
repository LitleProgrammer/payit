import React from "react";

interface CardProps {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
    return (
        <div
            className="
      p-6
      rounded-2xl
      bg-white/5
      border border-white/10
      backdrop-blur-xl
      shadow-lg
    "
        >
            {children}
        </div>
    );
};