import { Avatar } from "./Avatar";
import { useNavigate } from "react-router";

interface Props {
    contacts: Contact[];
    selectedContactId?: string;
    onSelect?: (contact: Contact) => void;
}

type Contact = {
    _id: string;
    username: string;
};

export function ContactAvatarList({
    contacts,
    selectedContactId,
    onSelect
}: Props) {
    const navigate = useNavigate();

    function handleClick(contact: Contact) {
        if (onSelect) {
            onSelect(contact);
        } else {
            navigate(`/debts/${contact._id}`);
        }
    }

    return (
        <div
            className="
                flex gap-x-10 overflow-x-scroll
                px-3
                rounded-2xl
                scrollbar-hide
            "
        >
            {contacts.map((contact) => {
                const isSelected = contact._id === selectedContactId;

                return (
                    <div
                        key={contact._id}
                        onClick={() => handleClick(contact)}
                        className="
                            flex flex-col items-center
                            cursor-pointer min-w-[72px]
                            group
                        "
                    >
                        {/* Avatar wrapper */}
                        <div
                            className={`
                                p-[3px] rounded-full transition
                                ${isSelected
                                    ? "border-2 border-blue-400 shadow-md shadow-blue-500/30"
                                    : "border-2 border-transparent group-hover:border-white/20"
                                }
                            `}
                        >
                            <div className="w-24 h-24">
                                <Avatar username={contact.username} size={24} fontSize={"text-4xl"} />
                            </div>
                        </div>

                        {/* Username */}
                        <span
                            className="
                                mt-1 text-sm text-gray-300
                                max-w-[72px]
                                truncate text-center
                                group-hover:text-white
                                transition
                            "
                        >
                            {contact.username}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}