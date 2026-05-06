/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind solo genera CSS para las clases que REALMENTE usas en estos archivos
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Colores de la marca Cidium (extraídos de su sitio)
      colors: {
        cidium: {
          black:  '#0a0a0a',
          dark:   '#111111',
          gray:   '#1a1a1a',
          light:  '#f5f5f0',
          white:  '#ffffff',
          accent: '#e8e0d0',  // tono crema del sitio
          blue:   '#1a56db',  // azul de botones
          danger: '#e02424',
          success:'#057a55',
        },
      },
      fontFamily: {
        // Fuente principal del sitio
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
