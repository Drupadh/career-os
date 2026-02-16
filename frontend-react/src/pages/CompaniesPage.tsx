import { useState, useEffect } from "react";
import { MetallicButton } from "../components/ui/MetallicButton";
import { MetallicCard } from "../components/ui/MetallicCard";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { AddCompanyModal } from "../components/modals/AddCompanyModal";

interface Company {
    id: number;
    name: string;
    url?: string;
    notes?: string;
}

export function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCompanies = async () => {
        try {
            const res = await fetch("/api/v1/companies/");
            const data = await res.json();
            setCompanies(data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this company?")) return;
        try {
            await fetch(`/api/v1/companies/${id}`, { method: "DELETE" });
            fetchCompanies();
        } catch (error) {
            console.error("Failed to delete company", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-metal-900 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Target Companies</h1>
                    <p className="text-metal-400">Track companies you're interested in.</p>
                </div>
                <MetallicButton onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Company
                </MetallicButton>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <MetallicCard key={company.id} className="flex flex-col gap-4 p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-royal-500/20 to-indigo-600/20 flex items-center justify-center text-lg font-bold text-white border border-royal-500/30 shadow-lg shadow-royal-500/10">
                                        {company.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white leading-tight">{company.name}</h3>
                                        {company.url && (
                                            <a
                                                href={company.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-royal-400 hover:text-royal-300 flex items-center gap-1 mt-1 transition-colors"
                                            >
                                                Careers Page <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {company.notes && (
                                <div className="mt-2 text-sm text-metal-300 bg-black/20 p-3 rounded-lg border border-white/5">
                                    {company.notes}
                                </div>
                            )}

                            <div className="mt-auto pt-4 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    className="text-metal-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </MetallicCard>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-metal-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <p className="mb-4">No companies yet.</p>
                    <MetallicButton onClick={() => setIsModalOpen(true)} className="bg-metal-700">
                        Add Your First Target
                    </MetallicButton>
                </div>
            )}

            <AddCompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCompanyAdded={fetchCompanies}
            />
        </div>
    );
}
