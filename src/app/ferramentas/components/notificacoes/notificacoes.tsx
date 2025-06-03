import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import { useEffect, useState } from "react";
import "./notificacoes.css";

interface Notificacao {
  id: number;
  data: string;
  caminhão: string;
  tipo: string;
  peça: string;
  descricao: string;
  vidaUtil: string;
  atual: string;
}

const notificacoesOriginais: Notificacao[] = [
  {
    id: 1,
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
  const theme = useTheme();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [vistas, setVistas] = useState<number[]>([]);

  useEffect(() => {
    const vistasSalvas = localStorage.getItem("notificacoesVistas");
    const idsVistos = vistasSalvas ? JSON.parse(vistasSalvas) : [];

    setVistas(idsVistos);

    const ordenadas = [...notificacoesOriginais].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );

    setNotificacoes(ordenadas);
  }, []);

  useEffect(() => {
    const todosIds = notificacoesOriginais.map((n) => n.id);
    localStorage.setItem("notificacoesVistas", JSON.stringify(todosIds));
  }, []);

  return (
    <Box className="notificacoes-container">
      <Typography variant="h6" className="notificacoes-title">
        <NotificationsIcon className="icon-title" /> NOTIFICAÇÕES
      </Typography>

      <Timeline className="notificacoes-timeline">
        {notificacoes.map((n, i) => {
          const isUrgente = parseInt(n.atual) > parseInt(n.vidaUtil);
          const isNova = !vistas.includes(n.id);

          return (
            <TimelineItem key={n.id} className="timeline-item">
              <TimelineOppositeContent className="timeline-date">
                {new Date(n.data).toLocaleDateString()}
              </TimelineOppositeContent>

              <TimelineSeparator className="timeline-separator">
                <TimelineDot
                  className="timeline-dot"
                  sx={{
                    backgroundColor: isUrgente
                      ? "#A30D11"
                      : isNova
                      ? "#1e70ff"
                      : "#1B3561",
                  }}
                >
                  {isUrgente ? (
                    <WarningIcon fontSize="small" style={{ color: "#fff" }} />
                  ) : isNova ? (
                    <NewReleasesIcon
                      fontSize="small"
                      style={{ color: "#fff" }}
                    />
                  ) : (
                    <NotificationsIcon
                      fontSize="small"
                      style={{ color: "#fff" }}
                    />
                  )}
                </TimelineDot>

                {i < notificacoes.length - 1 && (
                  <TimelineConnector className="timeline-connector" />
                )}
              </TimelineSeparator>

              <TimelineContent className="timeline-content">
                <Paper elevation={3} className="notificacao-card">
                  <Typography variant="subtitle2" fontWeight={600}>
                    {n.caminhão} - {n.peça}
                  </Typography>

                  <Divider className="divider" />

                  <Typography variant="body2">
                    <Box component="span" fontWeight={600}>
                      Tipo Caminhão:
                    </Box>{" "}
                    {n.tipo}
                  </Typography>

                  <Typography variant="body2" mt={0.7}>
                    <Box component="span" fontWeight={600}>
                      Descrição:
                    </Box>{" "}
                    {n.descricao}
                  </Typography>

                  <Typography variant="body2" mt={0.7}>
                    <Box component="span" fontWeight={600}>
                      Vida útil:
                    </Box>{" "}
                    {n.vidaUtil}
                  </Typography>

                  <Typography
                    mt={0.7}
                    variant="body2"
                    className={isUrgente ? "texto-urgente" : ""}
                  >
                    <Box component="span" fontWeight={600}>
                      Atual:
                    </Box>{" "}
                    {n.atual}
                  </Typography>

                  <Box className="notificacao-botao-container">
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      className="notificacao-botao"
                      sx={{
                        color: isUrgente
                          ? "#A30D11"
                          : isNova
                          ? "#1e70ff"
                          : "#1B3561",
                        fontWeight: 600,
                      }}
                    >
                      Verificar caminhão
                    </Button>
                  </Box>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </Box>
  );
}
