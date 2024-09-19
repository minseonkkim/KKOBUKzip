/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "dnf-bitbit": ["DNFBitBitv2"],
        KoPubDotum: ["KoPub Dotum"],
        stardust: ["PFStardust"],
      },
      keyframes: {
        "modal-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "modal-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        "modal-down": "modal-down 0.3s ease-out",
        "modal-up": "modal-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
