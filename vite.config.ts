import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Remove duplicate JWT token headers to prevent 431 errors
            if (proxyReq.getHeader('jwt-token')) {
              proxyReq.removeHeader('jwt-token');
            }
            if (proxyReq.getHeader('JWT-Token')) {
              proxyReq.removeHeader('JWT-Token');
            }
            
            // Also remove other large headers if needed
            const userAgent = proxyReq.getHeader('user-agent');
            if (userAgent && typeof userAgent === 'string' && userAgent.length > 200) {
              proxyReq.removeHeader('user-agent');
            }
          });
        }
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
