import { useEffect, useState } from "react";
import { AddJobModal } from "../components/modals/AddJobModal";
import { MetallicCard } from "../components/ui/MetallicCard";
import { MetallicButton } from "../components/ui/MetallicButton";
import { Plus, Calendar, MapPin, ExternalLink, Briefcase, Trash2 } from "lucide-react";

interface Job {
    id: number;
    company: string;
    position: string;
    status: string;
    date_applied: string;
    location: string;
    url: string;
}

export function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch("/api/v1/jobs/")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then((data) => {
                setJobs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                // Fallback or empty state
            });
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Applied": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "Interviewing": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "Offer": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            case "Rejected": return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-metal-400 bg-metal-800 border-metal-700";
        }
    };

    return (
        <div className="h-full flex flex-col bg-metal-900 text-foreground p-6 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Applications</h1>
                    <p className="text-sm text-metal-400">Track and manage your job search progress.</p>
                </div>
                <MetallicButton onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Job
                </MetallicButton>
            </div>

            <AddJobModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onJobAdded={() => {
                    setLoading(true);
                    fetch("/api/v1/jobs/")
                        .then(res => res.json())
                        .then(data => {
                            setJobs(data);
                            setLoading(false);
                        });
                }}
            />

            {/* Grid */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center text-metal-500">Loading jobs...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20">
                    {jobs.map((job) => (
                        <MetallicCard key={job.id} className="p-5 flex flex-col gap-3 group hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{job.company}</h3>
                                    <div className="text-sm text-metal-300">{job.position}</div>
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full border ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </span>
                            </div>

                            <div className="mt-2 space-y-1">
                                <div className="flex items-center text-xs text-metal-500">
                                    <MapPin className="w-3 h-3 mr-2 opacity-50" />
                                    {job.location || "Remote"}
                                </div>
                                <div className="flex items-center text-xs text-metal-500">
                                    <Calendar className="w-3 h-3 mr-2 opacity-50" />
                                    {new Date(job.date_applied).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                {job.url && (
                                    <a
                                        href={job.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-lg hover:bg-white/10 text-metal-400 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm("Are you sure you want to delete this job?")) {
                                            fetch(`/api/v1/jobs/${job.id}`, { method: "DELETE" })
                                                .then(() => {
                                                    setJobs(jobs.filter((j) => j.id !== job.id));
                                                })
                                                .catch((err) => console.error("Failed to delete job", err));
                                        }
                                    }}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-metal-400 hover:text-red-400 transition-colors ml-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </MetallicCard>
                    ))}

                    {/* Empty State if needed */}
                    {jobs.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-metal-500">
                            <div className="w-16 h-16 rounded-2xl bg-metal-800/50 border border-white/5 flex items-center justify-center mb-4 shadow-inner">
                                <Briefcase className="w-8 h-8 opacity-50" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">No applications yet</h3>
                            <p className="max-w-sm mx-auto mb-6">Start tracking your job search by adding your first application.</p>
                            <MetallicButton onClick={() => setIsModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Job
                            </MetallicButton>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
