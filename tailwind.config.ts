import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 
          {
            "50": "#f9fafb",    // Very light black, almost white
            "100": "#f3f4f6",   // Very light gray
            "200": "#e5e7eb",   // Light gray
            "300": "#d1d5db",   // Gray
            "400": "#9ca3af",   // Medium gray
            "500": "#6b7280",   // Dark gray
            "600": "#4b5563",   // Darker gray
            "700": "#374151",   // Dark grayish black
            "800": "#1f2937",   // Very dark black
            "900": "#111827",   // Near black
            "950": "#0a0e13"    // Almost pure black
          },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    fontFamily: {
      'body': [
    'Inter', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ],
  'sans': [
    'Inter', 
    'ui-sans-serif', 
    'system-ui', 
    '-apple-system', 
    'system-ui', 
    'Segoe UI', 
    'Roboto', 
    'Helvetica Neue', 
    'Arial', 
    'Noto Sans', 
    'sans-serif', 
    'Apple Color Emoji', 
    'Segoe UI Emoji', 
    'Segoe UI Symbol', 
    'Noto Color Emoji'
  ]
}
      
  },
  plugins: [],
};
export default config;
