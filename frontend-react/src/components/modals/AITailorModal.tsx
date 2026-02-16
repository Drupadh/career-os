import { useState } from "react";
import { X, Loader2, Sparkles, Key } from "lucide-react";
import { MetallicButton } from "../ui/MetallicButton";

interface AITailorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentResume: any;
    onResumeTailored: (newResume: any) => void;
}

export function AITailorModal({ isOpen, onClose, currentResume, onResumeTailored }: AITailorModalProps) {
    const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleTailor = async () => {
        if (!apiKey) {
            setError("Please enter a valid Gemini API Key.");
            return;
        }
        if (!jobDescription) {
            setError("Please paste a Job Description.");
            return;
        }

        setLoading(true);
        setError(null);

        // Save key for convenience
        localStorage.setItem("gemini_api_key", apiKey);

        try {
            const res = await fetch("/api/v1/resumes/tailor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    api_key: apiKey,
                    resume: currentResume,
                    job_description: jobDescription
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Failed to tailor resume");
            }

            const tailoredResume = await res.json();
            onResumeTailored(tailoredResume);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-midnight-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                            <Sparkles className="w-5 h-5 text-purple-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AI Resume Tailoring</h2>
                            <p className="text-xs text-metal-400">Powered by Gemini 2.0 Flash</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-metal-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* API Key Section */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider flex items-center gap-2">
                            <Key className="w-3 h-3" /> Gemini API Key
                        </label>
                        <input
                            type="password"
                            className="w-full bg-metal-800/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-mono text-sm"
                            placeholder="Enter your Gemini API Key..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        <p className="text-[10px] text-metal-500">
                            Your key is stored locally in your browser and sent only to your backend.
                        </p>
                    </div>

                    {/* Job Description Section */}
                    <div className="space-y-2 flex-1 flex flex-col">
                        <label className="text-xs font-medium text-metal-300 uppercase tracking-wider">
                            Job Description
                        </label>
                        <textarea
                            className="w-full h-48 bg-metal-800/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none text-sm leading-relaxed"
                            placeholder="Paste the full job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-metal-900 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-metal-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <MetallicButton
                        onClick={handleTailor}
                        disabled={loading}
                        className="bg-purple-600/20 border-purple-500/30 text-purple-100 hover:bg-purple-600/30 hover:border-purple-500/50"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? "Tailoring..." : "Tailor Resume"}
                    </MetallicButton>
                </div>
            </div>
        </div>
    );
}
