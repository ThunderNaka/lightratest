import tailwindcss from "@headlessui/tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}",
    "../../packages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}",
  ],
  theme: {
    screens: {
      // These are the default media queries.
      // We're declaring them to make it easier to import and use in react for js checks
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: {
          50: "#9AA1BA",
          100: "#8C92AB",
          200: "#70768C",
          300: "#54596C",
          400: "#383D4D",
          500: "#1C202E",
          600: "#161A25",
          700: "#11131C",
          800: "#0B0D12",
          900: "#060609",
          DEFAULT: "#1C202E",
        },
        "primary-dark": {
          50: "#E8EBF3",
          100: "#D2D7E6",
          200: "#A5AFCD",
          300: "#7786B4",
          400: "#4A5E9B",
          500: "#1D3682",
          600: "#172B68",
          700: "#11204E",
          800: "#0C1634",
          900: "#060B1A",
          DEFAULT: "#1D3682",
        },
        "primary-white": {
          50: "#FEFEFF",
          100: "#FDFEFF",
          200: "#FCFCFF",
          300: "#FAFBFF",
          400: "#F9F9FF",
          500: "#F7F8FF",
          600: "#C6C6CC",
          700: "#949599",
          800: "#636366",
          900: "#505050",
          DEFAULT: "#F7F8FF",
        },
        "complementary-pink": {
          50: "#FCE5F0",
          100: "#FACCE0",
          200: "#F499C2",
          300: "#EF66A3",
          400: "#E93385",
          500: "#E40066",
          600: "#B60052",
          DEFAULT: "#E40066",
        },
        "complementary-orange": {
          50: "#FDEFEA",
          100: "#FBDFD4",
          200: "#F7BFA9",
          300: "#F39E7E",
          400: "#EF7E53",
          500: "#EB5E28",
          600: "#BC4B20",
          DEFAULT: "#EB5E28",
        },
        "complementary-green": {
          50: "#EDFBF3",
          100: "#DCF7E7",
          200: "#B8F0CF",
          300: "#95E8B6",
          400: "#71E19E",
          500: "#4ED986",
          600: "#3EAE6B",
          900: "#14532D",
          DEFAULT: "#4ED986",
        },
        "complementary-blue": {
          50: "#E7F6FF",
          100: "#CFEDFF",
          200: "#A0DBFF",
          300: "#70C8FF",
          400: "#41B6FF",
          500: "#11A4FF",
          600: "#0E83CC",
          DEFAULT: "#11A4FF",
        },
        "complementary-red": {
          50: "#FFE8E8",
          100: "#FFD2D0",
          200: "#FFA5A1",
          300: "#FF7773",
          400: "#FF4A44",
          500: "#FF1D15",
          600: "#CC1711",
          DEFAULT: "#FF1D15",
        },
        "complementary-yellow": {
          50: "#FFFEEC",
          100: "#FEFDD8",
          200: "#FEFBB1",
          300: "#FDF88B",
          400: "#FDF664",
          500: "#FCF43D",
          600: "#CAC331",
          DEFAULT: "#FCF43D",
        },
        "neutrals-dark": {
          200: "#9094A1",
          300: "#717685",
          400: "#535868",
          500: "#353A4B",
          900: "#1E1E1E",
          DEFAULT: "#353A4B",
        },
        "neutrals-medium": {
          0: "#FFFFFF",
          100: "#F9FAFB",
          200: "#DDDFE2",
          300: "#CDCED4",
          400: "#BCBEC5",
          500: "#ABAEB7",
          DEFAULT: "#ABAEB7",
        },
        "neutrals-light": {
          200: "#F3F4F5",
          300: "#EEEEF0",
          400: "#E8E9EB",
          500: "#E2E3E6",
          DEFAULT: "#E2E3E6",
        },
        "nostalgia-purple": {
          100: "#E6DEFE",
          200: "#F3F4F5",
          300: "#EEEEF0",
          400: "#A283FD",
          500: "#9471FD",
          600: "#875EFC",
          700: "#7445FC",
          800: "#5E28FA",
          900: "#4C19E1",
          DEFAULT: "#E2E3E6",
        },
        "alert-success": {
          100: "#B8EFD2",
          500: "#00C760",
          800: "#008E45",
          DEFAULT: "#00C760",
        },
        "alert-error": {
          100: "#FFBBB9",
          500: "#FF1D15",
          800: "#99110D",
          DEFAULT: "#FF1D15",
        },
        secondary: {
          50: "#F3EFFF",
          100: "#E7DFFE",
          200: "#CFBFFE",
          300: "#B79EFD",
          400: "#9F7EFD",
          500: "#875EFC",
          600: "#6C4BCA",
          700: "#513897",
          800: "#362665",
          900: "#4C19E1",
          DEFAULT: "#875EFC",
        },
        tertiary: {
          50: "#FAFCE8",
          100: "#F5FAD1",
          200: "#ECF5A2",
          300: "#E2EF74",
          400: "#D9EA45",
          500: "#CFE517",
          600: "#A6B712",
          700: "#7C890E",
          800: "#D6ED18",
          900: "#292E05",
          DEFAULT: "#CFE517",
        },
        white: "#FFFFFF",
        transparent: "transparent",
      },
      boxShadow: {
        md: "0px 4px 24px 0px rgba(172, 161, 161, 0.15), 0px 1px 8px 0px rgba(22, 22, 22, 0.05);",
        full: "0px 4px 8px 0px rgba(0, 0, 0, 0.05), 0px 4px 16px 0px rgba(0, 0, 0, 0.10)",
      },
      spacing: {
        "500": "31.25rem",
      },
    },
    keyframes: {
      spin: {
        to: {
          transform: "rotate(360deg)",
        },
      },
      ping: {
        "75%, 100%": {
          transform: "scale(2)",
          opacity: "0",
        },
      },
      pulse: {
        "50%": {
          opacity: ".5",
        },
      },
      bounce: {
        "0%, 100%": {
          transform: "translateY(-25%)",
          animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
        },
        "50%": {
          transform: "none",
          animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
        },
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
      none: "none",
      spin: "spin 1s linear infinite",
      ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      bounce: "bounce 1s infinite",
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
    },
  },
  safelist: [
    "text-black",
    "text-white",
    {
      pattern:
        /(bg|border|text|outline)-(gray|red|yellow|green|blue|indigo|purple|pink)-(100|200|300|400|500|600|700|800|900)/,
      variants: ["hover"],
    },
  ],
  plugins: [typography, forms, tailwindcss, animate],
} satisfies Config;
