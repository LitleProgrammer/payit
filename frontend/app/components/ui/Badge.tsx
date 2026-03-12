interface Props {
    children: React.ReactNode
}

export function Badge({ children }: Props) {
    return (
        <span
            className="
      px-3 py-1
      text-xs
      rounded-full
      bg-white/10
      border border-white/20
      backdrop-blur-md
      "
        >
            {children}
        </span>
    )
}