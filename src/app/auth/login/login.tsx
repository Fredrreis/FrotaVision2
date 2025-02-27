"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from "next-auth/react";
import GoogleIcon from "../../img/google.png";
import MicrosoftIcon from "../../img/microsoft.png";
import LogoFrotaVisionV2 from "../../img/FrotaVisionLogoV2.png"
import "./login.css";

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleManualLogin = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      alert("Login com e-mail e senha bem-sucedido!");
    } else {
      alert("E-mail ou senha inválidos");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google"); // ✅ Dispara o login com o Google
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="login-form-container">
        <Image src={LogoFrotaVisionV2} alt="Frota Vision Logo" className="login-logo-img"/>

        <Typography variant="body2" className="login-subtitle">
          Coloque suas credenciais para ter acesso à conta
        </Typography>

        <Box className="login-inputs">
          <TextField
            id="email"
            variant="outlined"
            fullWidth
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id="password"
            variant="outlined"
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Typography variant="body2" className="forgot-password">
            Esqueceu sua senha?
          </Typography>

          <Button
            variant="contained"
            fullWidth
            className="login-button"
            onClick={handleManualLogin}
          >
            ENTRAR
          </Button>

          <Divider className="login-divider">ou</Divider>

          <Box className="login-social-buttons">
            {/* ✅ Botão de login com Google agora funcional */}
            <Button
              variant="outlined"
              className="login-social-button"
              onClick={handleGoogleLogin}
            >
              <Image src={GoogleIcon} alt="Google Icon" width={20} height={20} />
              Login com Google
            </Button>

            {/* Botão da Microsoft (a ser implementado futuramente) */}
            <Button variant="outlined" className="login-social-button" disabled>
              <Image src={MicrosoftIcon} alt="Microsoft Icon" width={20} height={20} />
              Login com Microsoft
            </Button>
          </Box>

          <Typography variant="body2" className="register-link">
            Não tem uma conta?{" "}
            <span onClick={() => router.push("/?section=planos")}>
              Assine já
            </span>
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
}