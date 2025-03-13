"use client";

import React, { useState, useEffect } from "react";
import "./video.css";
import { Button, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-scroll";

export default function Video() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const videoSection = document.getElementById("video-section");
      if (videoSection) {
        const rect = videoSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      id="video-section"
      className="video-body-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
    >
        {/* Vídeo de fundo 
          Vídeo por Freepik: https://www.freepik.com
          Link: https://br.freepik.com/video-gratuito/motorista-camiao-escrever-quadro_2816181#fromView=search&page=1&position=31&uuid=dd0f276b-d075-491f-b388-07b39b1b8640
      */}
      {isVisible && (
        <video autoPlay loop muted playsInline className="background-video">
          <source src="/videos/FrotaVision_main_video.webm" type="video/webm" />
          <source src="/videos/FrotaVision_main_video.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>
      )}
      <Box className="video-content">
        <Typography variant="h5" className="video-title">
          Feito para a sua frota
        </Typography>
        <Typography variant="body1" className="video-description">
          Gerencie manutenções e reduza custos com um sistema inteligente.
        </Typography>
        <Link
          to="planos"
          smooth={true}
          duration={500}
          offset={-130}
          className="video-button-link"
        >
          <Button
            variant="contained"
            className="video-button"
            endIcon={<ArrowForwardIcon />}
          >
            VER PLANOS
          </Button>
        </Link>
      </Box>
    </motion.div>
  );
}
