"use client";

import React from "react";
import "./servico.css";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import ServicoImage from "../../../img/two-guys-talking-about-work-work-garage-near-truck-transfer-documents-with-goods.png";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const servicos = [
  {
    icone: <LocalShippingIcon className="servico-icon" />,
    titulo: "What is Lorem Ipsum?",
    descricao: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    icone: <EngineeringIcon className="servico-icon" />,
    titulo: "Where does it come from?",
    descricao:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
  },
  {
    icone: <MoreTimeIcon className="servico-icon" />,
    titulo: "Why do we use it?",
    descricao:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
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
