import { useState } from "react";
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./notificacoes.css";

interface Notificacao {
  id: number;
  nova: boolean;
  data: string;
  caminhão: string;
  tipo: string;
  peça: string;
  descricao: string;
  vidaUtil: string;
  atual: string;
}

const notificacoesIniciais: Notificacao[] = [
  {
    id: 1,
    nova: true,
    data: "2024-04-10",
    caminhão: "Caminhão 1",
    tipo: "Betoneira",
    peça: "Bomba hidráulica",
    descricao: "Substituição necessária devido a vazamento identificado.",
    vidaUtil: "90km",
    atual: "80km",
  },
  {
    id: 2,
    nova: false,
    data: "2024-03-20",
    caminhão: "Caminhão 2",
    tipo: "Basculante",
    peça: "Freio",
    descricao: "Desgaste excessivo identificado nos discos de freio traseiros.",
    vidaUtil: "150km",
    atual: "160km",
  },
  {
    id: 3,
    nova: true,
    data: "2024-04-09",
    caminhão: "Caminhão 5",
    tipo: "Prancha",
    peça: "Pneu dianteiro esquerdo",
    descricao:
      "Pressão abaixo do recomendado. Verificar possibilidade de furo.",
    vidaUtil: "100km",
    atual: "95km",
  },
];

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(
    [...notificacoesIniciais].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    )
  );
  const [abertas, setAbertas] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setAbertas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, nova: false } : n))
    );
  };

  return (
    <Box className="notificacoes-container">
      <Typography variant="h6" className="notificacoes-title">
        <NotificationsIcon className="icon-title" /> NOTIFICAÇÕES
      </Typography>

      <Box className="notificacoes-lista">
        {notificacoes.map((n) => {
          const isUrgente = parseInt(n.atual) > parseInt(n.vidaUtil);
          const isExpandida = abertas.includes(n.id);

          return (
            <Card
              key={n.id}
              className={`notificacao-card ${
                isUrgente ? "urgente" : n.nova ? "nova" : ""
              } ${isExpandida ? "expandida" : ""}`}
            >
              <CardContent className="notificacao-header">
                <Box>
                  {n.nova && (
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="#1B3562"
                    >
                      NOVA
                    </Typography>
                  )}
                  {isUrgente && (
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="#a91a1a"
                    >
                      URGENTE
                    </Typography>
                  )}
                  <Typography variant="body2" className="notificacao-caminhao">
                    <Box component="span" fontWeight={600}>
                      {n.caminhão}
                    </Box>{" "}
                    - {n.peça}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  {n.nova && (
                    <CircleIcon
                      className="icone-pulsando"
                      sx={{ color: "#1B3562", fontSize: 20 }}
                      titleAccess="Nova notificação"
                    />
                  )}
                  {isUrgente && (
                    <WarningIcon
                      sx={{ color: "#a91a1a", fontSize: 20 }}
                      titleAccess="Manutenção urgente"
                    />
                  )}
                  <IconButton onClick={() => toggleExpand(n.id)}>
                    {isExpandida ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
              </CardContent>

              <Collapse in={isExpandida}>
                <Box className="notificacao-detalhes">
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ color: "#555" }}
                  >
                    <Box component="span" fontWeight={600}>
                      Tipo Caminhão:
                    </Box>{" "}
                    {n.tipo}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ color: "#555" }}
                  >
                    <Box component="span" fontWeight={600}>
                      Descrição:
                    </Box>{" "}
                    {n.descricao}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    sx={{ color: "#555" }}
                  >
                    <Box component="span" fontWeight={600}>
                      Quilometragem de Vida Útil:
                    </Box>{" "}
                    {n.vidaUtil}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    className={
                      isUrgente
                        ? "destacar-quilometragem"
                        : "quilometragem-padrao"
                    }
                  >
                    <Box component="span" fontWeight={600}>
                      Quilometragem Atual:
                    </Box>{" "}
                    {n.atual}
                  </Typography>

                  <Box className="notificacao-acao">
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      className="botao-ver-caminhao"
                    >
                      Verificar caminhão
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
