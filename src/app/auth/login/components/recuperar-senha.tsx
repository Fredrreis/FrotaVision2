"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { motion } from "framer-motion";
import useToggleSenha from "@/app/components/toggle-senha/toggle-senha";
import SenhaForte from "@/app/components/senha-status/senha-status";
import CustomSnackbar from "@/app/components/snackbar/snackbar";
import LockResetIcon from "@mui/icons-material/LockReset";
import "./recuperar-senha.css";
import {
  atualizarUsuario,
  pesquisarUsuarioPorEmail,
} from "@/api/services/usuarioService";

interface RecuperarSenhaProps {
  open: boolean;
  onClose: () => void;
}

export default function RecuperarSenha({ open, onClose }: RecuperarSenhaProps) {
  const [etapa, setEtapa] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const { mostrarSenha: mostrarNovaSenha, adornment: adornmentNovaSenha } =
    useToggleSenha();
  const {
    mostrarSenha: mostrarConfirmarSenha,
    adornment: adornmentConfirmarSenha,
  } = useToggleSenha();

  const handleSolicitarCodigo = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setEtapa(2);
        setOpenSuccess(true);
      } else {
        throw new Error("Erro ao enviar e-mail");
      }
    } catch {
      setMensagemErro("Erro ao enviar código. Verifique o e-mail informado.");
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificarCodigo = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });
      if (response.ok) {
        setEtapa(3);
        setOpenSuccess(true);
      } else {
        throw new Error("Código inválido ou expirado");
      }
    } catch {
      setMensagemErro("Código inválido ou expirado. Tente novamente.");
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async () => {
    if (novaSenha !== confirmarSenha) {
      setMensagemErro("As senhas não coincidem.");
      setOpenError(true);
      return;
    }

    setLoading(true);
    try {
      // Busca os dados completos do usuário pelo e-mail
      const usuario = await pesquisarUsuarioPorEmail(email);
      if (!usuario || !usuario.id_usuario) {
        throw new Error("Usuário não encontrado");
      }
      // Monta o payload com a nova senha
      const payload = {
        ...usuario,
        senha: novaSenha,
      };
      await atualizarUsuario(usuario.id_usuario, payload, true);
      setOpenSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setMensagemErro("Erro ao alterar senha. Tente novamente.");
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      classes={{ paper: "recuperar-senha-dialog" }}
    >
      <DialogTitle align="center" className="recuperar-senha-title">
        Recuperar Senha <LockResetIcon></LockResetIcon>
      </DialogTitle>
      <DialogContent className="recuperar-senha-content">
        <Box sx={{ p: 0, width: "100%" }}>
          {etapa === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="body2" className="recuperar-senha-instrucao">
                Informe seu e-mail para receber um código de recuperação{" "}
              </Typography>
              <TextField
                fullWidth
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="recuperar-senha-input"
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleSolicitarCodigo}
                disabled={loading || !email}
                className="recuperar-senha-botao"
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#1B3562" }} />
                ) : (
                  "Enviar Código"
                )}
              </Button>
            </motion.div>
          )}

          {etapa === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="body2" className="recuperar-senha-instrucao">
                Digite o código recebido no seu e-mail
              </Typography>
              <TextField
                fullWidth
                label="Código"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="recuperar-senha-input"
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleVerificarCodigo}
                disabled={loading || !codigo}
                className="recuperar-senha-botao"
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#1B3562" }} />
                ) : (
                  "Verificar Código"
                )}
              </Button>
            </motion.div>
          )}

          {etapa === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="body2" className="recuperar-senha-instrucao">
                Digite sua nova senha
              </Typography>
              <TextField
                fullWidth
                label="Nova Senha"
                type={mostrarNovaSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="recuperar-senha-input"
                InputProps={{ endAdornment: adornmentNovaSenha }}
              />
              <SenhaForte senha={novaSenha} />
              <TextField
                fullWidth
                label="Confirmar Nova Senha"
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="recuperar-senha-input-confirmar"
                InputProps={{ endAdornment: adornmentConfirmarSenha }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleAlterarSenha}
                disabled={loading || !novaSenha || !confirmarSenha}
                className="recuperar-senha-botao"
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#1B3562" }} />
                ) : (
                  "Alterar Senha"
                )}
              </Button>
            </motion.div>
          )}
        </Box>
      </DialogContent>

      <CustomSnackbar
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        message={
          etapa === 1
            ? "Código enviado com sucesso!"
            : etapa === 2
            ? "Código verificado com sucesso!"
            : "Senha alterada com sucesso!"
        }
        color="primary"
      />

      <CustomSnackbar
        open={openError}
        onClose={() => setOpenError(false)}
        message={mensagemErro}
        color="error"
      />
    </Dialog>
  );
}
