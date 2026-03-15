interface Props {
    open: boolean
    children: React.ReactNode
}

export function Modal({ open, children }: Props) {
    if (!open) return null

    return (
        <div
            className="
      fixed inset-0
      flex items-center justify-center
      bg-black/50
      backdrop-blur-sm
      "
        >
            <div
                className="
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        rounded-2xl
        p-6
        min-w-[320px]
        "
            >
                {children}
            </div>
        </div>
    )
}