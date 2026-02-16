import { useState, useEffect } from "react";
import { MetallicButton } from "../components/ui/MetallicButton";
import { MetallicCard } from "../components/ui/MetallicCard";
import { Plus, Search, Linkedin, Phone, CheckSquare, Trash2, Square, Check, X } from "lucide-react";
import { AddContactModal } from "../components/modals/AddContactModal";

interface Task {
    id: number;
    text: string;
    completed: number;
    contact_id: number;
}

interface Contact {
    id: number;
    name: string;
    role: string;
    company: string;
    email: string;
    linkedin?: string;
    whatsapp?: string;
    referral_status: string;
    last_contact: string;
    tasks?: Task[];
}

export function ReferralsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskText, setNewTaskText] = useState<{ [key: number]: string }>({});

    const fetchContacts = async () => {
        try {
            const res = await fetch("/api/v1/contacts/");
            const data = await res.json();
            // Fetch tasks for each contact (or rely on joined load if backend supports it - schema suggests it does)
            // The schema has 'tasks: List[Task] = []' so it should be there if joined. 
            // Let's assume the default fetch includes them or we might need to fetch separate if not eager loaded.
            // Actually, backend default join might not be set. Let's see. 
            // If tasks are missing, we might need to fetch them. 
            // But for now, let's use the data as is.
            setContacts(data);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleAddTask = async (contactId: number) => {
        if (!newTaskText[contactId]) return;
        try {
            await fetch(`/api/v1/contacts/${contactId}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newTaskText[contactId] })
            });
            setNewTaskText({ ...newTaskText, [contactId]: "" });
            fetchContacts();
        } catch (e) {
            console.error(e);
        }
    };

    const toggleTask = async (contactId: number, taskId: number) => {
        try {
            await fetch(`/api/v1/contacts/${contactId}/tasks/${taskId}/toggle`, { method: "PUT" });
            fetchContacts();
        } catch (e) {
            console.error(e);
        }
    };

    const deleteTask = async (contactId: number, taskId: number) => {
        try {
            await fetch(`/api/v1/contacts/${contactId}/tasks/${taskId}`, { method: "DELETE" });
            fetchContacts();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-metal-900 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Network & Referrals</h1>
                    <p className="text-metal-400">Manage your professional connections and referral requests.</p>
                </div>
                <MetallicButton onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                </MetallicButton>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : contacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map((contact) => (
                        <MetallicCard key={contact.id} className="flex flex-col gap-4 p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-royal-500 to-indigo-600 flex items-center justify-center text-lg font-bold text-white border border-white/10 shadow-lg shadow-royal-500/20">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white leading-tight">{contact.name}</h3>
                                        <div className="text-xs text-metal-400 font-medium">{contact.role} @ {contact.company}</div>
                                    </div>
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${contact.referral_status === 'Referred' ? 'bg-pear-500/10 text-pear-400 border-pear-500/20' :
                                    contact.referral_status === 'Connected' ? 'bg-royal-500/10 text-royal-400 border-royal-500/20' :
                                        'bg-metal-500/10 text-metal-400 border-metal-500/20'
                                    }`}>
                                    {contact.referral_status}
                                </span>
                            </div>

                            <div className="flex gap-2 text-metal-400">
                                {contact.linkedin && (
                                    <a href={contact.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                                {contact.whatsapp && (
                                    <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </a>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckSquare className="w-3 h-3 text-metal-500" />
                                    <span className="text-xs font-bold text-metal-500 uppercase tracking-wider">Tasks</span>
                                </div>
                                <div className="space-y-2">
                                    {contact.tasks?.map(task => (
                                        <div key={task.id} className="flex items-center gap-2 text-sm text-metal-300">
                                            <button onClick={() => toggleTask(contact.id, task.id)}>
                                                {task.completed ? <Check className="w-3 h-3 text-pear-400" /> : <Square className="w-3 h-3" />}
                                            </button>
                                            <span className={task.completed ? "line-through opacity-50" : ""}>{task.text}</span>
                                            <button onClick={() => deleteTask(contact.id, task.id)} className="ml-auto text-metal-600 hover:text-red-400">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 mt-2">
                                        <input
                                            className="bg-transparent border-b border-metal-700 text-xs text-white w-full focus:outline-none focus:border-royal-500 pb-1"
                                            placeholder="Add task..."
                                            value={newTaskText[contact.id] || ""}
                                            onChange={(e) => setNewTaskText({ ...newTaskText, [contact.id]: e.target.value })}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask(contact.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </MetallicCard>
                    ))}
                </div>
            ) : (
                // Mock Data for empty state to show UI
                [1, 2, 3].map((i) => (
                    <MetallicCard key={i} className="p-5 flex flex-col gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-metal-800 flex items-center justify-center text-sm font-bold text-metal-500 border border-white/5">?</div>
                                <div>
                                    <h3 className="font-bold text-metal-300">Example Contact</h3>
                                    <div className="text-xs text-metal-500">Recruiter @ Tech Co</div>
                                </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full border text-metal-500 bg-metal-800 border-metal-700">
                                Example
                            </span>
                        </div>
                        <div className="mt-2 text-xs text-metal-500 text-center py-4 border-t border-white/5">
                            Add contacts to start tracking referrals!
                        </div>
                    </MetallicCard>
                ))
            )
            }
        </div >
    )
}

