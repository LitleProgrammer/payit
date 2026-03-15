export function Avatar({ username }: { username: string }) {
    const initials = username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div
            className="
            w-8 h-8
            rounded-full
            bg-blue-500/30
            border border-blue-400/40
            flex items-center justify-center
            text-sm
            font-semibold
            text-white
            "
        >
            {initials}
        </div>
    );
}