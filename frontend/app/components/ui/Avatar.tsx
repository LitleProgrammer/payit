
export function Avatar({ username, size = 8, fontSize = "text-sm" }: { username: string, size?: number, fontSize?: string }) {
    function getInitials() {
        if (!username) {
            return "";
        }

        const initials = username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

        return initials;
    }

    return (
        <div
            className={`
            rounded-full
            bg-blue-500/30
            border border-blue-400/40
            flex items-center justify-center
            ${fontSize}
            font-semibold
            text-white
            `}
            style={{ width: size * 4, height: size * 4 }}
        >
            {getInitials()}
        </div>
    );
}