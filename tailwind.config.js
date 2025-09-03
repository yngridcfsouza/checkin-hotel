/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#275f8c', // Cor principal
          100: '#e2efff',
          200: '#bfd3f2',
          300: '#9ab9e4',
          400: '#4e8ccc',
          500: '#3576b2',
          600: '#275f8c',
          700: '#193f65',
          800: '#0a223f',
          900: '#000a1a',
        },
        blue: {
          DEFAULT: '#275f8c', // Cor principal baseada em #275f8c
          50: '#e2efff',
          100: '#bfd3f2',
          200: '#9ab9e4',
          300: '#73a1d8',
          400: '#4e8ccc',
          500: '#3576b2',
          600: '#275f8c', // Cor principal
          700: '#193f65',
          800: '#0a223f',
          900: '#000a1a',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        back: {
          DEFAULT: '#f8fafc', // Fundo geral
          card: '#ffffff', // Fundo de cards
          border: '#e2e8f0', // Bordas suaves
        },
        text: {
          primary: '#1e293b', // Texto principal
          secondary: '#475569', // Texto secundário
          error: '#ef4444', // Alert / Erro
          success: '#10b981', // Sucesso / Confirmação
        }
      },
      borderRadius: {
        DEFAULT: '0.5rem', // Bordas padrão mais arredondadas
      },
      boxShadow: {
        card: '0 4px 6px rgba(0,0,0,0.05)', // Sombra leve para cards
        hover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
