"use client";

import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import sucessoAnimation from "../../../../../../public/lotties/sucesso.json";
import Carregamento from "@/app/components/carregamento/carregamento";
import "./register-sucesso.css";
import { useState } from "react";

export default function TelaSucesso() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  const handleRedirect = () => {
    setCarregando(true);
    setTimeout(() => router.push("/ferramentas"), 2000); // tempo da animação
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
