/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/auth/*.html"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
