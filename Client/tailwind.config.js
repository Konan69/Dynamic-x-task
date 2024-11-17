/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        baseform: "#1010104D",
        bgcolor: "#040404",
        authborder: "#2C2626",
        baseborder: "#75F94C1A",
        btn: "#75F94C",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
