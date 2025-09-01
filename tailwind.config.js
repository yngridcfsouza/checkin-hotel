/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      blue: {
        DEFAULT: '#031324', // Azul escuro principal
        hover: '#12314B', // Azul intermediário para hover
        text: '#F5F5F7', // Para textos claros sobre azul
      },
      red: {
        DEFAULT: '#BE542B', // Vermelho coral
        hover: '#D36A44', // Hover mais vivo
        text: '#FFFFFF', // Texto sobre secundário
      },
      bg: {
        DEFAULT: '#F5F5F7', // Fundo geral
        card: '#FFFFFF', // Fundo de cards
        border: '#DADADA', // Bordas suaves
      },
      text: {
        primary: '#1A1A1A', // Texto principal
        secondary: '#4B4B4B', // Texto secundário
        error: '#EF4444', // Alert / Erro
        success: '#10B981', // Sucesso / Confirmação
      }
    },
    borderRadius: {
      DEFAULT: '0.5rem', // Bordas padrão mais arredondadas
    },
    boxShadow: {
      card: '0 4px 6px rgba(0,0,0,0.1)', // Sombra leve para cards
    },
  },
};
export const plugins = [];
