// src/app/components/perfil-modal.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import {
  atualizarUsuario,
  UsuarioPayload,
} from "@/api/services/usuarioService";

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

  // Schema dinâmico baseado no estado editarSenha
  const schema = useMemo(() => {
    return yup.object().shape({
      nome: yup.string().required("Nome obrigatório"),
      email: yup
        .string()
        .email("E-mail inválido")
        .required("E-mail obrigatório"),
      novaSenha: editarSenha
        ? yup
            .string()
            .min(6, "Mínimo de 6 caracteres")
            .required("Senha obrigatória")
        : yup.string().notRequired(),
      confirmarSenha: editarSenha
        ? yup
            .string()
            .oneOf([yup.ref("novaSenha")], "As senhas devem ser iguais")
            .required("Confirme a senha")
        : yup.string().notRequired(),
    });
  }, [editarSenha]);

  // Criar resolver com schema dinâmico
  const resolver = useMemo(() => yupResolver(schema), [schema]);

  // Hook de validação com react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    clearErrors,
    trigger,
    setValue,
  } = useForm({
    resolver,
    mode: "onSubmit",
    defaultValues: {
      nome: "",
      email: "",
      novaSenha: "",
      confirmarSenha: "",
    },
  });

  // Sempre que editarSenha mudar, atualiza a validação
  useEffect(() => {
    trigger();
  }, [editarSenha, trigger]);

  // Gerencia o estado do modal (abrir/fechar)
  useEffect(() => {
    if (open && session?.user) {
      // Modal abriu - carrega dados do usuário e reseta formulário
      const nomeUsuario = session.user.nome || "";
      const emailUsuario = session.user.email || "";
      const permissoes = (session.user.permissao as number) || 0;
      const cnpjUsuario = (session.user.cnpj as string) || "";

      // Reseta o formulário com os dados do usuário
      reset({
        nome: nomeUsuario,
        email: emailUsuario,
        novaSenha: "",
        confirmarSenha: "",
      });

      // Atualiza dados locais (empresa e cargo)
      setDados({
        nome: nomeUsuario,
        email: emailUsuario,
        cargo: traduzirCargo(permissoes),
        empresa: "", // será preenchido pela API
        novaSenha: "",
        confirmarSenha: "",
      });

      // Reseta estado de editar senha
      setEditarSenha(false);

      // Busca empresa
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
    } else if (!open) {
      // Modal fechou - limpa tudo
      clearErrors();
      setEditarSenha(false);
    }
  }, [open, session, reset, clearErrors]);

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

  // Validação e salvamento
  const handleSalvar = async (formData: unknown) => {
    if (!session?.user) {
      onClose();
      return;
    }

    const { nome, email, novaSenha } = formData as PerfilDados;
    const idUsuario = session.user.id as number;
    const novaSenhaTxt = novaSenha?.trim() || "";

    // Monta o payload conforme Swagger /Usuario/Atualizar/{id}
    const payload: Partial<UsuarioPayload> = {
      id_usuario: idUsuario,
      nome_usuario: nome,
      email: email,
      cnpj: session.user.cnpj as string,
      permissoes_usuario: session.user.permissao as number,
      habilitado: true,
      data_cadastro: (session.user as { data_cadastro?: string }).data_cadastro
        ? String((session.user as { data_cadastro?: string }).data_cadastro)
        : undefined,
    };

    // Se o usuário optou por editar a senha, inclui no payload
    if (editarSenha && novaSenhaTxt.length > 0) {
      (payload as UsuarioPayload).senha = novaSenhaTxt;
    }

    try {
      await atualizarUsuario(idUsuario, payload as UsuarioPayload);
      // Se sucesso, abre diálogo de logout forçado
      setSucessoDialogOpen(true);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      onClose();
    }
  };

  // Colunas fixas do modal
  const colunasBase = [
    {
      chave: "nome",
      titulo: "Nome",
      tipo: "custom" as const,
      componente: (
        <TextField
          label="Nome"
          fullWidth
          variant="outlined"
          size="small"
          className="modal-input"
          {...register("nome")}
          error={!!errors.nome}
          helperText={errors.nome?.message}
        />
      ),
    },
    {
      chave: "email",
      titulo: "Email",
      tipo: "custom" as const,
      componente: (
        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          size="small"
          className="modal-input"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      ),
    },
    { chave: "empresa", titulo: "Empresa", desativado: true },
    { chave: "cargo", titulo: "Cargo", desativado: true },
  ];

  // Checkbox "Editar senha"
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
                  setValue("novaSenha", "");
                  setValue("confirmarSenha", "");
                  clearErrors();
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

  // "Nova Senha" (uso da classe reduzida .senha-form-group)
  const colunaNovaSenha = {
    chave: "novaSenha",
    titulo: "Nova Senha",
    tipo: "custom" as const,
    componente: (
      <Box className="senha-form-group">
        <TextField
          label="Nova Senha"
          type={mostrarNovaSenha ? "text" : "password"}
          fullWidth
          variant="outlined"
          size="small"
          className="modal-input"
          {...register("novaSenha")}
          error={!!errors.novaSenha}
          helperText={errors.novaSenha?.message}
          InputProps={{
            endAdornment: adornmentNovaSenha,
          }}
        />
        {/* Sem indicador de força aqui */}
      </Box>
    ),
  };

  // "Confirmar Nova Senha" (também usando .senha-form-group)
  const colunaConfirmarSenha = {
    chave: "confirmarSenha",
    titulo: "Confirmar Nova Senha",
    tipo: "custom" as const,
    componente: (
      <Box className="senha-form-group">
        <TextField
          label="Confirmar Nova Senha"
          type={mostrarConfirmarSenha ? "text" : "password"}
          fullWidth
          variant="outlined"
          size="small"
          className="modal-input"
          {...register("confirmarSenha")}
          error={!!errors.confirmarSenha}
          helperText={errors.confirmarSenha?.message}
          InputProps={{
            endAdornment: adornmentConfirmarSenha,
          }}
        />
        {/* Indicador de força somente aqui */}
        <SenhaForte senha={watch("confirmarSenha") || ""} />
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
        onSalvar={handleSubmit(handleSalvar)}
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
