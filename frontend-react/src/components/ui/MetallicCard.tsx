import { cn } from "../../lib/utils";
import React from "react";

interface MetallicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: "default" | "dark" | "glass" | "glass-dark";
    hoverEffect?: boolean;
}

export function MetallicCard({ children, className, variant = "glass-dark", hoverEffect = true, ...props }: MetallicCardProps) {
    const variants = {
        default: "bg-chrome-100 border-white/20 text-obsidian-900 shadow-metal-raised",
        dark: "bg-obsidian-900 border-white/10 text-white shadow-metal-pressed",
        glass: "bg-white/10 backdrop-blur-md border-white/20 text-white shadow-lg",
        "glass-dark": "bg-obsidian-950/60 backdrop-blur-xl border-white/5 text-chrome-100 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    };

    return (
        <div
            className={cn(
                "rounded-xl border relative overflow-hidden transition-all duration-500",
                variants[variant],
                hoverEffect && "hover:border-white/20 hover:shadow-glow hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {/* Specular Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 pointer-events-none" />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {children}
        </div>
    );
}
