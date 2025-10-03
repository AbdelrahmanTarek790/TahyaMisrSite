import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// import { beasties } from "vite-plugin-beasties"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            // Ensure compatibility with React 19
            jsxRuntime: "automatic",
        }),
        tailwindcss(),
        // beasties({
        //     // optional beasties configuration
        //     options: {
        //         preload: "swap",
        //     },
        // }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        // Enable tree-shaking and optimize imports

        // Minimize bundle size
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ["react", "react-dom", "react-router-dom", "lucide-react"],
        exclude: ["@radix-ui/react-navigation-menu", "motion", "motion/react"],
        force: true, // Force re-optimization to clear any cached issues
    },
})
