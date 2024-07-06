import type { ConfigEnv, UserConfig } from 'vite';
import { defineConfig } from 'vite';
import { pluginExposeRenderer } from './vite.base.config';
import { resolve } from "path";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<'renderer'>;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
      rollupOptions: {
        input: {
          login_window: resolve(__dirname, "index.html"),
          display_reservation: resolve(__dirname, "html", "display_reservation.html"),
          rentalCar_handler: resolve(__dirname, "html", "rentalcar_handler.html"),
          rentalcar_status_handler: resolve(__dirname, "html", "rentalcar_status_handler.html"),
          reservation_handler: resolve(__dirname, "html", "reservation_handler.html"),
          loaner_rental_handler: resolve(__dirname, "html", "loaner_rental_handler.html")
        }
      }
    },
    plugins: [pluginExposeRenderer(name)],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    clearScreen: false,
  } as UserConfig;
});
