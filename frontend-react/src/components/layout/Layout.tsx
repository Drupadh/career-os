import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { FileText, Briefcase, GraduationCap, Users, Command, Building2, StickyNote } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    const [referralCount, setReferralCount] = useState(0);

    useEffect(() => {
        fetch("/api/v1/contacts/")
            .then(res => res.json())
            .then(data => {
                const count = data.filter((c: any) => c.referral_status === "Referred").length;
                setReferralCount(count);
            })
            .catch(err => console.error("Failed to load referrals", err));
    }, []);

    const navItems = [
        { label: "Job Tracker", path: "/", icon: Briefcase },
        { label: "Resume Builder", path: "/builder", icon: FileText },
        { label: "Companies", path: "/companies", icon: Building2 },
        { label: "Referrals", path: "/referrals", icon: Users, badge: referralCount },
        { label: "Notes", path: "/notes", icon: StickyNote },
    ];

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-background text-foreground font-sans selection:bg-chromatic-purple/30 selection:text-white">

            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-obsidian-950/80 backdrop-blur-xl z-30 shadow-[5px_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Chromatic Glow Top */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-chromatic-purple via-chromatic-blue to-chromatic-cyan opacity-40 blur-sm" />

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-1 group cursor-default">
                        <div className="p-2 bg-gradient-to-br from-obsidian-800 to-obsidian-900 rounded-xl shadow-metal-raised border border-white/10 group-hover:shadow-glow transition-all duration-500">
                            <Command className="w-5 h-5 text-chrome-300 group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-chrome-400 group-hover:to-white transition-all">CareerOS</h1>
                            <p className="text-[10px] text-chrome-500 font-medium tracking-widest uppercase opacity-60">Personal Suite</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group overflow-hidden",
                                    isActive
                                        ? "text-white shadow-metal-pressed bg-obsidian-900/50 border border-white/5"
                                        : "text-chrome-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-chromatic-blue to-chromatic-purple shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                )}

                                <Icon className={cn("w-4 h-4 transition-all duration-300",
                                    isActive
                                        ? "text-chromatic-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                        : "text-chrome-500 group-hover:text-chrome-200 group-hover:scale-110"
                                )} />
                                <span className="flex-1 z-10">{item.label}</span>

                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className={cn(
                                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white/10 shadow-lg",
                                        isActive
                                            ? "bg-chromatic-blue/20 text-chromatic-blue"
                                            : "bg-obsidian-800 text-chrome-400"
                                    )}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-chrome-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                        <div className="w-6 h-6 rounded-full border border-chrome-500/30 flex items-center justify-center group-hover:border-white/50 transition-colors">
                            <span className="text-[10px] font-bold">OS</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-chrome-200 group-hover:text-white">CareerOS</span>
                            <span className="text-[10px] text-chrome-500">v0.0.1 Beta</span>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative bg-background">
                <div className="absolute inset-0 pointer-events-none bg-noise opacity-20" />
                {children}
            </main>
        </div>
    );
}

