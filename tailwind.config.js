/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
