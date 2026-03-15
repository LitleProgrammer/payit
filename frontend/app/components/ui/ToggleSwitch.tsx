import React from "react";

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (value: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    enabled,
    onChange,
}) => {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={`
        w-12 h-6
        flex items-center
        rounded-full
        p-1
        transition
        backdrop-blur-md
        border
        ${enabled ? "bg-blue-500 border-blue-400" : "bg-white/10 border-white/20"}
      `}
        >
            <div
                className={`
          w-4 h-4
          rounded-full
          bg-white
          transition-transform
          ${enabled ? "translate-x-6" : ""}
        `}
            />
        </button>
    );
};