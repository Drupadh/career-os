import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { MetallicButton } from "../ui/MetallicButton";

interface AddCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCompanyAdded: () => void;
}

export function AddCompanyModal({ isOpen, onClose, onCompanyAdded }: AddCompanyModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        notes: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/v1/companies/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Failed to add company");

            onCompanyAdded();
            onClose();
            setFormData({ name: "", url: "", notes: "" });
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
                    <h2 className="text-lg font-bold text-white">Add Target Company</h2>
                    <button onClick={onClose} className="text-metal-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Company Name</label>
                        <input
                            required
                            className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                            placeholder="e.g. Google"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Career Page URL</label>
                        <input
                            type="url"
                            className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors"
                            placeholder="https://careers.google.com"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">Notes</label>
                        <textarea
                            className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pear-200/50 transition-colors min-h-[100px]"
                            placeholder="Key details, mission, values..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
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
                            Save Company
                        </MetallicButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
