/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary)',
                    dark: 'var(--primary-dark)',
                    light: 'var(--primary-light)',
                    glow: 'var(--primary-glow)',
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    dark: 'var(--secondary-dark)',
                    light: 'var(--secondary-light)',
                },
                accent: {
                    blue: 'var(--accent-blue)',
                    purple: 'var(--accent-purple)',
                    green: 'var(--accent-green)',
                }
            },
        },
    },
    plugins: [],
}
