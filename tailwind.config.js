/** @type {import('tailwindcss').Config} */
export default {
  content: ["./ui/auth/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
