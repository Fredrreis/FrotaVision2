"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LogoFrotaVisionV2 from "../../img/FrotaVisionLogoV2.png";
import { step1Schema } from "@/utils/login-validation";
import useToggleSenha from "@/app/components/toggle-senha/toggle-senha";
import CustomSnackbar from "@/app/components/snackbar/snackbar";
import Carregamento from "@/app/components/carregamento/carregamento";
import "./login.css";
import RecuperarSenha from "./components/recuperar-senha";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { mostrarSenha, adornment } = useToggleSenha();
  const [openRecuperarSenha, setOpenRecuperarSenha] = useState(false);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [loadingPainel, setLoadingPainel] = useState(false);
  const [mensagemCarregamento, setMensagemCarregamento] = useState(
    "Bem-vindo de volta!"
  );
  const [loadingLogin, setLoadingLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(step1Schema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoadingLogin(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.ok) {
        setOpenSuccess(true);

        setTimeout(() => {
          setLoadingPainel(true);
        }, 1000);

        setTimeout(() => {
          router.push("/ferramentas");
        }, 2500);
      } else {
        setOpenError(true);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setOpenError(true);
    } finally {
      setLoadingLogin(false);
    }
  };

  useEffect(() => {
    if (loadingPainel) {
      const timeout = setTimeout(() => {
        setMensagemCarregamento("Carregando o painel de ferramentas...");
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [loadingPainel]);

  if (loadingPainel) {
    return (
      <>
        <Carregamento
          animationUrl="/lotties/carregamento.json"
          mensagem={mensagemCarregamento}
        />
        <CustomSnackbar
          open={openSuccess}
          onClose={() => setOpenSuccess(false)}
          message="Login realizado com sucesso!"
          color="primary"
        />
      </>
    );
  }

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="login-form-container">
        <Image
          src={LogoFrotaVisionV2}
          alt="Frota Vision Logo"
          className="login-logo-img"
        />

        <Typography variant="body2" className="login-subtitle">
          Coloque suas credenciais para ter acesso à conta
        </Typography>

        <Box
          className="login-inputs"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            id="email"
            variant="outlined"
            fullWidth
            label="E-mail"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            id="password"
            variant="outlined"
            fullWidth
            label="Senha"
            type={mostrarSenha ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{ endAdornment: adornment }}
          />

          <Typography
            variant="body2"
            className="forgot-password"
            onClick={() => setOpenRecuperarSenha(true)}
          >
            Esqueceu sua senha?
          </Typography>

          <Button
            variant="contained"
            fullWidth
            className="login-button"
            type="submit"
            disabled={loadingLogin}
          >
            {loadingLogin ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
              >
                <CircularProgress size={24} color="inherit" />
              </Box>
            ) : (
              "ENTRAR"
            )}
          </Button>

          <Typography variant="body2" className="register-link">
            Não tem uma conta?{" "}
            <span onClick={() => (window.location.href = "/?section=planos")}>
              Assine já
            </span>
          </Typography>
        </Box>
      </Box>

      <CustomSnackbar
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        message="Login realizado com sucesso!"
        color="primary"
      />

      <CustomSnackbar
        open={openError}
        onClose={() => setOpenError(false)}
        message="E-mail ou senha inválidos."
        color="error"
      />

      <RecuperarSenha
        open={openRecuperarSenha}
        onClose={() => setOpenRecuperarSenha(false)}
      />
    </motion.div>
  );
}
