import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: [
		"./**/*.{ts,tsx}", // include packages if not transpiling
	],
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1.25rem",
				sm: "2rem",
			},
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				active: {
					DEFAULT: "hsl(var(--active))",
					foreground: "hsl(var(--active-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
					surface: "hsl(var(--secondary-surface))",
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
				screenshot: "hsl(var(--screenshot))",
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			// Flat aesthetic: square corners everywhere. `full` is kept for genuine
			// circles (avatars, status dots, blobs), everything else is 0.
			borderRadius: {
				none: "0px",
				sm: "0px",
				DEFAULT: "0px",
				md: "0px",
				lg: "0px",
				xl: "0px",
				"2xl": "0px",
				"3xl": "0px",
				full: "9999px",
			},
			fontSize: {
				xxs: "0.675rem",
			},
			fontFamily: {
				sans: ["Archivo", "Geist Variable", ...fontFamily.sans],
				mono: ["Geist Mono Variable", ...fontFamily.mono],
				display: ["Archivo", "Barlow Semi Condensed", ...fontFamily.sans],
			},
			width: {
				"form-sm": "360px",
				"form-md": "580px",
				"form-lg": "680px",
			},
			maxWidth: {
				"form-sm": "360px",
				"form-md": "580px",
				"form-lg": "680px",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				gradient: {
					to: {
						backgroundPosition: "var(--bg-size) 0",
					},
				},
				"shiny-text": {
					"0%, 90%, 100%": {
						"background-position": "calc(-100% - var(--shiny-width)) 0",
					},
					"30%, 60%": {
						"background-position": "calc(100% + var(--shiny-width)) 0",
					},
				},
				marquee: {
					from: {
						transform: "translateX(0)",
					},
					to: {
						transform: "translateX(calc(-50% - var(--marquee-gap, 2rem) / 2))",
					},
				},
				"cb-word": {
					"0%": {
						opacity: "0",
						transform: "translateY(0.42em) rotateX(-55deg)",
					},
					"100%": { opacity: "1", transform: "none" },
				},
				"cb-flow": {
					"0%": { transform: "translateX(-8%)", opacity: "0" },
					"12%": { opacity: "1" },
					"88%": { opacity: "1" },
					"100%": { transform: "translateX(108%)", opacity: "0" },
				},
				"cb-blink": {
					"0%, 49%": { opacity: "1" },
					"50%, 100%": { opacity: "0" },
				},
				// ErrorBoundary (VOID//SYS) effects — ported from @carbon/react.
				scan: {
					from: { transform: "translateY(-100%)" },
					to: { transform: "translateY(300%)" },
				},
				flicker: {
					"0%, 18%, 22%, 25%, 53%, 57%, 100%": { opacity: "1" },
					"20%, 24%, 55%": { opacity: "0.25" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				gradient: "gradient 8s linear infinite",
				"shiny-text": "shiny-text 8s infinite",
				marquee: "marquee var(--marquee-duration, 40s) linear infinite",
				"cb-word": "cb-word 0.55s cubic-bezier(0.2, 0.7, 0.2, 1)",
				"cb-flow": "cb-flow 5.5s linear infinite",
				"cb-blink": "cb-blink 1.1s step-end infinite",
				scan: "scan 6s linear infinite",
				flicker: "flicker 1.6s steps(1, end) infinite",
			},
			screens: {
				tall: {
					raw: "(min-height: 769px)",
				},
			},
			zIndex: {
				logo: 50,
				header: 999,
			},
		},
	},
	plugins: [
		require("@toolwind/corner-shape"),
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		require("tailwind-scrollbar"),
		require("tailwind-scrollbar-hide"),
	],
};
