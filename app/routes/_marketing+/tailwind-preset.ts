import { type Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
export const marketingPreset = {
	theme: {
		extend: {
			keyframes: {
				'roll-reveal': {
					from: { transform: 'rotate(12deg) scale(0)', opacity: '0' },
					to: { transform: 'rotate(0deg) scale(1)', opacity: '1' },
				},
				'slide-left': {
					from: { transform: 'translateX(20px)', opacity: '0' },
					to: { transform: 'translateX(0px)', opacity: '1' },
				},
				'slide-top': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0px)', opacity: '1' },
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				'roll-reveal': 'roll-reveal 0.4s cubic-bezier(.22,1.28,.54,.99)',
				'slide-left': 'slide-left 0.3s ease-out',
				'slide-top': 'slide-top 0.3s ease-out',
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "#00BFA5",
					foreground: "#FFFFFF",
					500: "#00BFA5", // Teal color from your design
					600: "#00A896", // Darker teal for hover states
				},
				teal: {
					50: "#E0F7F5",
					100: "#B3EBE4",
					500: "#00BFA5",
					600: "#00A896",
					700: "#008E7B",
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
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			backgroundImage: {
				'hero-gradient': 'linear-gradient(to right, from-pink-400/40 via-pink-300/30 to-transparent)',
			},
		},
	},
	plugins: [animatePlugin],
} satisfies Omit<Config, 'content'>
