/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './client/**/*.{html,js}',
        './client/index.html'
    ],
    darkMode: 'media',
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('daisyui')
    ],
}
