/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-nunito-sans)"],
            },
            colors: {
                "hk-grey": "#151515",
                "hk-grey-hover": "#1e1e1e",
                "hk-grey-light": "#313131",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
