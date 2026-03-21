import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Avatar } from '~/components/ui/Avatar';
import { Button } from '~/components/ui/Button';
import { CurrencyInput } from '~/components/ui/CurrencyInput';
import { GlassPanel } from '~/components/ui/GlassPanel';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import ProtectedRoute from '~/components/ui/ProtectedRoute';
import { getUserDebts, getShadowUser } from '~/lib/api';

export interface Debt {
    _id?: string;
    amount: number;
    description: string;
    createdAt: Date;
    debtor: string;
    owner: string;
    currency: string;
    settled: boolean;
    settledAt?: Date;
}

export interface Contact {
    _id: string
    username: string
}

type Currency = "EUR" | "USD" | "GBP" | "CHF";

const debts = () => {
    const { userID } = useParams();

    if (!userID) {
        return (
            <div>
                <p>Keine ID gefunden</p>
            </div>
        )
    }

    const id = userID;

    const [debts, setDebts] = useState<Debt[]>([]);
    const [user, setUser] = useState<Contact | null>(null);
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
    const [editDebtModalOpen, setEditDebtModalOpen] = useState(false);
    const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userID) return;

        async function fetchData() {
            const debtsRes = await getUserDebts(id);
            if (debtsRes.data) {
                console.log(debtsRes.data);

                setDebts(debtsRes.data);
            }

            const userRes = await getShadowUser(id);
            if (userRes.data) {
                setUser(userRes.data);
            }
        }

        fetchData();
    }, [id]);

    function getCurrencySymbol(currency: string | undefined) {
        if (!currency) return "";
        switch (currency) {
            case "EUR":
                return "€";
            case "USD":
                return "$";
            case "GBP":
                return "£";
            default:
                return currency;
        }
    }

    function handleDebtClick(debtID: string | undefined) {
        if (!debtID) return;
        const debt = debts.find((debt) => debt._id === debtID);
        if (debt) {
            setSelectedDebt(debt);
            setEditDebtModalOpen(true);
        }
    }

    return (
        <ProtectedRoute>
            <div className='p-3'>
                <div className='p-2'>
                    <p onClick={() => { navigate('/dashboard') }} className='hover:underline hover:cursor-pointer'>← Zurück</p>
                </div>
                <div className='flex flex-col'>
                    <GlassPanel>
                        {user && (
                            <div className='flex items-center w-full'>
                                <div className='flex items-center'>
                                    <Avatar username={user.username} size={17} fontSize='text-2xl' />
                                    <p className='ml-4 text-2xl font-bold'>{user.username}</p>
                                </div>
                                <p className='text-2xl text-red-500 ml-auto'>-204,94€</p>
                            </div>
                        )}
                    </GlassPanel>
                </div>
                <div className='mt-3'>
                    <h2 className='text-2xl font-bold py-2'>Schulden:</h2>
                    <GlassPanel>
                        <div className='flex flex-col gap-4 divide-y divide-white/10'>
                            {debts.map((debt) => (
                                <div key={debt._id} className='flex items-center w-full pb-4 transition-all duration-150 hover:cursor-pointer hover:scale-[1.005]' onClick={() => handleDebtClick(debt._id)}>
                                    <div className='flex flex-col items-start'>
                                        <p className='ml-4 text-md font-bold'>Grund: {debt.description}</p>
                                        <p className='ml-4 text-md font-bold'>Bezahlt: {debt.settled ? "✅" : "❌"}</p>
                                    </div>
                                    <p className='text-2xl text-red-500 ml-auto'>-{debt.amount}{getCurrencySymbol(debt.currency)}</p>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>
            </div>
            <Modal open={editDebtModalOpen} onClose={() => setEditDebtModalOpen(false)}>
                <h2 className='text-2xl font-bold py-2'>Bearbeiten</h2>
                <Input label='Grund' value={selectedDebt?.description} />
                <CurrencyInput
                    label='Betrag'
                    value={selectedDebt?.amount ?? null}
                    onChange={() => { }}
                    currency={(selectedDebt?.currency as Currency) ?? "EUR"}
                    onCurrencyChange={() => { }}
                />
                <div className='w-full flex justify-center gap-x-4 mt-3'>
                    <Button onClick={() => setEditDebtModalOpen(false)}>Speichern</Button>
                    <Button onClick={() => { setEditDebtModalOpen(false); setDeleteConfirmModalOpen(true) }}>Löschen</Button>
                </div>
            </Modal>
            <Modal open={deleteConfirmModalOpen} onClose={() => setDeleteConfirmModalOpen(false)}>
                <h2 className='text-2xl font-bold py-2'>Löschen</h2>
                <div className=''>
                    <p>Wirklich löschen?</p>
                    <div className='w-full flex justify-center gap-x-4 mt-3'>
                        <Button onClick={() => setDeleteConfirmModalOpen(false)}>Ja</Button>
                        <Button onClick={() => setDeleteConfirmModalOpen(false)}>Nein</Button>
                    </div>
                </div>
            </Modal>
        </ProtectedRoute >
    )
}

export default debts