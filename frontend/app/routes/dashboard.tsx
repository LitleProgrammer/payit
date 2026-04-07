import React, { useEffect, useState } from 'react'
import { Plus } from '~/components/icons/Plus';
import { Button } from '~/components/ui/Button';
import { ContactAvatarList } from '~/components/ui/ContactAvatarList';
import { ContactCard } from '~/components/ui/ContactCard';
import { ContactSelect } from '~/components/ui/ContactSelect';
import { CurrencyInput } from '~/components/ui/CurrencyInput';
import { GlassPanel } from '~/components/ui/GlassPanel';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import ProtectedRoute from '~/components/ui/ProtectedRoute'
import { createShadowUser, getShadowUsers, createDebt, getUserConnections } from '~/lib/api';
import { useNavigate } from 'react-router';

export interface Contact {
    _id: string
    username: string
}

type Currency = "EUR" | "USD" | "GBP" | "CHF";

export interface Debt {
    _id: string;
    owner: string;
    debtor: string;
    amount: number;
    currency: string;
    createdAt: string;
    description?: string;
}

export interface CreateDebtResponse {
    debtId: string;
    updatedDebts: Debt[];
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [selectUserModalOpen, setSelectUserModalOpen] = useState(false);
    const [createDebtModalOpen, setCreateDebtModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [shadowUserName, setShadowUserName] = useState<string | null>(null);

    const [debtAmount, setDebtAmount] = useState<number | null>(null);
    const [currency, setCurrency] = useState<Currency>("EUR");
    const [debtDescription, setDebtDescription] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContacts() {
            const res = await getShadowUsers();

            if (res.data) {
                setContacts(res.data);
            }

            const userRes = await getUserConnections();
            if (userRes.data) {
                setContacts(prev => [...prev, ...(userRes.data ?? [])]);
            }
        }

        fetchContacts();
    }, []);

    async function handleCreateShadowUser() {
        if (shadowUserName) {
            const createRes = await createShadowUser(shadowUserName);
            if (createRes.data && createRes.data.updatedShadowUsers) {
                setContacts(createRes.data.updatedShadowUsers);

                const userRes = await getUserConnections();
                if (userRes.data) {
                    setContacts(prev => [...prev, ...(userRes.data ?? [])]);
                }
            }
        }
    }

    async function handleCreateDebt() {
        try {
            // --- basic validation ---
            if (!selectedUser || !debtAmount || !currency) {
                console.error("Missing fields");
                return;
            }

            if (isNaN(debtAmount) || debtAmount <= 0) {
                console.error("Invalid amount");
                return;
            }

            // --- API call ---
            const res = await createDebt({
                debtor: selectedUser,
                amount: debtAmount,
                currency,
                description: debtDescription || undefined
            });

            if (res.error) {
                console.error(res.error);
                return;
            }

            if (res.data) {
                //setDebts(res.data.updatedDebts);

                // optional: reset form
                setDebtAmount(null);
                setDebtDescription("");
                setSelectedUser(""); // only if you want to reset selection
            }

        } catch (err) {
            console.error("Failed to create debt", err);
        }
    }

    return (
        <ProtectedRoute>
            <div className='w-full h-full flex flex-col items-center'>
                <div className='-amber-600 h-11/12 w-full'>
                    <div className='h-2/6 p-3'>
                        <GlassPanel>
                            <p className='text-right mb-1 hover:underline transition-all duration-700 hover:cursor-pointer' onClick={() => navigate("/contacts")}>Alle Kontakte →</p>
                            <ContactAvatarList contacts={contacts.slice(0, 8)} />
                        </GlassPanel>
                    </div>
                </div>
                <div className='h-1/12 w-full flex flex-col justify-center items-center border-t-2 border-white/10 -fuchsia-600'>
                    <div className=''>
                        <button className='px-3 py-0 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white align-super text-6xl transition hover:bg-white/20 active:scale-[0.98]' onClick={() => setSelectUserModalOpen(true)}><Plus size={70} color='#ffffff' /></button>
                    </div>
                </div>
            </div>



            <Modal open={selectUserModalOpen} onClose={() => setSelectUserModalOpen(false)}>
                <div className='flex flex-col gap-4'>
                    <ContactSelect contacts={contacts} onSelect={(user) => { setSelectedUser(user._id); setSelectUserModalOpen(false); setCreateDebtModalOpen(true); }} />
                    <Input label='Neuer Nutzer' onChange={(e) => setShadowUserName(e.target.value)} />
                    <Button onClick={handleCreateShadowUser}>Erstellen</Button>
                </div>
            </Modal>
            <Modal open={createDebtModalOpen} onClose={() => setCreateDebtModalOpen(false)}>
                <div className='flex flex-col gap-4'>
                    <ContactCard contact={contacts.find(c => c._id === selectedUser)!} selected label='Nutzer' onClick={() => { setCreateDebtModalOpen(false); setSelectUserModalOpen(true); }} />
                    <CurrencyInput label='Amount' value={debtAmount} onChange={setDebtAmount} currency={currency} onCurrencyChange={setCurrency} />
                    <Input label='Description' onChange={(e) => setDebtDescription(e.target.value)} />
                    <Button onClick={() => { setCreateDebtModalOpen(false); handleCreateDebt(); }}>Erstellen</Button>
                </div>
            </Modal>
        </ProtectedRoute>
    )
}