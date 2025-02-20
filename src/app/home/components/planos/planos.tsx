import React from "react";
import "./planos.css";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";

export default function Planos() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const planos = [
    {
      nome: "PADRÃO",
      preco: "R$ 20,90",
      dispositivos: "3 dispositivos",
      usuarios: "3 usuários",
      veiculos: "10 veículos",
      relatorio: "Não",
    },
    {
      nome: "PREMIUM",
      preco: "R$ 44,90",
      dispositivos: "6 dispositivos",
      usuarios: "6 usuários",
      veiculos: "20 veículos",
      relatorio: "Sim",
      recomendado: true,
    },
    {
      nome: "PREMIUM PLUS",
      preco: "R$ 59,90",
      dispositivos: "10 dispositivos",
      usuarios: "10 usuários",
      veiculos: "O que precisar",
      relatorio: "Sim",
    },
  ];

  return (
    <motion.div
      className="planos-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Typography variant="h5" className="planos-titulo">
        Nossos planos
      </Typography>

      <TableContainer component={Paper} className="planos-table-container">
        <Table className="planos-table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header" style={{ width: '40%' }}></TableCell>
              {planos.map((plano, index) => (
                <TableCell
                  key={index}
                  align="center"
                  className={`table-header ${plano.nome === "PREMIUM" ? "premium-header" : ""}`}
                  style={{ width: '20%' }}
                >
                  {plano.recomendado && (
                    <Box className="plano-tag">Recomendado</Box>
                  )}
                  <Button className={`plano-header-button ${plano.nome === "PREMIUM" ? "premium-button" : ""}`} variant="text">
                    <Typography variant="subtitle1" className="planos-subtitle">
                      {plano.nome}
                    </Typography>
                  </Button>
                  <Typography className="plano-preco" variant="body2">{plano.preco}/mês</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {[
              { label: "Dispositivos simultâneos", key: "dispositivos" },
              { label: "Usuários extras", key: "usuarios" },
              { label: "Quantidade de veículos", key: "veiculos" },
              { label: "Relatório", key: "relatorio" },
            ].map((item, index) => (
              <TableRow key={index}>
                <TableCell className="row-title">{item.label}</TableCell>
                {planos.map((plano, idx) => (
                  <TableCell
                    align="center"
                    key={idx}
                    className={plano.nome === "PREMIUM" ? "premium-row" : ""}
                    sx={{ color: "#b1b1b1" }}
                  >
                    {item.key === "relatorio" ? (
                      plano.relatorio === "Sim" ? (
                        <CheckIcon className="check-icon" sx={{ fontSize: "small" }} />
                      ) : (
                        <CloseIcon className="close-icon" sx={{ fontSize: "small" }} />
                      )
                    ) : (
                      plano[item.key as keyof typeof plano]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
}