const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                "background-position-spin":
                    "background-position-spin 3000ms infinite alternate",
            },
            keyframes: {
                "background-position-spin": {
                    "0%": { backgroundPosition: "top center" },
                    "100%": { backgroundPosition: "bottom center" },
                },
            },
        },
    },
    darkMode: "class",
    plugins: [heroui()],
};
