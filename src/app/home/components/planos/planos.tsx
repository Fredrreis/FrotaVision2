import React from "react";
import "./planos.css";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // ✅ Para navegação

export default function Planos() {
  const router = useRouter(); // ✅ Instância do router

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
      relatorio: "Sim",
    },
    {
      nome: "PREMIUM",
      preco: "R$ 44,90",
      dispositivos: "6 dispositivos",
      usuarios: "6 usuários",
      veiculos: "25 veículos",
      relatorio: "Sim",
      recomendado: true,
    },
    {
      nome: "PREMIUM PLUS",
      preco: "R$ 59,90",
      dispositivos: "10 dispositivos",
      usuarios: "10 usuários",
      veiculos: "Ilimitado",
      relatorio: "Sim",
    },
  ];

    interface Plano {
      nome: string;
      preco: string;
      dispositivos: string;
      usuarios: string;
      veiculos: string;
      relatorio: string;
      recomendado?: boolean;
    }

    const handleSelectPlan = (plano: Plano) => {
      // 🔥 Converte o objeto do plano para JSON e compacta na URL corretamente
      const planoCodificado = encodeURIComponent(JSON.stringify(plano));
      router.push(`/auth/register?plano=${planoCodificado}`);
    };
    

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
              <TableCell className="table-header"></TableCell>
              {planos.map((plano, index) => (
                <TableCell
                  key={index}
                  align="center"
                  className="table-header"
                  style={{
                    width: "22%",
                    backgroundColor: plano.recomendado ? "#135172" : "#1B3562",
                    position: "relative",
                  }}
                >
                  {plano.recomendado && (
                    <Box className="recomendado-label">RECOMENDADO</Box>
                  )}
                  <Typography variant="subtitle1" className="planos-subtitle">
                    {plano.nome}
                  </Typography>
                  <Typography className="plano-preco">{plano.preco}/mês</Typography>
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
                    className={`row ${plano.nome === "PREMIUM" ? "premium" : ""}`}
                  >
                    {item.key === "relatorio" && plano.relatorio === "Sim" && (
                      <CheckIcon className="check-icon" sx={{ fontSize: "small" }} />
                    )}
                    {item.key !== "relatorio" && plano[item.key as keyof typeof plano]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="no-border-row">
              <TableCell></TableCell>
              {planos.map((plano, index) => (
                <TableCell align="center" key={index} sx={{ backgroundColor: plano.recomendado ? "whitesmoke" : "white" }}>
                  {/* ✅ Agora passando o objeto inteiro do plano de forma compacta */}
                  <Button
                    variant="contained"
                    sx={{ fontWeight: "regular" }}
                    className={`plano-button ${plano.nome === "PREMIUM" ? "premium" : ""}`}
                    endIcon={<KeyboardArrowRightIcon />}
                    onClick={() => handleSelectPlan(plano)}
                  >
                    Escolher este plano
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
}
