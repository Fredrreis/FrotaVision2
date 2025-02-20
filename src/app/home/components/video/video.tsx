"use client";

import React from "react";
import "./video.css";
import { Button, Typography, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Video() {
  return (
    <Box className="video-body-container">
      {/* Vídeo de fundo 
          Vídeo por Freepik: https://www.freepik.com
          Link: https://br.freepik.com/video-gratuito/motorista-camiao-escrever-quadro_2816181#fromView=search&page=1&position=31&uuid=dd0f276b-d075-491f-b388-07b39b1b8640
      */}
      <video autoPlay loop muted playsInline className="background-video">
        <source src="/videos/FrotaVision_main_video.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
      <Box className="video-content">
        <Typography variant="h5" className="video-title">
          Feito para a sua frota
        </Typography>
        <Typography variant="body1" className="video-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </Typography>
        <Button variant="contained" className="video-button" endIcon={<ArrowForwardIcon />}>
          VER PLANOS
        </Button>
      </Box>
    </Box>
  );
}