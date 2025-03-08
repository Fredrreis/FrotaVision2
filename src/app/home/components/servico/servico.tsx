"use client";

import React from "react";
import "./servico.css";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import ServicoImage3 from "../../../img/two-guys-talking-about-work-work-garage-near-truck-transfer-documents-with-goods.png";
import ServicoImage2 from "../../../img/marcin-jozwiak-kGoPcmpPT7c-unsplash.jpg"
import ServicoImage1 from "../../../img/seb-creativo-3jG-UM8IZ40-unsplash.jpg"
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
    icone: CurrencyExchangeIcon, 
    titulo: "Manutenção Preventiva Inteligente",
    descricao: "Receba alertas automáticos sobre o momento ideal para realizar manutenções preventivas, evitando falhas inesperadas e reduzindo custos com reparos emergenciais.",
  },
  {
    img: ServicoImage1,
  },
  {
    img: ServicoImage2,
    icone: LocalShippingIcon, 
    titulo: "Monitoramento Eficiente",
    descricao: "Tenha total controle sobre os veículos da frota, acompanhando suas condições e garantindo que cada caminhão esteja sempre pronto para rodar com segurança e eficiência.",
  },
  {
    img: ServicoImage3,
    icone: MoreTimeIcon,
    titulo: "Agilidade na Tomada de Decisão",
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
      <Box className="servico-content">
        {servicos.map((servico, index) => (
        <Box
          key={index}
          className={`servico-item ${servico.titulo && servico.img ? "dark-overlay" : ""}`}
          sx={{
            backgroundImage: servico.img ? `url(${servico.img.src})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            color: servico.img ? "white" : "black",
            position: "relative",
            padding: servico.titulo === "Agilidade na Tomada de Decisão" ? "0 10vw 0 6vw" : "0 6vw 0 10vw",
          }}
        >
          {!servico.img && (
            <Typography variant="h6" className="servico-title">
              SERVIÇOS
            </Typography>
          )}

          <Box className="servico-subtitle-container">
            {servico.icone &&
              React.createElement(servico.icone, {
                className: "servico-icon",
                sx: { color: servico.img ? "white" : "#1b3562" },
              })}
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
