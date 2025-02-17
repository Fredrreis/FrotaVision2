"use client";

import React from "react";
import "./servico.css";
import { Box, Typography, Button, Grid } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import ServicoImage from "../../../img/two-guys-talking-about-work-work-garage-near-truck-transfer-documents-with-goods.jpg";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EngineeringIcon from '@mui/icons-material/Engineering';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Servico() {
  return (
    <motion.div
      className="servico-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Typography variant="h5" className="servico-title">
        Por que o FrotaVision?
      </Typography>
      <Box className="servico-image">
        <Image src={ServicoImage} alt="Imagem de serviço" layout="responsive" />
      </Box>
      <Grid container spacing={4} className="servico-content">
        <Grid item xs={12} md={4}>
          <Box className="servico-subtitle-container">
            <LocalShippingIcon className="servico-icon" />
            <Typography variant="subtitle1" className="servico-subtitle">
              What is Lorem Ipsum?
            </Typography>
          </Box>
          <Typography variant="body2" className="servico-text">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className="servico-subtitle-container">
            <EngineeringIcon className="servico-icon" />
            <Typography variant="subtitle1" className="servico-subtitle">
              Where does it come from?
            </Typography>
          </Box>
          <Typography variant="body2" className="servico-text">
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box className="servico-subtitle-container">
            <MoreTimeIcon className="servico-icon" />
            <Typography variant="subtitle1" className="servico-subtitle">
              Why do we use it?
            </Typography>
          </Box>
          <Typography variant="body2" className="servico-text">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
          </Typography>
        </Grid>
      </Grid>
      <Box className="servico-button-container">
        <Button variant="outlined" className="servico-button">
          Saiba mais sobre o FrotaVision
        </Button>
      </Box>
    </motion.div>
  );
}