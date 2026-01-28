module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        // MODIFICAR EL TEMA LIGHT
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#4f46e5",          // Cambia el azul por uno específico
          "primary-content": "#ffffff",   // Color del texto sobre el primary
          "base-100": "#ffffff",          // Tu "blanco" de fondo
          "base-200": "#f3f4f6",          // Gris muy claro para secciones
          "base-300": "#e5e7eb",          // Gris para bordes
          "--rounded-box": "1rem",        // Puedes cambiar hasta la redondez
        },
        // MODIFICAR EL TEMA DIM
        dim: {
          ...require("daisyui/src/theming/themes")["dim"],
          "primary": "#6366f1",          // Un primary más brillante para el fondo oscuro
          "base-100": "#15191e",          // El fondo oscuro del tema Dim
          "base-content": "#ced4da",      // El color del texto
        },
      },
    ],
  },

}
