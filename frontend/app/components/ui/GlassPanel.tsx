interface Props {
    children: React.ReactNode
}

export function GlassPanel({ children }: Props) {
    return (
        <div
            className="
      bg-white/5
      border border-white/10
      backdrop-blur-xl
      rounded-2xl
      shadow-xl
      p-6
      overflow-y-auto
      "
        >
            {children}
        </div>
    )
}