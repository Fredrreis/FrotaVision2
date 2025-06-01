"use client";

import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Lottie from "lottie-react";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import sucessoAnimation from "../../../../../../public/lotties/sucesso.json";
import Carregamento from "@/app/components/carregamento/carregamento";
import "./register-sucesso.css";

interface TelaSucessoProps {
  email: string;
  password: string;
}

export default function TelaSucesso({ email, password }: TelaSucessoProps) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const handleRedirect = async () => {
    setCarregando(true);
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    router.replace("/ferramentas");
  };

  return carregando ? (
    <Carregamento
      animationUrl="/lotties/carregamento.json"
      mensagem="Carregando painel de ferramentas..."
    />
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sucesso-container"
    >
      <Box className="sucesso-box">
        <Box className="sucesso-lottie">
          <Lottie
            animationData={sucessoAnimation}
            loop
            autoplay
            style={{ width: "100%" }}
          />
        </Box>

        <Typography variant="h5" className="sucesso-titulo">
          <CelebrationIcon fontSize="large" sx={{ color: "#1e70ff" }} />{" "}
          Assinatura Realizada com Sucesso!
        </Typography>

        <Typography variant="body2" className="sucesso-subtitulo">
          Bem-vindo à FrotaVision. Sua conta está pronta!
        </Typography>

        <Button
          variant="contained"
          className="redirect-ferramentas-button"
          endIcon={<ArrowForwardIcon />}
          onClick={handleRedirect}
        >
          Ir para o Painel de Ferramentas
        </Button>
      </Box>
    </motion.div>
  );
}
