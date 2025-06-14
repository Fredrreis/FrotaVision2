"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ServicoImage3 from "../../../img/two-guys-talking-about-work-work-garage-near-truck-transfer-documents-with-goods.png";
import ServicoImage2 from "../../../img/marcin-jozwiak-kGoPcmpPT7c-unsplash.jpg";
import ServicoImage1 from "../../../img/seb-creativo-3jG-UM8IZ40-unsplash.jpg";
import "./servico.css";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const servicos = [
  {
    id: 1,
    descricao:
      "O FrotaVision é a solução definitiva para o controle inteligente da sua frota. Com monitoramento contínuo e notificações automáticas, você antecipa manutenções e reduz custos operacionais. Mais do que um sistema, é uma estratégia para manter seus caminhões sempre prontos para rodar, com eficiência, segurança e sem surpresas.",
  },
  {
    id: 2,
    img: ServicoImage1,
  },
  {
    id: 3,
    img: ServicoImage3,
    icone: CurrencyExchangeIcon,
    titulo: "Manutenção Preventiva Inteligente",
    descricao:
      "Receba alertas automáticos sobre o momento ideal para realizar manutenções preventivas, evitando falhas inesperadas e reduzindo custos com reparos emergenciais.",
  },
  {
    id: 4,
    img: ServicoImage2,
    icone: LocalShippingIcon,
    titulo: "Monitoramento Eficiente",
    descricao:
      "Tenha total controle sobre os veículos da frota, acompanhando suas condições e garantindo que cada caminhão esteja sempre pronto para rodar com segurança e eficiência.",
  },
];

export default function Servico() {
  const [telaPequena, setTelaPequena] = useState(false);

  useEffect(() => {
    // Função para verificar largura da tela e atualizar o estado
    const verificarTela = () => {
      setTelaPequena(window.innerWidth < 768);
    };

    // Rodar ao carregar a página
    verificarTela();

    // Adicionar um listener para capturar mudanças no tamanho da tela
    window.addEventListener("resize", verificarTela);

    // Remover o listener quando o componente for desmontado
    return () => window.removeEventListener("resize", verificarTela);
  }, []);

  return (
    <motion.div
      className="servico-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box className="servico-content">
        {servicos
          .filter((servico) => !(telaPequena && servico.id === 2)) // Remove id 2 apenas em telas menores
          .map((servico) => (
            <Box
              key={servico.id}
              className={`servico-item ${
                servico.titulo && servico.img ? "dark-overlay" : ""
              }`}
              sx={{
                backgroundImage: servico.img
                  ? `url(${servico.img.src})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: servico.img ? "white" : "black",
                position: "relative",
                padding: servico.id === 4 ? "0 15vw 0 6vw" : "0 6vw 0 15vw",
              }}
            >
              {!servico.img && (
                <Typography
                  variant="h6"
                  className="servico-title"
                  sx={{ textAlign: "left", marginLeft: "6vw" }}
                >
                  SERVIÇO
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

              {[3, 4].includes(servico.id) && (
                <Button
                  variant="outlined"
                  className="servico-saiba-mais-button"
                >
                  Saiba Mais
                </Button>
              )}
            </Box>
          ))}
      </Box>
    </motion.div>
  );
}
