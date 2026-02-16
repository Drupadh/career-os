import { useState, useEffect, useRef } from "react";
import { MetallicButton } from "../components/ui/MetallicButton";
import { Save, Loader2, StickyNote } from "lucide-react";

interface Note {
    id: number;
    title: string;
    content: string;
    updated_at: string;
}

export function NotesPage() {
    const [note, setNote] = useState<Note | null>(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Load the "Whiteboard" note (Conceptually just the first note found, or create one)
    const loadNote = async () => {
        try {
            const res = await fetch("/api/v1/notes/");
            const data = await res.json();

            if (data && data.length > 0) {
                setNote(data[0]);
                setContent(data[0].content || "");
                setLastSaved(new Date(data[0].updated_at).toLocaleTimeString());
            } else {
                // Create default note if none exists
                createDefaultNote();
            }
        } catch (error) {
            console.error("Failed to load notes", error);
        } finally {
            setLoading(false);
        }
    };

    const createDefaultNote = async () => {
        try {
            const res = await fetch("/api/v1/notes/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: "Whiteboard", content: "" })
            });
            const newNote = await res.json();
            setNote(newNote);
            setContent("");
        } catch (error) {
            console.error("Failed to create default note", error);
        }
    };

    useEffect(() => {
        loadNote();
    }, []);

    const handleSave = async () => {
        if (!note) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/v1/notes/${note.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Whiteboard", // Keep title consistent
                    content: content
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setNote(updated);
                setLastSaved(new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.error("Failed to save note", error);
        } finally {
            setSaving(false);
        }
    };

    // Auto-save on standard Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [note, content]);

    return (
        <div className="flex flex-col h-full bg-metal-900 p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <StickyNote className="w-8 h-8 text-pear-400" />
                        Whiteboard
                    </h1>
                    <p className="text-metal-400">Capture your thoughts, quick links, and ideas.</p>
                </div>
                <div className="flex items-center gap-4">
                    {lastSaved && (
                        <span className="text-xs text-metal-500">Last saved: {lastSaved}</span>
                    )}
                    <MetallicButton onClick={handleSave} disabled={saving || loading}>
                        {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? "Saving..." : "Save Notes"}
                    </MetallicButton>
                </div>
            </div>

            <div className="flex-1 bg-midnight-900 border border-white/5 rounded-2xl shadow-inner relative overflow-hidden flex flex-col">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-metal-500">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : (
                    <textarea
                        className="flex-1 w-full bg-transparent p-8 text-lg text-white font-mono leading-relaxed resize-none focus:outline-none placeholder:text-metal-700/50"
                        placeholder="Start typing..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        spellCheck={false}
                    />
                )}
            </div>

            <div className="mt-2 text-center text-xs text-metal-600">
                Type randomly. Press Ctrl+S to save manually.
            </div>
        </div>
    );
}
