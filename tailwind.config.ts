import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/config/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          700: "#24486f",
          900: "#163353",
          950: "#0f2744"
        }
      },
      fontFamily: {
        sans: [
          "Manrope",
          "Avenir Next",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        display: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Book Antiqua",
          "Georgia",
          "Times New Roman",
          "serif"
        ]
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 39, 68, 0.08)",
        premium: "0 32px 80px rgba(15, 39, 68, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
