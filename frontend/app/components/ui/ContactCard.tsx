import React from "react";
import { Avatar } from "./Avatar";

interface Contact {
    _id: string;
    username: string;
}

interface ContactCardProps {
    contact: Contact;

    label?: string;

    onClick?: (contact: Contact) => void;
    selected?: boolean;
    disabled?: boolean;

    rightContent?: React.ReactNode; // future-proof (e.g. buttons, badges)
}

export const ContactCard: React.FC<ContactCardProps> = ({
    contact,
    label,
    onClick,
    selected,
    disabled,
    rightContent,
}) => {
    const isClickable = !!onClick && !disabled;

    const Wrapper = isClickable ? "button" : "div";

    return (
        <div>
            {label && <label className="text-sm text-gray-300">{label}</label>}
            <Wrapper
                onClick={isClickable ? () => onClick(contact) : undefined}
                className={`
            w-full
            flex items-center justify-between gap-3
            px-4 py-2
            text-left
            transition
            rounded-xl
            
            ${isClickable ? "hover:bg-white/10 cursor-pointer" : ""}
            ${selected ? "bg-white/10 border border-white/20" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            >
                {/* Left */}
                <div className="flex items-center gap-3">
                    <Avatar username={contact.username} />
                    <span className="text-white">{contact.username}</span>
                </div>

                {/* Right (optional slot) */}
                {rightContent && (
                    <div className="flex items-center gap-2">
                        {rightContent}
                    </div>
                )}
            </Wrapper>
        </div>
    );
};