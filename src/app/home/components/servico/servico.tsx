"use client";

import React from "react";
import "./servico.css";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import ServicoImage from "../../../img/two-guys-talking-about-work-work-garage-near-truck-transfer-documents-with-goods.png";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const servicos = [
  {
    icone: <CurrencyExchangeIcon className="servico-icon" />, 
    titulo: "Manutenção Preventiva Inteligente",
    descricao: "Receba alertas automáticos sobre o momento ideal para realizar manutenções preventivas, evitando falhas inesperadas e reduzindo custos com reparos emergenciais.",
  },
  {
    icone: <LocalShippingIcon className="servico-icon" />, 
    titulo: "Monitoramento Eficiente",
    descricao: "Tenha total controle sobre os veículos da frota, acompanhando suas condições e garantindo que cada caminhão esteja sempre pronto para rodar com segurança e eficiência.",
  },
  {
    icone: <MoreTimeIcon className="servico-icon" />, 
    titulo: "Mais Agilidade na Tomada de Decisão",
    descricao: "Com uma plataforma intuitiva, você acessa rapidamente as informações essenciais, agiliza o planejamento de manutenção e melhora a produtividade da frota.",
  },
];

export default function Servico() {
  return (
    <motion.div
      className="servico-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Typography variant="h5" className="servico-title">
        Por que escolher o FrotaVision?
      </Typography>

      <Box className="servico-image">
        <Image
          src={ServicoImage}
          className="servico-image2"
          alt="Imagem de serviço"
          layout="responsive"
        />
      </Box>

      <Box className="servico-content">
        {servicos.map((servico, index) => (
          <Box key={index} className="servico-item">
            <Box className="servico-subtitle-container">
              {servico.icone}
              <Typography variant="subtitle1" className="servico-subtitle">
                {servico.titulo}
              </Typography>
            </Box>
            <Typography variant="body2" className="servico-text">
              {servico.descricao}
            </Typography>
          </Box>
        ))}
      </Box>

      <KeyboardDoubleArrowDownIcon className="arrow-icon" />
      <Box className="servico-button-container">
        <Button variant="outlined" className="servico-button">
          Saiba mais sobre o FrotaVision
        </Button>
      </Box>
    </motion.div>
  );
}