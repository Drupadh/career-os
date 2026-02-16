/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // New Metallic Chromatic Palette
                obsidian: {
                    950: "#030303", // Void
                    900: "#0A0A0A", // Deep Background
                    800: "#171717", // Surface
                    700: "#262626", // Highlight
                },
                chrome: {
                    50: "#FAFAFA",
                    100: "#F5F5F5",
                    200: "#E5E5E5",
                    300: "#D4D4D4", // Silver
                    400: "#A3A3A3", // Steel
                    500: "#737373", // Metal
                },
                chromatic: {
                    purple: "#A855F7",
                    blue: "#3B82F6",
                    cyan: "#06B6D4",
                    pink: "#EC4899"
                },
                // Backwards compatibility mappings (optional, but good for safety)
                midnight: { 900: "#0A0A0A", 800: "#171717" },
                metal: { 900: "#0A0A0A", 800: "#171717", 300: "#D4D4D4", 100: "#FAFAFA" },
                pear: { 200: "#D4D4D4", 100: "#FAFAFA" }
            },
            backgroundImage: {
                'metal-gradient': 'linear-gradient(145deg, #262626 0%, #0A0A0A 100%)',
                'chrome-gradient': 'linear-gradient(135deg, #E5E5E5 0%, #FFFFFF 50%, #A3A3A3 100%)',
                'chromatic-gradient': 'linear-gradient(135deg, #A855F7 0%, #3B82F6 100%)',
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E\")",
            },
            boxShadow: {
                'metal-pressed': 'inset 2px 2px 5px 0 rgba(0, 0, 0, 0.8), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.1)',
                'metal-raised': '4px 4px 10px 0 rgba(0, 0, 0, 0.5), -1px -1px 0 0 rgba(255, 255, 255, 0.1)',
                'glow': '0 0 20px rgba(168, 85, 247, 0.15)', // Chromatic Glow
                'glow-strong': '0 0 30px rgba(59, 130, 246, 0.3)',
            },
            animation: {
                'shimmer': 'shimmer 3s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                serif: ['Georgia', 'serif'],
            }
        },
    },
    plugins: [],
}
