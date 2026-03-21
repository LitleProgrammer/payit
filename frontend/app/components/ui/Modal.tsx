interface Props {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Modal({ open, onClose, children }: Props) {
    if (!open) return null;

    return (
        <div
            className="
            fixed inset-0
            flex items-center justify-center
            bg-black/50
            backdrop-blur-sm
            "
            onClick={onClose}
        >
            <div
                className="
                bg-white/5
                border border-white/10
                backdrop-blur-xl
                rounded-2xl
                p-6
                w-full
                max-w-md
                "
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}