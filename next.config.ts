import type { NextConfig } from "next";
 
const nextConfig: NextConfig = {
  // Necessário para o Docker: gera um build mínimo e autossuficiente
  // em .next/standalone, sem precisar copiar node_modules inteiro.
  output: "standalone",
};
 
export default nextConfig; 