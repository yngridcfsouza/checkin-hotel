/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    fontFamily: {
      sans: ['Raleway', 'sans-serif'],
    },
    colors: {
      blue: {
        DEFAULT: '#275f8c', // Cor principal baseada em #275f8c
        50: '#f0f7fc',
        100: '#d8ebf7',
        200: '#b3d7ef',
        300: '#8ec3e6',
        400: '#6ba5d1',
        500: '#3a7eaf',
        600: '#275f8c', // Cor principal
        700: '#1a4269',
        800: '#0e2946',
        900: '#051423',
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
      bg: {
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
};
export const plugins = [];
