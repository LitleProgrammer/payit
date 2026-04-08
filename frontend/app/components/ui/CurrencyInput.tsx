import React, { useEffect, useMemo, useState } from "react";

type Currency = "EUR" | "USD" | "GBP" | "CHF";

const CURRENCIES: { code: Currency; symbol: string }[] = [
    { code: "EUR", symbol: "€" },
    { code: "USD", symbol: "$" },
    { code: "GBP", symbol: "£" },
    { code: "CHF", symbol: "CHF" },
];

interface CurrencyInputProps {
    label?: string;

    value: number | null;
    onChange: (value: number | null) => void;

    currency: Currency;
    onCurrencyChange: (currency: Currency) => void;

    locale?: string;

    min?: number;
    max?: number;

    placeholder?: string;
    disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
    label,
    value,
    onChange,
    currency,
    onCurrencyChange,
    locale = "de-DE",
    min,
    max,
    placeholder,
    disabled,
}) => {
    const [display, setDisplay] = useState("");
    const [open, setOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const formatter = useMemo(() => {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [locale, currency]);

    const symbol = useMemo(() => {
        return (
            CURRENCIES.find((c) => c.code === currency)?.symbol || currency
        );
    }, [currency]);

    // Sync external value → display
    useEffect(() => {
        if (isFocused) return;

        if (value === null || value === undefined) {
            setDisplay("");
        } else {
            setDisplay(formatter.format(value));
        }
    }, [value, formatter, isFocused]);

    const handleBlur = () => {
        setIsFocused(false);

        if (value === null) {
            setDisplay("");
            return;
        }

        setDisplay(formatter.format(value));
    };

    // STRICT parsing (max 2 decimals)
    const parse = (input: string): number | null => {
        if (!input) return null;

        const cleaned = input
            .replace(/[^\d,.-]/g, "")
            .replace(",", ".");

        // enforce only 1 dot
        const parts = cleaned.split(".");
        if (parts.length > 2) return null;

        // enforce 2 decimals max
        if (parts[1] && parts[1].length > 2) return null;

        const num = parseFloat(cleaned);

        if (isNaN(num)) return null;

        return num;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        // Prevent invalid typing early
        const validPattern = /^-?\d*(?:[.,]\d{0,2})?$/;

        if (!validPattern.test(raw.replace(/[^\d,.-]/g, ""))) {
            return;
        }

        setDisplay(raw);

        const parsed = parse(raw);

        if (parsed === null) {
            onChange(null);
            return;
        }

        let finalValue = parsed;

        if (min !== undefined && finalValue < min) finalValue = min;
        if (max !== undefined && finalValue > max) finalValue = max;

        onChange(finalValue);
    };

    return (
        <div className="flex flex-col gap-1 w-full relative">
            {label && (
                <label className="text-sm text-gray-300">{label}</label>
            )}

            <div className="relative flex items-center">
                {/* Currency Selector */}
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault(); // 🔥 prevents input blur
                        setOpen((prev) => !prev);
                    }}
                    className="
                    absolute left-2 z-20
                    px-2 py-1
                    rounded-lg rounded-r-none
                    border-r-2 border-white/10
                    text-sm
                    text-gray-300
                    hover:bg-white/10
                    transition
                    "
                >
                    {symbol}
                </button>

                {/* Dropdown */}
                {open && (
                    <div
                        className="
                            absolute top-full left-0 mt-1
                            bg-[#1a1a1a]
                            border border-white/10
                            rounded-xl
                            shadow-lg
                            z-10
                            overflow-hidden
                        "
                    >
                        {CURRENCIES.map((c) => (
                            <button
                                key={c.code}
                                onClick={() => {
                                    onCurrencyChange(c.code);
                                    setOpen(false);
                                }}
                                className="
                                    w-full text-left px-4 py-2
                                    hover:bg-white/10
                                    text-white text-sm
                                "
                            >
                                {c.symbol} {c.code}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <input
                    value={display}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    inputMode="decimal"
                    className="
                        w-full
                        pl-12 pr-4 py-2
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
                        relative z-10
                    "
                />
            </div>
        </div>
    );
};