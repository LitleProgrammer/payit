import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm text-gray-300">{label}</label>
            )}

            <input
                {...props}
                className="
        w-full
        px-4 py-2
        rounded-xl
        bg-white/5
        border border-white/10
        backdrop-blur-md
        text-white
        placeholder-gray-400
        outline-none
        transition
        focus:border-blue-400
        focus:ring-2
        focus:ring-blue-500/40
      "
            />
        </div>
    );
};