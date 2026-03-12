import React from "react";

interface CheckboxProps {
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    label,
    checked,
    onChange,
}) => {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer sr-only"
                />

                <div
                    className="
          w-5 h-5
          rounded-md
          border border-white/20
          bg-white/5
          backdrop-blur-md
          peer-checked:bg-blue-500
          peer-checked:border-blue-400
          transition
        "
                />
            </div>

            {label && <span className="text-gray-300 text-sm">{label}</span>}
        </label>
    );
};