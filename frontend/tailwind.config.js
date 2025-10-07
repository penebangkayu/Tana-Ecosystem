/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  darkMode: 'class', // tetap aktif, biar bisa pakai class="dark"
  theme: {
    extend: {
      colors: {
        // Tambahkan warna utama
        primary: '#603abd', // Ungu utama
        background: '#000000', // Latar belakang hitam
        text: '#ffffff', // Teks putih default
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '50%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-3px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        'html': { backgroundColor: theme('colors.background') },
        'body': { color: theme('colors.text') },
        'a': { color: theme('colors.primary') },
        'h1, h2, h3, h4, h5, h6': { color: theme('colors.primary') },
      });
    },
  ],
}
