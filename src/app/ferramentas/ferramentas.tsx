"use client";

import React, { useState, useEffect } from "react";
import MenuFerramentas from "./components/menu/menu";
import { Box } from "@mui/material";
import "./ferramentas.css";

import Notificacoes from "./components/notificacoes/notificacoes";
import Veiculos from "./components/veiculos/veiculos";
import Motoristas from "./components/motoristas/motoristas";

export const Ferramentas: React.FC = () => {
  const [paginaAtiva, setPaginaAtiva] = useState("NOTIFICAÇÕES");
  const [isMobile, setIsMobile] = useState(false);

  // Detecta quando a tela fica menor que 768px
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Atualiza a página ativa ao clicar no menu
  const handleMenuClick = (pagina: string) => {
    setPaginaAtiva(pagina);
  };

  // Renderiza o conteúdo correto baseado no menu selecionado
  const renderizarConteudo = () => {
    switch (paginaAtiva) {
      case "CAMINHÕES":
        return <Veiculos />;
      case "MOTORISTAS":
        return <Motoristas />;
      default:
        return <Notificacoes />; // Página padrão
    }
  };

  return (
    <Box className={`ferramentas-container ${isMobile ? "mobile" : ""}`}>
      <MenuFerramentas onMenuClick={handleMenuClick} />
      <Box className="conteudo-principal">{renderizarConteudo()}</Box>
    </Box>
  );
};
