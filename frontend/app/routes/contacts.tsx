import { useEffect, useState } from "react";
import { getShadowUsers, getUserConnections, generateConnectionCode, redeemConnectionCode } from "~/lib/api";
import { useNavigate } from "react-router";
import { Avatar } from "~/components/ui/Avatar";
import { GlassPanel } from "~/components/ui/GlassPanel";
import { Divider } from "~/components/ui/Divider";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Input } from "~/components/ui/Input";
import ProtectedRoute from "~/components/ui/ProtectedRoute";

export interface Contact {
    _id: string
    username: string
}

const contacts = () => {
    const navigate = useNavigate();

    const [shadowContacts, setShadowContacts] = useState<Contact[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);

    const [connectCode, setConnectCode] = useState<string | null>(null);
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [connectModalPage, setConnectModalPage] = useState(1);
    const [connectCodeInput, setConnectCodeInput] = useState<string | null>(null);
    const [connectModalMessage, setConnectModalMessage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContacts() {
            const res = await getShadowUsers();
            if (res.data) {
                setShadowContacts(res.data);
            }

            const contactRes = await getUserConnections();
            if (contactRes.data) {
                setContacts(contactRes.data);
            }
        }

        fetchContacts();
    }, []);

    async function handleInitiateConnect() {
        const res = await generateConnectionCode();
        if (res.data) {
            setConnectCode(res.data.code);
            setConnectModalOpen(true);
        }

        setConnectModalPage(1);
        setConnectModalOpen(true);
    }

    async function handleConnect() {
        if (connectCodeInput) {
            const res = await redeemConnectionCode(connectCodeInput);
            if (res.message == "Users connected successfully") {
                setConnectCodeInput(null);
                setConnectModalMessage("Erfolgreich verbunden");
            }
        }
    }

    return (
        <ProtectedRoute>
            <div className="p-3">
                <div className='p-2 flex flex-row justify-between items-center'>
                    <p onClick={() => { navigate('/dashboard') }} className='hover:underline hover:cursor-pointer'>← Zurück</p>
                    <Button onClick={handleInitiateConnect} >Neue Verbindung</Button>
                </div>
                <div>
                    <div>
                        <h2 className='text-3xl font-bold mb-2'>Kontakte</h2>
                    </div>
                    <GlassPanel>
                        {contacts &&
                            <div>
                                <p className="mb-3">Normale:</p>
                                {contacts.map((contact) => (
                                    <div className='flex flex-col'>
                                        {contact && (
                                            <div className='flex items-center w-full transition-all duration-150 hover:cursor-pointer hover:scale-[1.005]' onClick={() => navigate("/debts/" + contact._id)}>
                                                <div className='flex items-center'>
                                                    <Avatar username={contact.username} size={17} fontSize='text-2xl' />
                                                    <p className='ml-4 text-2xl font-bold'>{contact.username}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <Divider />
                            </div>
                        }
                        {shadowContacts &&
                            <div>
                                <p className="mb-3">ShadowUsers:</p>
                                {shadowContacts && shadowContacts.map((contact) => (
                                    <div className='flex flex-col'>
                                        {contact && (
                                            <div className='flex items-center w-full transition-all duration-150 hover:cursor-pointer hover:scale-[1.005]' onClick={() => navigate("/debts/" + contact._id)}>
                                                <div className='flex items-center'>
                                                    <Avatar username={contact.username} size={17} fontSize='text-2xl' />
                                                    <p className='ml-4 text-2xl font-bold'>{contact.username}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        }
                    </GlassPanel>
                </div>
                <Modal open={connectModalOpen} onClose={() => setConnectModalOpen(false)}>
                    <div className="w-full mb-3 flex flex-row justify-center items-center space-x-4 divide-x-2">
                        <h2 className="text-2xl hover:cursor-pointer pr-4" style={{ textDecoration: connectModalPage == 1 ? "underline" : "none" }} onClick={() => setConnectModalPage(1)}>Code</h2>
                        <h2 className="text-2xl hover:cursor-pointer" style={{ textDecoration: connectModalPage == 2 ? "underline" : "none" }} onClick={() => setConnectModalPage(2)}>Eingeben</h2>
                    </div>
                    {connectCode &&
                        <div>
                            {connectModalPage === 1 &&
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-2xl font-bold">Verbindungscode:</p>
                                    <p className="text-5xl font-bold">{connectCode}</p>
                                </div>
                            }
                            {connectModalPage === 2 &&
                                <div className="flex flex-col items-center gap-4">
                                    {connectModalMessage && <p className="text-2xl font-bold">{connectModalMessage}</p>}
                                    <Input label="Verbindungscode" value={connectCodeInput?.toString()} onChange={(e) => setConnectCodeInput(e.target.value)} />
                                    <Button onClick={() => handleConnect()}>Verbinden</Button>
                                </div>
                            }
                        </div>
                    }
                </Modal>
            </div>
        </ProtectedRoute>
    )
}

export default contacts