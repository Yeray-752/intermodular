module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    'bg-base-100', 'bg-base-200', 'bg-base-300', 'text-base-content', 'text-base-100', 'text-base-200',
    'btn', 'btn-primary', 'btn-secondary', 'card', 'alert', 'badge'
  ],
  plugins: [require("daisyui")]
};