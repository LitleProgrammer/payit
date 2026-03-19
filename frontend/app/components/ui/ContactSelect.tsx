import { useMemo, useState } from "react";
import { ContactCard } from "./ContactCard";

interface Contact {
    _id: string;
    username: string;
}

interface Props {
    contacts: Contact[];
    onSelect: (contact: Contact) => void;
}

export function ContactSelect({ contacts = [], onSelect }: Props) {
    const [search, setSearch] = useState("");

    const filteredContacts = useMemo(() => {
        return contacts
            .sort((a, b) => a.username.localeCompare(b.username))
            .filter((c) =>
                c.username.toLowerCase().includes(search.toLowerCase())
            );
    }, [contacts, search]);

    return (
        <div className="flex flex-col gap-3 w-full">

            {/* Search */}
            <input
                placeholder="Search contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                w-full
                px-4 py-2
                rounded-xl
                bg-white/5
                border border-white/10
                backdrop-blur-md
                text-white
                placeholder-gray-400
                outline-none
                transition
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-500/40
                "
            />

            {/* Contact List */}
            <div
                className="
                flex flex-col
                max-h-64
                overflow-y-auto
                rounded-xl
                border border-white/10
                bg-white/5
                backdrop-blur-md
                "
            >
                {filteredContacts.map((contact) => (
                    <ContactCard
                        key={contact._id}
                        contact={contact}
                        onClick={onSelect}
                    />
                ))}

                {filteredContacts.length === 0 && (
                    <div className="p-3 text-sm text-gray-400">
                        No contacts found
                    </div>
                )}
            </div>
        </div>
    );
}