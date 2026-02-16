import React, { useState, useEffect } from 'react';
import { MetallicCard } from '../components/ui/MetallicCard';
import { MetallicButton } from '../components/ui/MetallicButton';
import { Save, Key, Shield, HardDrive } from 'lucide-react';

export function SettingsPage() {
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('gemini-2.0-flash');

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);

        const storedModel = localStorage.getItem('ai_model');
        if (storedModel) setModel(storedModel);
    }, []);

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey);
        localStorage.setItem('ai_model', model);
        alert('Settings saved!');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-slide-up">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-chrome-400">Settings</h1>
                <p className="text-chrome-400">Manage your API keys and application preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* API Configuration */}
                <MetallicCard className="p-6 space-y-6" variant="glass-dark">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="p-2 bg-obsidian-800 rounded-lg border border-white/5">
                            <Key className="w-5 h-5 text-chromatic-purple" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">AI Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-chrome-300">Gemini API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="w-full bg-obsidian-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:ring-1 focus:ring-chromatic-purple focus:border-white/20 transition-all outline-none"
                            />
                            <p className="text-xs text-chrome-500">Required for AI Resume Tailoring and Chat.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-chrome-300">Default Model</label>
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full bg-obsidian-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-chromatic-blue outline-none"
                            >
                                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</option>
                                <option value="gemini-pro">Gemini Pro</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <MetallicButton onClick={handleSave} className="w-full" variant="primary">
                                <Save className="w-4 h-4" />
                                Save Configuration
                            </MetallicButton>
                        </div>
                    </div>
                </MetallicCard>

                {/* Application Info */}
                <MetallicCard className="p-6 space-y-6" variant="glass-dark">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                        <div className="p-2 bg-obsidian-800 rounded-lg border border-white/5">
                            <Shield className="w-5 h-5 text-chromatic-blue" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Application Info</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-chrome-400 text-sm">Version</span>
                            <span className="text-white font-mono text-sm">v0.0.1 Beta</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-chrome-400 text-sm">Storage</span>
                            <span className="text-white font-mono text-sm">Local + FileSystem</span>
                        </div>

                        <div className="p-4 bg-chromatic-blue/10 border border-chromatic-blue/20 rounded-lg">
                            <p className="text-xs text-chrome-300 leading-relaxed">
                                <strong className="text-chromatic-blue block mb-1">Privacy Note:</strong>
                                Your API keys are stored locally in your browser. They are never sent to our servers, only directly to Google's API.
                            </p>
                        </div>
                    </div>
                </MetallicCard>
            </div>
        </div>
    );
}
