import { defineConfig } from "vite"; // Configuración base de Vite
import react from "@vitejs/plugin-react"; // Plugin de React para Vite
import { viteStaticCopy } from "vite-plugin-static-copy"; // Importa el plugin de copia estática

export default defineConfig({
  plugins: [
    react(), // Agrega el plugin de React
    // Eliminar el bloque de copia estática relacionado con el worker JS
  ]
});
