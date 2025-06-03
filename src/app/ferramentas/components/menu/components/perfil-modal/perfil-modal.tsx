"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import ModalFormulario from "../../../components/formulario-modal/formulario-generico";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./perfil-modal.css";

interface PerfilDados {
  nome: string;
  email: string;
  empresa: string;
  cargo: string;
  novaSenha?: string;
  confirmarSenha?: string;
  [key: string]: unknown;
}

interface PerfilModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PerfilModal({ open, onClose }: PerfilModalProps) {
  const { data: session } = useSession();

  const [dados, setDados] = useState<PerfilDados>({
    nome: session?.user?.nome || "Sem nome",
    email: session?.user?.email || "Sem email",
    empresa: "EMPRESA 1",
    cargo: "Admin",
  });

  const [mostrarCamposSenha, setMostrarCamposSenha] = useState(false);

  const handleSalvar = () => {
    console.log("Salvar perfil", dados);
    onClose();
  };

  const colunasBase = [
    { chave: "nome", titulo: "Nome" },
    { chave: "email", titulo: "Email" },
    { chave: "empresa", titulo: "Empresa", desativado: true },
    { chave: "cargo", titulo: "Cargo", desativado: true },
  ];

  const camposSenha = [
    { chave: "novaSenha", titulo: "Nova Senha" },
    { chave: "confirmarSenha", titulo: "Confirmar Nova Senha" },
  ];

  const colunaCheckboxSenha = {
    chave: "__checkboxSenha",
    titulo: "",
    tipo: "custom",
    componente: (
      <Box className="modal-form-group">
        <FormControlLabel
          control={
            <Checkbox
              checked={mostrarCamposSenha}
              onChange={(e) => {
                setMostrarCamposSenha(e.target.checked);
                if (!e.target.checked) {
                  setDados((prev) => ({
                    ...prev,
                    novaSenha: "",
                    confirmarSenha: "",
                  }));
                }
              }}
              size="small"
            />
          }
          label="Editar senha"
          className="perfil-editar-senha-checkbox"
        />
      </Box>
    ),
  };

  const colunas = [
    ...colunasBase,
    colunaCheckboxSenha,
    ...(mostrarCamposSenha ? camposSenha : []),
  ];

  return (
    <ModalFormulario
      open={open}
      onClose={onClose}
      onSalvar={handleSalvar}
      colunas={colunas}
      dados={dados}
      setDados={setDados}
      modoEdicao={true}
      ocultarCabecalho={true}
    >
      <Box className="perfil-container">
        <AccountCircleIcon className="perfil-avatar" />
      </Box>
    </ModalFormulario>
  );
}
