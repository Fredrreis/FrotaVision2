"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Typography, TextField, Button, Divider, Toolbar } from "@mui/material";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import LogoFrotaVision from "../../img/FrotaVisionLogo.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackwardsIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Ajustando o caminho para o CSS
import "./register.css";

// Ajustando o caminho para os ícones corretamente
import GoogleIcon from "../../img/google.png";
import MicrosoftIcon from "../../img/microsoft.png";

export default function Register() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const planoCodificado = searchParams.get("plano");

  let planoSelecionado = {
    nome: null,
    preco: null,
    dispositivos: null,
    usuarios: null,
    veiculos: null,
    relatorio: null,
    recomendado: false,
  };

  if (planoCodificado) {
    try {
      planoSelecionado = JSON.parse(decodeURIComponent(planoCodificado));
    } catch (error) {
      console.error("Erro ao decodificar os parâmetros do plano:", error);
    }
  }

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    empresa: "",
    cnpj: "",
  });

  // ✅ Atualiza o e-mail caso o usuário tenha logado pelo Google
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prevData) => ({
        ...prevData,
        email: session?.user?.email ?? "",
      }));
      setStep(2);
    }
  }, [session]);

  // ✅ Deslogar o usuário caso ele saia da página de registro
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url !== pathname) {
        signOut({ redirect: false });
      }
    };

    window.addEventListener("popstate", () => handleRouteChange(window.location.pathname));

    return () => {
      window.removeEventListener("popstate", () => handleRouteChange(window.location.pathname));
    };
  }, [pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleRegister = async () => {
    alert("Cadastro concluído!");

    if (session) {
      await signOut({ redirect: false }); // ✅ Desloga do Google após cadastro
    }

    router.push("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { redirect: false });

      if (!result?.error) {
        // Sessão será atualizada automaticamente
      } else {
        alert("Erro ao fazer login com o Google.");
      }
    } catch (error) {
      console.error("Erro ao autenticar com o Google:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div className="register-container">
      <Box className="register-header">
        <Toolbar className="register-toolbar">
          <Image src={LogoFrotaVision} alt="Frota Vision Logo" className="register-logo-img" />
            <Button 
            onClick={() => router.push('/home')}
            sx={{ 
              color: "#1B3562",  
              textTransform: "none", 
              backgroundColor: "white", 
              padding: "0.3rem 1rem", 
              borderRadius: "0.75rem",
              marginLeft: "auto" // ✅ Garante que fique à direita
            }}
            >
                Sair
            </Button>
        </Toolbar>
      </Box>

      {/* ✅ Formulário centralizado */}
      <Box className="register-form">
        <Typography className="register-step" variant="body2">
          PASSO {step} DE 3
        </Typography>

        {step === 1 && (
          <>
            <Typography variant="h5" className="register-title">
              Criar Conta
            </Typography>
            <Typography variant="body2" className="register-instructions">
              Primeiramente vamos definir o e-mail e senha
            </Typography>
            <TextField
              name="email"
              label="E-mail"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              name="password"
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              className="register-button"
              endIcon={<ArrowForwardIcon />}
              onClick={nextStep}
            >
              CONTINUAR
            </Button>
            <Divider className="register-divider">ou</Divider>
            <Box className="register-social-buttons">
              <Button variant="outlined" className="register-social-button" onClick={handleGoogleSignIn}>
                <Image src={GoogleIcon} alt="Google Icon" width={20} height={20} />
                Sign in com Google
              </Button>
              <Button variant="outlined" className="register-social-button" disabled>
                <Image src={MicrosoftIcon} alt="Microsoft Icon" width={20} height={20} />
                Sign in com Microsoft
              </Button>
            </Box>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h5" className="register-title">
              Dados da Empresa
            </Typography>
            <Typography variant="body2" className="register-instructions">
              Agora vamos preencher os dados empresariais
            </Typography>
            <TextField
              name="empresa"
              label="Nome da Empresa"
              variant="outlined"
              fullWidth
              value={formData.empresa}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              name="cnpj"
              label="CNPJ"
              variant="outlined"
              fullWidth
              value={formData.cnpj}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              className="register-button"
              endIcon={<ArrowForwardIcon />}
              onClick={nextStep}
            >
              CONTINUAR
            </Button>
            <Button
              variant="contained"
              fullWidth
              className="register-button-back"
              endIcon={<ArrowBackwardsIcon />}
              onClick={prevStep}
            >
              VOLTAR
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <CheckCircleIcon className="register-check-circle-icon"/>
            <Typography variant="h5" className="register-title">
              Confirme seus dados
            </Typography>
            <Typography variant="body2" className="register-instructions">
              Verifique o plano selecionado e confira as credenciais
            </Typography>
            <Box className="register-plano-selecionado">
              <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                <strong>Plano {planoSelecionado.nome}</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                <strong>{planoSelecionado.preco}</strong>/mês
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                {planoSelecionado.dispositivos} - {planoSelecionado.usuarios} - {planoSelecionado.veiculos} - Relatório: {planoSelecionado.relatorio}
              </Typography>
            </Box>
            <Typography variant="body2" className="register-campo" sx={{ marginTop: "2vh" }}>
              <strong>E-mail:</strong> {formData.email}
            </Typography>
            <Typography variant="body2" className="register-campo">
              <strong>Empresa:</strong> {formData.empresa}
            </Typography>
            <Typography variant="body2" className="register-campo">
              <strong>CNPJ:</strong> {formData.cnpj}
            </Typography>
            <Button variant="contained" className="register-button" fullWidth onClick={handleRegister}>
              CONCLUIR ASSINATURA
            </Button>
            <Button
              variant="contained"
              fullWidth
              className="register-button-back"
              endIcon={<ArrowBackwardsIcon />}
              onClick={prevStep}
            >
              VOLTAR
            </Button>
          </>
        )}
      </Box>
    </motion.div>
  );
}
