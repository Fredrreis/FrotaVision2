"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import MenuFerramentas from "./components/menu/menu";
import Notificacoes from "./components/notificacoes/notificacoes";
import Veiculos from "./components/veiculos/veiculos";
import Motoristas from "./components/motoristas/motoristas";
import Manutencoes from "./components/manutencoes/manutencoes";
import Viagens from "./components/viagens/viagens";
import Usuarios from "./components/usuarios/usuarios";
import Ajuda from "./components/ajuda/ajuda";
import "./ferramentas.css";
import { useSession } from "next-auth/react";
import Carregamento from "@/app/components/carregamento/carregamento";

export const permissoesMenu: { [key: number]: string[] } = {
  0: [
    "NOTIFICAÇÕES",
    "VEÍCULOS",
    "MANUTENÇÕES",
    "MOTORISTAS",
    "VIAGENS",
    "USUÁRIOS",
    "AJUDA",
  ], // Admin
  1: [
    "NOTIFICAÇÕES",
    "VEÍCULOS",
    "MANUTENÇÕES",
    "MOTORISTAS",
    "VIAGENS",
    "AJUDA",
  ], // Coordenador de frotas
  2: ["NOTIFICAÇÕES", "VEÍCULOS", "MANUTENÇÕES", "AJUDA"], // Gestor de Manutenções
  3: ["VEÍCULOS", "MOTORISTAS", "VIAGENS", "AJUDA"], // Administrador de Viagens
};

export const Ferramentas: React.FC = () => {
  const [paginaAtiva, setPaginaAtiva] = useState("NOTIFICAÇÕES");
  const [isMobile, setIsMobile] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);
  const { data: session, status } = useSession();
  const idPermissao =
    typeof session?.user?.permissao === "number" ? session.user.permissao : 0;
  const menuPermitido = permissoesMenu[idPermissao] || [];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setMenuVisible(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuPermitido.includes(paginaAtiva)) {
      setPaginaAtiva(menuPermitido[0] || "NOTIFICAÇÕES");
    }
  }, [idPermissao, paginaAtiva]);

  const handleMenuClick = (pagina: string) => {
    if (menuPermitido.includes(pagina)) {
      setPaginaAtiva(pagina);
    }
  };

  const renderizarConteudo = () => {
    if (!menuPermitido.includes(paginaAtiva)) {
      return (
        <Box p={4} textAlign="center">
          <h2>Acesso não permitido</h2>
          <p>Você não tem permissão para acessar esta funcionalidade.</p>
        </Box>
      );
    }
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
      case "AJUDA":
        componente = <Ajuda />;
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

  if (status === "loading") {
    return <Carregamento animationUrl="/lotties/carregamento_pagina.json" />;
  }

  return (
    <Box className={`ferramentas-container ${isMobile ? "mobile" : ""}`}>
      <MenuFerramentas
        onMenuClick={handleMenuClick}
        visible={menuVisible}
        onToggleMenu={() => setMenuVisible((prev) => !prev)}
      />
      <Box className="conteudo-principal">{renderizarConteudo()}</Box>
    </Box>
  );
};
