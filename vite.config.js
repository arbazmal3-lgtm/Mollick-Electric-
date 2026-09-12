import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          projects: path.resolve(__dirname, 'projects.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          admin_login: path.resolve(__dirname, 'admin/index.html'),
          admin_dashboard: path.resolve(__dirname, 'admin/dashboard.html'),
          admin_services: path.resolve(__dirname, 'admin/services.html'),
          admin_projects: path.resolve(__dirname, 'admin/projects.html'),
          admin_gallery: path.resolve(__dirname, 'admin/gallery.html'),
          admin_messages: path.resolve(__dirname, 'admin/messages.html'),
          admin_settings: path.resolve(__dirname, 'admin/settings.html'),
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
