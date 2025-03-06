/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ Next.js App Router 지원
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: "#C19A6B", // 연한 갈색
        orangeAccent: "#FF8C00", // 오렌지 색상
        backgroundGray: "#F5F5F5", // 연한 회색
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        24: "6rem",
      },
      minHeight: {
        screen: "100vh",
        90: "90vh",
      },
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
};

