"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Toolbar, Button } from "@mui/material";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { cadastrarEmpresa } from "@/api/services/empresaService";
import { cadastrarUsuario } from "../../../api/services/usuarioService";
import CustomSnackbar from "@/app/components/snackbar/snackbar";
import LogoFrotaVision from "../../img/FrotaVisionLogo.png";
import TelaSucesso from "./components/register-sucesso/register-sucesso";
import Passo1 from "./components/passos/passo-1";
import Passo2 from "./components/passos/passo-2";
import Passo3 from "./components/passos/passo-3";
import "./register.css";

export default function Register() {
  return (
    <Suspense fallback={<Box>Carregando formulário...</Box>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const planoCodificado = searchParams.get("plano");

  const [step, setStep] = useState(1);
  const [erroCadastro, setErroCadastro] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    empresa: "",
    cnpj: "",
  });

  const [planoSelecionado, setPlanoSelecionado] = useState<null | {
    nome: string;
    preco: string;
    dispositivos: string;
    usuarios: string;
    veiculos: string;
    relatorio: string;
    recomendado: boolean;
  }>(null);

  useEffect(() => {
    if (step === 1 && session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email,
      }));
      setStep(2);
    }
  }, [step, session]);

  useEffect(() => {
    if (planoCodificado) {
      try {
        setPlanoSelecionado(JSON.parse(decodeURIComponent(planoCodificado)));
      } catch (error) {
        console.error("Erro ao decodificar o plano:", error);
      }
    }
  }, [planoCodificado]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url !== pathname) {
        signOut({ redirect: false });
      }
    };

    window.addEventListener("popstate", () =>
      handleRouteChange(window.location.pathname)
    );

    return () => {
      window.removeEventListener("popstate", () =>
        handleRouteChange(window.location.pathname)
      );
    };
  }, [pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleRegister = async () => {
    try {
      const planoNome = planoSelecionado?.nome?.toUpperCase() ?? "";
      let idPlano = 0;

      switch (planoNome) {
        case "PADRÃO":
          idPlano = 1;
          break;
        case "PREMIUM":
          idPlano = 2;
          break;
        case "PREMIUM PLUS":
          idPlano = 3;
          break;
        default:
          idPlano = 0;
      }

      const empresaPayload = {
        cnpj: formData.cnpj,
        nome_social: formData.empresa,
        data_cadastro: new Date().toISOString(),
        id_plano: idPlano,
        habilitado: true,
      };
      await cadastrarEmpresa(empresaPayload);

      const usuarioPayload = {
        id_usuario: 0,
        email: formData.email,
        senha: formData.password,
        nome_usuario: formData.empresa,
        data_cadastro: new Date().toISOString(),
        cnpj: formData.cnpj,
        permissoes_usuario: 1,
        habilitado: true,
      };
      await cadastrarUsuario(usuarioPayload);

      if (session) await signOut({ redirect: false });
      setStep(4); // vai para a tela de sucesso, mas login só quando clicar no botão
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErroCadastro(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        alert("Erro ao fazer login com o Google.");
      }
    } catch (error) {
      console.error("Erro no login Google:", error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Passo1
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            handleGoogleSignIn={handleGoogleSignIn}
          />
        );
      case 2:
        return (
          <Passo2
            formData={formData}
            handleChange={handleChange}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Passo3
            formData={formData}
            plano={planoSelecionado}
            handleRegister={handleRegister}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <TelaSucesso email={formData.email} password={formData.password} />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div className="register-container">
      <Box className="register-header">
        <Toolbar className="register-toolbar">
          <Image
            src={LogoFrotaVision}
            alt="Frota Vision Logo"
            className="register-logo-img"
          />
          <Button
            onClick={() => router.push("/home")}
            sx={{
              color: "#1B3562",
              textTransform: "none",
              backgroundColor: "white",
              padding: "0.3rem 1rem",
              borderRadius: "0.75rem",
              marginLeft: "auto",
            }}
          >
            Sair
          </Button>
        </Toolbar>
      </Box>

      <Box className="register-form">
        <Typography className="register-step" variant="body2">
          {step <= 3 ? (
            `PASSO ${step} DE 3`
          ) : (
            <>
              <DoneAllIcon
                sx={{ color: "#838383", mr: 1 }}
                className="sucesso-register-icon"
              />
              Cadastro Finalizado
            </>
          )}
        </Typography>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          style={{ width: "100%" }}
        >
          {renderStep()}
        </motion.div>
      </Box>

      <CustomSnackbar
        open={erroCadastro}
        onClose={() => setErroCadastro(false)}
        message="Erro ao realizar cadastro. Verifique os dados e tente novamente."
        color="error"
      />
    </motion.div>
  );
}
