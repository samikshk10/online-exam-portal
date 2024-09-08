/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            backgroundImage: (theme) => ({
                'custom-gradient':
                    'linear-gradient(225deg, hsla(0, 20%, 96%, 1) 32%, hsla(220, 42%, 57%, 1) 100%)',
            }),
            fontFamily: {
                sans: ['Nunito', 'sans-serif'],
            },
            fontSize: {
                h1: ['2em', { lineHeight: '1.2' }],
                h2: ['1.5em', { lineHeight: '1.3' }],
                h3: ['1.17em', { lineHeight: '1.4' }],
                h4: ['1em', { lineHeight: '1.5' }],
                h5: ['0.83em', { lineHeight: '1.6' }],
                h6: ['0.67em', { lineHeight: '1.7' }],
            },
            fontWeight: {
                h: 'bold',
            },
            margin: {
                h: '0.67em 0',
            },
        },
    },
    plugins: [],
};
