/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      spacing: {
        container: "var(--container-padding)",
        upbar: "var(--upbar-height)",
      },
      container: {
        screens: {
          "2xl": "1536px",
        },
        padding: "var(--container-padding)",
        center: true,
      },
      transitionDuration: {
        DEFAULT: "var(--transition-duration, 300ms)",
      },

      borderRadius: {
        DEFAULT: "var(--border-radius)",
        sm: "var(--border-radius-sm)",
        md: "var(--border-radius-md)",
        lg: "var(--border-radius-lg)",
        xl: "var(--border-radius-xl)",
        "2xl": "var(--border-radius-2xl)",
        "3xl": "var(--border-radius-3xl)",
      },
    },
  },
  plugins: [],
};
