import React, { useState, useEffect, useRef } from 'react';
import { PanelLeft, FileText, Code, Play, Download, Send, Sparkles, FileUp, Loader2 } from 'lucide-react';
import { MetallicButton } from '../ui/MetallicButton';
import { DEFAULT_LATEX_TEMPLATE } from './ResuTexTemplate';

export function ResumeWorkspace() {
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [latexCode, setLatexCode] = useState(DEFAULT_LATEX_TEMPLATE);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isTailoring, setIsTailoring] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hello! I'm CareerOS AI. How can I help you with your resume?" }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCompile = async () => {
        setIsCompiling(true);
        try {
            const response = await fetch('/api/v1/resumes/compile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latex_code: latexCode }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Compilation failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);

            // Add a success message to chat if it was a manual compile? check logic
            // keeping it simple for now, maybe don't spam chat on manual compile

        } catch (error: any) {
            console.error("Compile error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Compilation Error:\n${error.message}\n\nPlease check your syntax.`
            }]);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage;
        setInputMessage('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        setIsTailoring(true);
        try {
            // Assume the user input IS the job description or instruction
            // In a real app we might differentiate, but for now we treat input as context/JD

            const apiKey = localStorage.getItem('gemini_api_key');

            const response = await fetch('/api/v1/resumes/tailor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resume_text: latexCode,
                    job_description: userMsg,
                    api_key: apiKey
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Failed to tailor resume");
            }

            const data = await response.json();
            if (data.tailored_resume) {
                setLatexCode(data.tailored_resume);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.message || "I've updated your resume based on the job description. The LaTeX code is ready for you to Compile."
                }]);

                // Auto-compile? Maybe optional. Let's let user click compile for now to respect "preview".
            }

        } catch (error: any) {
            console.error("Tailor error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error tailoring resume: ${error.message}. Please Check your API Key in Settings.`
            }]);
        } finally {
            setIsTailoring(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        setImporting(true);

        const formData = new FormData();
        formData.append("file", file);
        const apiKey = localStorage.getItem('gemini_api_key') || "";

        try {
            const res = await fetch(`/api/v1/resumes/import?api_key=${apiKey}&format=latex`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Import failed");
            }

            const data = await res.json();
            if (data.latex) {
                setLatexCode(data.latex);
                setMessages(prev => [...prev, { role: 'assistant', content: "I've imported your resume and converted it to the LaTeX template! You can now compile it to see the result." }]);
            }
        } catch (err: any) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: `Failed to import resume: ${err.message}` }]);
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };


    return (
        <div className="flex h-full w-full overflow-hidden bg-background relative">

            {/* LEFT PANE: Chat / Context (Collapsible) */}
            {leftPanelOpen && (
                <div className="w-80 border-r border-white/10 flex flex-col bg-obsidian-950/50 backdrop-blur-md transition-all duration-300">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-chrome-300">
                            <Sparkles className="w-4 h-4 text-chromatic-purple" />
                            <span className="font-semibold text-sm">AI Assistant</span>
                        </div>
                        <button onClick={() => setLeftPanelOpen(false)} className="text-chrome-500 hover:text-white transition-colors">
                            <PanelLeft className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-obsidian-700">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-lg text-sm ${msg.role === 'assistant' ? 'bg-white/5 text-chrome-200' : 'bg-chromatic-blue/20 text-white ml-4'}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isTailoring && (
                            <div className="p-3 rounded-lg text-sm bg-white/5 text-chrome-400 animate-pulse">
                                Tailoring resume...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-white/10">
                        <div className="relative">
                            <textarea
                                className="w-full bg-obsidian-900 border border-white/10 rounded-lg p-3 text-sm text-white resize-none focus:ring-1 focus:ring-chromatic-purple outline-none pr-10"
                                rows={3}
                                placeholder="Paste Job Description..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isTailoring || !inputMessage.trim()}
                                className="absolute right-2 bottom-2 p-1.5 bg-chromatic-purple/80 hover:bg-chromatic-purple disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                            >
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOGGLE BUTTON (When Left Pane Closed) */}
            {!leftPanelOpen && (
                <div className="absolute left-4 top-4 z-20">
                    <MetallicButton variant="icon" onClick={() => setLeftPanelOpen(true)}>
                        <PanelLeft className="w-4 h-4" />
                    </MetallicButton>
                </div>
            )}

            {/* CENTER PANE: PDF Preview */}
            <div className="flex-1 flex flex-col bg-obsidian-950 relative">
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-obsidian-900/50">
                    <span className="text-xs font-semibold text-chrome-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Preview
                    </span>
                    <div className="flex items-center gap-2">
                        {isCompiling && <span className="text-xs text-chromatic-blue animate-pulse">Compiling...</span>}
                        <span className="text-xs text-chrome-500">Scale: 100%</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-8 flex justify-center items-start bg-noise">
                    {/* Visual Placeholder for PDF */}
                    <div className="w-[595px] h-[842px] bg-white text-black shadow-2xl relative">
                        {pdfUrl ? (
                            <iframe src={pdfUrl} className="w-full h-full" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                                <FileText className="w-16 h-16 opacity-20" />
                                <p>Click Compile to generate PDF</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* RIGHT PANE: LaTeX Editor */}
            <div className="w-[45%] flex flex-col border-l border-white/10 bg-obsidian-900">
                <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-obsidian-900/50">
                    <span className="text-xs font-semibold text-chrome-400 uppercase tracking-wider flex items-center gap-2">
                        <Code className="w-3 h-3" /> LaTeX Editor
                    </span>
                    <div className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                        />
                        <MetallicButton size="sm" variant="secondary" onClick={handleImportClick} disabled={importing}>
                            {importing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <FileUp className="w-3 h-3 mr-1" />}
                            Import
                        </MetallicButton>
                        <MetallicButton size="sm" variant="gradient" onClick={handleCompile} isLoading={isCompiling}>
                            <Play className="w-3 h-3 mr-1" /> Compile
                        </MetallicButton>
                        <MetallicButton size="sm" variant="secondary">
                            <Download className="w-3 h-3 mr-1" /> Export
                        </MetallicButton>
                    </div>
                </div>

                <div className="flex-1 relative">
                    <textarea
                        className="w-full h-full bg-[#1e1e1e] text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none selection:bg-chromatic-blue/30"
                        value={latexCode}
                        onChange={(e) => setLatexCode(e.target.value)}
                        spellCheck={false}
                    />
                </div>
            </div>

        </div>
    );
}


