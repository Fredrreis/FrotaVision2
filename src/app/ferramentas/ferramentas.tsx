"use client";

import React, { useState, useEffect } from "react";
import MenuFerramentas from "./components/menu/menu";
import { Box } from "@mui/material";
import "./ferramentas.css";

import Notificacoes from "./components/notificacoes/notificacoes";
import Veiculos from "./components/veiculos/veiculos";
import Motoristas from "./components/motoristas/motoristas";
import Manutencoes from "./components/manutencoes/manutencoes";
import Viagens from "./components/viagens/viagens";
import Usuarios from "./components/usuarios/usuarios";

import { AnimatePresence, motion } from "framer-motion";

export const Ferramentas: React.FC = () => {
  const [paginaAtiva, setPaginaAtiva] = useState("NOTIFICAÇÕES");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = (pagina: string) => {
    setPaginaAtiva(pagina);
  };

  const renderizarConteudo = () => {
    let componente: React.ReactNode;

    switch (paginaAtiva) {
      case "VEÍCULOS":
        componente = <Veiculos />;
        break;
      case "MOTORISTAS":
        componente = <Motoristas />;
        break;
      case "MANUTENÇÕES":
        componente = <Manutencoes />;
        break;
      case "VIAGENS":
        componente = <Viagens />;
        break;
      case "USUÁRIOS":
        componente = <Usuarios />;
        break;
      case "NOTIFICAÇÕES":
        componente = <Notificacoes />;
        break;
      default:
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={paginaAtiva}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {componente}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Box className={`ferramentas-container ${isMobile ? "mobile" : ""}`}>
      <MenuFerramentas onMenuClick={handleMenuClick} />
      <Box className="conteudo-principal">{renderizarConteudo()}</Box>
    </Box>
  );
};
