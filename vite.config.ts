import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'lucide-icons': ['lucide-react'],
          'admin': [
            './src/pages/admin/LoginPage.tsx',
            './src/pages/admin/DashboardPage.tsx',
            './src/pages/admin/ProjectsPage.tsx',
            './src/pages/admin/EventsPage.tsx',
            './src/pages/admin/StoriesPage.tsx',
            './src/pages/admin/MediaPage.tsx',
            './src/pages/admin/SubscriptionsPage.tsx',
            './src/pages/admin/ContactsPage.tsx',
            './src/components/admin/AdminGuard.tsx',
            './src/components/admin/AdminSidebar.tsx',
          ],
          'pages': [
            './src/pages/ProgramsPage.tsx',
            './src/pages/StoriesPage.tsx',
            './src/pages/EventsPage.tsx',
            './src/pages/DonatePage.tsx',
          ],
        },
      },
    },
  },
});
