interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
}

export function Textarea({ label, ...props }: Props) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm text-gray-300">{label}</label>}

            <textarea
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
        resize-none
        "
            />
        </div>
    )
}