type Props = {
    size?: number;
    color?: string;
};

export function Plus({ size = 24, color = "black" }: Props) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
                d="M6 12H18M12 6V18"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}