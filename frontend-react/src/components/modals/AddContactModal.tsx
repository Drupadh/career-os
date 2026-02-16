import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { MetallicButton } from "../ui/MetallicButton";

interface AddContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContactAdded: () => void;
}

export function AddContactModal({ isOpen, onClose, onContactAdded }: AddContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        company: "",
        email: "",
        linkedin: "",
        whatsapp: "",
        referral_status: "Target",
        last_contact: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Updated to strip 'Target' status based on backend model if needed, 
            // but relying on string status for now.
            const res = await fetch("/api/v1/contacts/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Failed to add contact");

            onContactAdded();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-midnight-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <h2 className="text-lg font-bold text-white">Add Professional Contact</h2>
                    <button onClick={onClose} className="text-metal-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Name</label>
                        <input
                            required
                            className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                            placeholder="e.g. Jane Smith"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Role</label>
                            <input
                                required
                                className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                                placeholder="e.g. Recruiter"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Company</label>
                            <input
                                className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                                placeholder="e.g. Tech Corp"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                            placeholder="jane@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">LinkedIn URL</label>
                            <input
                                className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                                placeholder="linkedin.com/in/..."
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">WhatsApp</label>
                            <input
                                className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                                placeholder="+1 234 567 890"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Referral Status</label>
                        <select
                            className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors appearance-none"
                            value={formData.referral_status}
                            onChange={(e) => setFormData({ ...formData, referral_status: e.target.value })}
                        >
                            <option value="Target">Target</option>
                            <option value="Requesting">Requesting</option>
                            <option value="connected">Connected</option>
                            <option value="Referred">Referred</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-metal-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <MetallicButton type="submit" disabled={loading} className="bg-pear-200 text-midnight-900 hover:brightness-110">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Contact
                        </MetallicButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
