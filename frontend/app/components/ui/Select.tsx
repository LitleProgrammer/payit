interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
}

export function Select({ label, ...props }: SelectProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-gray-300">{label}</label>}

            <select
                {...props}
                className="
        px-4 py-2
        rounded-xl
        bg-white/5
        border border-white/10
        backdrop-blur-md
        text-white
        outline-none
        focus:ring-2
        focus:ring-blue-500/40
        "
            />
        </div>
    )
}