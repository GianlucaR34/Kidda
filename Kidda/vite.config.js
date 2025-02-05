import { defineConfig } from "vite"; // Configuración base de Vite
import react from "@vitejs/plugin-react"; // Plugin de React para Vite
import { viteStaticCopy } from "vite-plugin-static-copy"; // Importa el plugin de copia estática

export default defineConfig({
  plugins: [
    react(), // Agrega el plugin de React
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/pdfjs-dist/build/pdf.worker.min.js", // Ruta del archivo en node_modules
          dest: "" // Destino en la carpeta dist
        }
      ]
    })
  ]
});