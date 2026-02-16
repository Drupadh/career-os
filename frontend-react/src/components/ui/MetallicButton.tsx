import { cn } from "../../lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

interface MetallicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "icon" | "gradient";
    size?: "sm" | "md" | "lg" | "icon";
    isLoading?: boolean;
}

export function MetallicButton({
    children,
    className,
    variant = "primary",
    size = "md",
    isLoading,
    disabled,
    ...props
}: MetallicButtonProps) {

    const variants = {
        primary: "bg-chrome-gradient text-obsidian-900 font-bold border-t border-white/60 shadow-[0_2px_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105",
        secondary: "bg-obsidian-800 border border-white/10 text-chrome-300 hover:text-white hover:border-chromatic-blue/50 hover:shadow-glow shadow-metal-pressed",
        ghost: "bg-transparent text-chrome-400 hover:text-white hover:bg-white/5",
        icon: "bg-obsidian-800/50 border border-white/5 text-chrome-400 hover:text-white hover:bg-obsidian-700 hover:border-chromatic-purple/50 hover:shadow-glow p-2 aspect-square rounded-lg flex items-center justify-center",
        gradient: "bg-gradient-to-r from-chromatic-purple to-chromatic-blue text-white font-bold border border-white/20 shadow-glow hover:shadow-glow-strong hover:scale-105"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9 p-0",
    };

    return (
        <button
            disabled={disabled || isLoading}
            className={cn(
                "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden",
                variants[variant as keyof typeof variants],
                variant !== 'icon' && sizes[size],
                className
            )}
            {...props}
        >
            {/* Shimmer Effect for Primary */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
            )}

            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span className="relative z-0 flex items-center gap-2">{children}</span>
        </button>
    );
}
