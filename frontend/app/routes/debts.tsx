import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Avatar } from '~/components/ui/Avatar';
import { Button } from '~/components/ui/Button';
import { ContactSelect } from '~/components/ui/ContactSelect';
import { CurrencyInput } from '~/components/ui/CurrencyInput';
import { Divider } from '~/components/ui/Divider';
import { GlassPanel } from '~/components/ui/GlassPanel';
import { Input } from '~/components/ui/Input';
import { Modal } from '~/components/ui/Modal';
import ProtectedRoute from '~/components/ui/ProtectedRoute';
import { getUserDebts, getShadowUsers, editDebt, deleteDebt, payAny, paySpecific, getAmountOwed, getAnyoneById, linkShadowUser, getDebtsIOwe, getBalance } from '~/lib/api';

export interface Debt {
    _id?: string;
    amount: number;
    description: string;
    createdAt: Date;
    debtor: string;
    owner: string;
    currency: string;
    paid: boolean;
    remaining: number;
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

    const [debtsTheyOwe, setDebtsTheyOwe] = useState<Debt[]>([]);
    const [debtsIOwe, setDebtsIOwe] = useState<Debt[]>([]);
    const [user, setUser] = useState<Contact | null>(null);
    const [owedAmount, setOwedAmount] = useState<number | null>(null);

    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
    const [editDebtModalOpen, setEditDebtModalOpen] = useState(false);

    const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);

    const [subtractModalOpen, setSubtractModalOpen] = useState(false);
    const [subtractAmount, setSubtractAmount] = useState<number | null>(null);

    const [linkShadowModalOpen, setLinkShadowModalOpen] = useState(false);
    const [shadowUsers, setShadowUsers] = useState<Contact[]>([]);
    const [selectedLinkShadowUser, setSelectedLinkShadowUser] = useState<Contact | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userID) return;

        async function fetchData() {
            const debtsRes = await getUserDebts(id);
            if (debtsRes.data) {
                setDebtsTheyOwe(debtsRes.data);
            }

            const myDebtsRes = await getDebtsIOwe(id);
            if (myDebtsRes.data) {
                setDebtsIOwe(myDebtsRes.data);
            }

            const userRes = await getAnyoneById(id);
            if (userRes.data) {
                setUser(userRes.data);
            }

            const owedRes = await getBalance(id);
            if (owedRes.data) {
                setOwedAmount(Math.round(owedRes.data.balance * 100) / 100);
            }

            const shadowUsersRes = await getShadowUsers();
            if (shadowUsersRes.data) {
                setShadowUsers(shadowUsersRes.data);
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
        const debt = debtsTheyOwe.find((debt) => debt._id === debtID);
        if (debt) {
            setSelectedDebt(debt);
            setEditDebtModalOpen(true);
        }
    }

    async function handleEditDebt() {
        if (selectedDebt) {
            const res = await editDebt(selectedDebt);
            if (res.data) {
                setDebtsTheyOwe(res.data);
            }

            setSelectedDebt(null);
            setEditDebtModalOpen(false);
        }
    }

    async function handleDeleteDebt() {
        if (selectedDebt) {
            if (!selectedDebt._id) return;

            const res = await deleteDebt(selectedDebt._id);

            if (res.data) {
                setDebtsTheyOwe(res.data);
            }

            setSelectedDebt(null);
            setDeleteConfirmModalOpen(false);
        }
    }

    async function handleSubtract() {
        if (subtractAmount) {
            const res = await payAny({
                to: id,
                amount: subtractAmount,
                currency: "EUR"
            });

            if (res.data) {
                setDebtsTheyOwe(res.data.updatedDebts);
            }

            setSelectedDebt(null);
            setSubtractAmount(null);
            setSubtractModalOpen(false);
        }
    }

    async function handleSubtractSpecific() {
        if (subtractAmount && selectedDebt && selectedDebt._id) {
            const res = await paySpecific({
                amount: subtractAmount,
                currency: "EUR"
            }, selectedDebt._id);

            if (res.data) {
                setDebtsTheyOwe(res.data.updatedDebts);
            }

            setSelectedDebt(null);
            setSubtractAmount(null);
            setEditDebtModalOpen(false);
        }
    }

    async function handleLinkShadow() {
        if (selectedLinkShadowUser && selectedLinkShadowUser._id && user && user._id) {
            const res = await linkShadowUser(selectedLinkShadowUser._id, user._id);
            if (res.data) {
                setSelectedLinkShadowUser(null);
                setLinkShadowModalOpen(false);
                navigate(0);
            }
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
                            <div>
                                <div className='flex items-center w-full'>
                                    <div className='flex items-center'>
                                        <Avatar username={user.username} size={17} fontSize='text-2xl' />
                                        <p className='ml-4 text-2xl font-bold'>{user.username}</p>
                                    </div>
                                    <p className='text-2xl ml-auto' style={{ color: owedAmount !== null && owedAmount < 0 ? '#fc1303' : '#00c711' }}>{owedAmount ? owedAmount.toFixed(2) : "0.00"}{getCurrencySymbol("EUR")}</p>
                                </div>
                                <div className='w-full flex justify-center pt-2'>
                                    <Button onClick={() => setLinkShadowModalOpen(true)} >Link Shadow</Button>
                                </div>
                            </div>
                        )}
                    </GlassPanel>
                </div>
                <div className='mt-3'>
                    <div className='flex justify-between mb-3'>
                        <h2 className='text-2xl font-bold py-2'>Schuldet dir:</h2>
                        <Button onClick={() => setSubtractModalOpen(true)}>Abziehen</Button>
                    </div>
                    <GlassPanel>
                        <div className='flex flex-col gap-4 divide-y divide-white/10'>
                            {debtsTheyOwe.map((debt) => (
                                <div key={debt._id} className='flex items-center justify-between w-full pb-4 transition-all duration-150 hover:cursor-pointer hover:scale-[1.005]' onClick={() => handleDebtClick(debt._id)}>
                                    <div className='flex flex-col items-start'>
                                        <p className='ml-4 text-md font-bold'>Grund: {debt.description}</p>
                                    </div>
                                    <div className='flex flex-row items-end'>
                                        <p className='text-2xl ml-auto' style={{ color: debt.remaining > 0 ? '#00c711' : '#ffff' }}>{debt.remaining > 0 ? "" : ""}{debt.remaining.toFixed(2)}{getCurrencySymbol(debt.currency)}</p>
                                        <p className='text-md text-red-500 ml-1' style={{ color: debt.remaining > 0 ? '#00c711' : '#fff' }}>({debt.amount.toFixed(2)}{getCurrencySymbol(debt.currency)})</p>
                                    </div>
                                </div>
                            ))}
                            {debtsTheyOwe.length === 0 && (
                                <p className='text-center'>Keine Schulden gefunden.</p>
                            )}
                        </div>
                    </GlassPanel>
                    <h2 className='text-2xl font-bold py-2'>Du schuldest:</h2>
                    <GlassPanel>
                        <div className='flex flex-col gap-4 divide-y divide-white/10'>
                            {debtsIOwe.map((debt) => (
                                <div key={debt._id} className='flex items-center justify-between w-full pb-4 transition-all duration-150 hover:cursor-pointer hover:scale-[1.005]' onClick={() => handleDebtClick(debt._id)}>
                                    <div className='flex flex-col items-start'>
                                        <p className='ml-4 text-md font-bold'>Grund: {debt.description}</p>
                                    </div>
                                    <div className='flex flex-row items-end'>
                                        <p className='text-2xl ml-auto' style={{ color: debt.remaining > 0 ? '#fc1303' : '#fff' }}>{debt.remaining > 0 ? "-" : ""}{debt.remaining}{getCurrencySymbol(debt.currency)}</p>
                                        <p className='text-md text-red-500 ml-1' style={{ color: debt.remaining > 0 ? '#fc1303' : '#fff' }}>({debt.amount}{getCurrencySymbol(debt.currency)})</p>
                                    </div>
                                </div>
                            ))}
                            {debtsTheyOwe.length === 0 && (
                                <p className='text-center'>Keine Schulden gefunden.</p>
                            )}
                        </div>
                    </GlassPanel>
                </div>
            </div>
            <Modal open={editDebtModalOpen} onClose={() => setEditDebtModalOpen(false)}>
                <h2 className='text-2xl font-bold py-2'>Bearbeiten</h2>
                <Input
                    label='Grund'
                    value={selectedDebt?.description ?? ""}
                    onChange={(e) =>
                        setSelectedDebt(prev =>
                            prev ? { ...prev, description: e.target.value } : prev
                        )
                    }
                />
                <CurrencyInput
                    label='Betrag'
                    value={selectedDebt?.amount ?? null}
                    onChange={(value) =>
                        setSelectedDebt(prev =>
                            prev ? { ...prev, amount: value ?? 0 } : prev
                        )
                    }
                    currency={(selectedDebt?.currency as Currency) ?? "EUR"}
                    onCurrencyChange={(currency) =>
                        setSelectedDebt(prev =>
                            prev ? { ...prev, currency } : prev
                        )
                    }
                />
                <Divider />
                <div className='w-full flex justify-center items-end gap-x-4'>
                    <CurrencyInput
                        label='Abziehen'
                        value={subtractAmount ?? null}
                        onChange={(value) =>
                            setSubtractAmount(value ?? 0)
                        }
                        currency="EUR"
                        onCurrencyChange={() => { }}
                    />
                    <div>
                        <Button onClick={() => { handleSubtractSpecific() }}>Abziehen</Button>
                    </div>
                </div>
                <Divider />
                <div className='w-full flex justify-center gap-x-4'>
                    <Button onClick={() => { handleEditDebt() }}>Speichern</Button>
                    <Button onClick={() => { setEditDebtModalOpen(false); setDeleteConfirmModalOpen(true) }}>Löschen</Button>
                </div>
            </Modal>
            <Modal open={deleteConfirmModalOpen} onClose={() => setDeleteConfirmModalOpen(false)}>
                <h2 className='text-2xl font-bold py-2'>Löschen</h2>
                <div className=''>
                    <p>Wirklich löschen?</p>
                    <div className='w-full flex justify-center gap-x-4 mt-3'>
                        <Button onClick={() => handleDeleteDebt()}>Ja</Button>
                        <Button onClick={() => setDeleteConfirmModalOpen(false)}>Nein</Button>
                    </div>
                </div>
            </Modal>
            <Modal open={subtractModalOpen} onClose={() => setSubtractModalOpen(false)}>
                <h2 className='text-2xl font-bold py-2'>Abziehen</h2>
                <CurrencyInput
                    label='Betrag'
                    value={subtractAmount}
                    onChange={(value) => setSubtractAmount(value ?? 0)}
                    onCurrencyChange={() => { }}
                    currency="EUR"
                />
                <div className='w-full flex justify-center gap-x-4 mt-3'>
                    <Button onClick={() => handleSubtract()}>Abziehen</Button>
                </div>
            </Modal>
            <Modal open={linkShadowModalOpen} onClose={() => setLinkShadowModalOpen(false)}>
                <h2 className='text-2xl font-bold py-2'>Kontakt verbinden</h2>
                <p>Wähle einen ShadowUser aus, um ihn mit diesem Kontak zu verbinden</p>

                <div className='w-full flex flex-col justify-center gap-4 mt-3'>
                    <ContactSelect contacts={shadowUsers} onSelect={setSelectedLinkShadowUser} />
                    <Button onClick={() => handleLinkShadow()}>Verbinden</Button>
                </div>
            </Modal>
        </ProtectedRoute >
    )
}

export default debts