// src/app/components/perfil-modal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

import ModalFormulario from "../../../components/formulario-modal/formulario-generico";
import SenhaForte from "@/app/components/senha-status/senha-status";
import useToggleSenha from "@/app/components/toggle-senha/toggle-senha";

import { pesquisarEmpresa, Empresa } from "@/api/services/empresaService";
import { atualizarUsuario, Usuario } from "@/api/services/usuarioService";

import "./perfil-modal.css";

interface PerfilDados {
  nome: string;
  email: string;
  empresa: string;
  cargo: string;
  novaSenha: string;
  confirmarSenha: string;
  [key: string]: unknown;
}

interface PerfilModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PerfilModal({ open, onClose }: PerfilModalProps) {
  const { data: session } = useSession();

  // Estado principal do formulário
  const [dados, setDados] = useState<PerfilDados>({
    nome: "",
    email: "",
    empresa: "",
    cargo: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  // Indica se o usuário clicou em "Editar senha"
  const [editarSenha, setEditarSenha] = useState(false);

  // Hooks para alternar visibilidade das senhas
  const { mostrarSenha: mostrarNovaSenha, adornment: adornmentNovaSenha } =
    useToggleSenha();
  const {
    mostrarSenha: mostrarConfirmarSenha,
    adornment: adornmentConfirmarSenha,
  } = useToggleSenha();

  // Dialog que força logout após sucesso na edição
  const [sucessoDialogOpen, setSucessoDialogOpen] = useState(false);

  // Converte código numérico de permissão para texto
  const traduzirCargo = (permissao: number) => {
    if (permissao === 1) return "Admin";
    if (permissao === 2) return "Coordenador de Manutenções";
    if (permissao === 3) return "Gestor de Viagens";
    return "—";
  };

  // Ao montar, preenche nome, email, cargo e busca nome da empresa
  useEffect(() => {
    if (!session?.user) return;

    const nomeUsuario = session.user.nome || "Sem nome";
    const emailUsuario = session.user.email || "Sem email";
    const permissoes = (session.user.permissao as number) || 0;
    const cnpjUsuario = (session.user.cnpj as string) || "";

    setDados((prev) => ({
      ...prev,
      nome: nomeUsuario,
      email: emailUsuario,
      cargo: traduzirCargo(permissoes),
      empresa: "", // será preenchido abaixo
      novaSenha: "",
      confirmarSenha: "",
    }));

    // Busca nome_social da empresa pela API
    if (cnpjUsuario) {
      pesquisarEmpresa(cnpjUsuario)
        .then((res: Empresa) => {
          setDados((prev) => ({
            ...prev,
            empresa: res.nome_social || "—",
          }));
        })
        .catch(() => {
          setDados((prev) => ({
            ...prev,
            empresa: "—",
          }));
        });
    } else {
      setDados((prev) => ({
        ...prev,
        empresa: "—",
      }));
    }
  }, [session]);

  // Atualiza qualquer campo do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDados((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Ao clicar em "Salvar", monta payload e faz PUT
  const handleSalvar = async () => {
    if (!session?.user) {
      onClose();
      return;
    }

    const idUsuario = session.user.id as number;
    const novaSenhaTxt = dados.novaSenha.trim();

    // Monta o payload conforme Swagger /Usuario/Atualizar/{id}
    const payload: Partial<Usuario> = {
      id_usuario: idUsuario,
      nome_usuario: dados.nome,
      email: dados.email,
      cnpj: session.user.cnpj as string,
      permissoes_usuario: session.user.permissao as number,
      habilitado: true,
      data_cadastro: (session.user as any).data_cadastro
        ? String((session.user as any).data_cadastro)
        : new Date().toISOString(),
    };

    // Se o usuário optou por editar a senha, inclui no payload
    if (editarSenha && novaSenhaTxt.length > 0) {
      (payload as Usuario).senha = novaSenhaTxt;
    }

    try {
      await atualizarUsuario(idUsuario, payload as Usuario);
      // Se sucesso, abre diálogo de logout forçado
      setSucessoDialogOpen(true);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      onClose();
    }
  };

  // Colunas fixas do modal
  const colunasBase = [
    { chave: "nome", titulo: "Nome" },
    { chave: "email", titulo: "Email" },
    { chave: "empresa", titulo: "Empresa", desativado: true },
    { chave: "cargo", titulo: "Cargo", desativado: true },
  ];

  // Checkbox “Editar senha”
  const colunaCheckbox = {
    chave: "__editarSenha",
    titulo: "",
    tipo: "custom" as const,
    componente: (
      <Box className="modal-form-group">
        <FormControlLabel
          control={
            <Checkbox
              checked={editarSenha}
              onChange={(e) => {
                setEditarSenha(e.target.checked);
                if (!e.target.checked) {
                  // Limpa campos de senha ao desmarcar
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

  // “Nova Senha” (uso da classe reduzida .senha-form-group)
  const colunaNovaSenha = {
    chave: "novaSenha",
    titulo: "Nova Senha",
    tipo: "custom" as const,
    componente: (
      <Box className="senha-form-group">
        <TextField
          label="Nova Senha"
          name="novaSenha"
          type={mostrarNovaSenha ? "text" : "password"}
          value={dados.novaSenha}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          size="small"
          className="modal-input"
          InputProps={{
            endAdornment: adornmentNovaSenha,
          }}
        />
        {/* Sem indicador de força aqui */}
      </Box>
    ),
  };

  // “Confirmar Nova Senha” (também usando .senha-form-group)
  const colunaConfirmarSenha = {
    chave: "confirmarSenha",
    titulo: "Confirmar Nova Senha",
    tipo: "custom" as const,
    componente: (
      <Box className="senha-form-group">
        <TextField
          label="Confirmar Nova Senha"
          name="confirmarSenha"
          type={mostrarConfirmarSenha ? "text" : "password"}
          value={dados.confirmarSenha}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          size="small"
          className="modal-input"
          InputProps={{
            endAdornment: adornmentConfirmarSenha,
          }}
        />
        {/* Indicador de força somente aqui */}
        <SenhaForte senha={dados.confirmarSenha} />
      </Box>
    ),
  };

  // Monta array final de colunas
  const colunas = [
    ...colunasBase,
    colunaCheckbox,
    ...(editarSenha ? [colunaNovaSenha, colunaConfirmarSenha] : []),
  ];

  return (
    <>
      {/* ─── ModalPrincipal: Formulário de perfil ──────────────────────── */}
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
          <AccountCircle className="perfil-avatar" />
        </Box>
      </ModalFormulario>

      {/* ─── Dialog de sucesso que obriga logout ──────────────────────── */}
      <Dialog
        open={sucessoDialogOpen}
        // Impede fechar por ESC ou clicando fora
        onClose={(_e, reason) => {
          if (reason === "backdropClick" || reason === "escapeKeyDown") {
            return;
          }
        }}
        disableEscapeKeyDown
      >
        <DialogTitle>Perfil Atualizado</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Seus dados foram alterados com sucesso. Para aplicar as mudanças, é
            preciso refazer o login. <strong>Você será deslogado</strong> ao
            confirmar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Chama signOut e redireciona para /auth/login
              signOut({ callbackUrl: "/auth/login" });
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
