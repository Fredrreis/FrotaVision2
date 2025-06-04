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
import { listarNotificacoes } from "@/api/services/notificacaoService";
import { useSession } from "next-auth/react";
import "./notificacoes.css";

interface NotificacaoFormatada {
  id: number;
  data: string;
  caminhao: string;
  tipo: string;
  peca: string;
  descricao: string;
  vidaUtil: number;
  atual: number;
  urgente: boolean;
}

export default function Notificacoes() {
  const theme = useTheme();
  const { data: session } = useSession();
  const [notificacoes, setNotificacoes] = useState<NotificacaoFormatada[]>([]);
  const [vistas, setVistas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarNotificacoes = async () => {
      try {
        if (!session?.user?.cnpj) return;

        const dados = await listarNotificacoes(session.user.cnpj);

        // Transformar os dados da API no formato necessário para exibição
        const notificacoesFormatadas: NotificacaoFormatada[] = dados.map(
          (n) => ({
            id: n.idManutencaoRealizada,
            data: n.data_viagem,
            caminhao: n.nomeVeiculo,
            tipo: n.tipo_caminhao,
            peca: n.nomeManutencao,
            descricao: n.descricao_manutencao,
            vidaUtil: n.quilometragemManutencao,
            atual: n.quilometragemAtual,
            urgente: n.urgente,
          })
        );

        const ordenadas = notificacoesFormatadas.sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        );

        setNotificacoes(ordenadas);
      } catch (erro) {
        console.error("Erro ao buscar notificações:", erro);
      } finally {
        setLoading(false);
      }
    };

    const vistasSalvas = localStorage.getItem("notificacoesVistas");
    const idsVistos = vistasSalvas ? JSON.parse(vistasSalvas) : [];
    setVistas(idsVistos);

    buscarNotificacoes();
  }, [session?.user?.cnpj]);
  useEffect(() => {
    const todosIds = notificacoes.map((n) => n.id);
    localStorage.setItem("notificacoesVistas", JSON.stringify(todosIds));
  }, [notificacoes]);

  return (
    <Box className="notificacoes-container">
      <Typography variant="h6" className="notificacoes-title">
        <NotificationsIcon className="icon-title" /> NOTIFICAÇÕES
      </Typography>

      <Timeline className="notificacoes-timeline">
        {" "}
        {notificacoes.map((n, i) => {
          const isUrgente = n.urgente;
          const isNova = !vistas.includes(n.id);
          // Garantindo que a key será única mesmo se algum campo for undefined/null
          const uniqueKey = `notificacao-${n.id || i}-${Date.now()}-${i}`;
          return (
            <TimelineItem key={uniqueKey} className="timeline-item">
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
                    {n.caminhao} - {n.peca}
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
                    {n.vidaUtil} km
                  </Typography>

                  <Typography
                    mt={0.7}
                    variant="body2"
                    className={isUrgente ? "texto-urgente" : ""}
                  >
                    <Box component="span" fontWeight={600}>
                      Atual:
                    </Box>{" "}
                    {n.atual} km
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
