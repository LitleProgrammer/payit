import React, { useEffect, useState } from 'react'
import { Plus } from '~/components/icons/Plus';
import { Button } from '~/components/ui/Button';
import { ContactSelect } from '~/components/ui/ContactSelect';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import ProtectedRoute from '~/components/ui/ProtectedRoute'
import { createShadowUser, getShadowUsers } from '~/lib/api';

export interface Contact {
    _id: string
    username: string
}

export default function Dashboard() {
    const [selectUserModalOpen, setSelectUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        console.log("Whatb");

        async function fetchContacts() {
            console.log("starting to get contacts");

            const res = await getShadowUsers();

            console.log("Contacts:", res);

            if (res.data) {
                setContacts(res.data);
            }
        }

        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            console.log(selectedUser);

        }
    }, [selectedUser]);

    return (
        <ProtectedRoute>
            <div className='w-full h-full flex flex-col items-center'>
                <div className='bg-cyan-200 h-1/12 w-full'>

                </div>
                <div className='-amber-600 h-10/12 w-full'>

                </div>
                <div className='h-1/12 w-full flex flex-col justify-center items-center border-t-2 border-white/10 -fuchsia-600'>
                    <div className=''>
                        <button className='px-3 py-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white align-super text-6xl transition hover:bg-white/20 active:scale-[0.98]' onClick={() => setSelectUserModalOpen(true)}><Plus size={70} color='#ffffff' /></button>
                    </div>
                </div>
            </div>
            <Modal open={selectUserModalOpen} onClose={() => setSelectUserModalOpen(false)}>
                <div className='flex flex-col gap-4'>
                    <ContactSelect contacts={contacts} onSelect={(user) => { setSelectedUser(user._id); setSelectUserModalOpen(false); }} />
                </div>
            </Modal>
        </ProtectedRoute>
    )
}