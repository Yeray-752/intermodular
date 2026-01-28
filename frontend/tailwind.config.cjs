// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      {
        sunset: {
          primary: "#6366f1",
          "primary-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#D93F0F",
          "base-300": "#b8320c",
          "base-content": "#1f2937",
        },
      },
    ],
  },
}
