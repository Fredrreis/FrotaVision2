"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
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
  1: [
    "NOTIFICAÇÕES",
    "VEÍCULOS",
    "MANUTENÇÕES",
    "MOTORISTAS",
    "VIAGENS",
    "USUÁRIOS",
    "AJUDA",
  ], // Admin
  2: [
    "NOTIFICAÇÕES",
    "VEÍCULOS",
    "MANUTENÇÕES",
    "MOTORISTAS",
    "VIAGENS",
    "AJUDA",
  ], // Coordenador de frotas
  3: ["NOTIFICAÇÕES", "VEÍCULOS", "MANUTENÇÕES", "AJUDA"], // Gestor de Manutenções
  4: ["VEÍCULOS", "MOTORISTAS", "VIAGENS", "AJUDA"], // Administrador de Viagens
};

export const Ferramentas: React.FC = () => {
  const [paginaAtiva, setPaginaAtiva] = useState("NOTIFICAÇÕES");
  const [paginaRenderizada, setPaginaRenderizada] = useState("NOTIFICAÇÕES");
  const [isMobile, setIsMobile] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);
  const { data: session, status } = useSession();
  const idPermissao =
    typeof session?.user?.permissao === "number" ? session.user.permissao : 0;
  const menuPermitido = useMemo(
    () => permissoesMenu[idPermissao] || [],
    [idPermissao]
  );

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
  }, [idPermissao, paginaAtiva, menuPermitido]);

  // Delay para desmontar componente antigo antes de montar o novo
  useEffect(() => {
    if (paginaRenderizada !== paginaAtiva) {
      setPaginaRenderizada("");
      const timeout = setTimeout(() => {
        setPaginaRenderizada(paginaAtiva);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [paginaAtiva, paginaRenderizada]);

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

    switch (paginaRenderizada) {
      case "VEÍCULOS":
        componente = <Veiculos key="VEICULOS" />;
        break;
      case "MOTORISTAS":
        componente = <Motoristas key="MOTORISTAS" />;
        break;
      case "MANUTENÇÕES":
        componente = <Manutencoes key="MANUTENCOES" />;
        break;
      case "VIAGENS":
        componente = <Viagens key="VIAGENS" />;
        break;
      case "USUÁRIOS":
        componente = <Usuarios key="USUARIOS" />;
        break;
      case "NOTIFICAÇÕES":
        componente = <Notificacoes key="NOTIFICACOES" />;
        break;
      case "AJUDA":
        componente = <Ajuda key="AJUDA" />;
        break;
      default:
        componente = null;
    }

    return componente;
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
