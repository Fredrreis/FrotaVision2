import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  TextField,
  InputAdornment,
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
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useSession } from "next-auth/react";
import Carregamento from "@/app/components/carregamento/carregamento";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import { listarNotificacoes } from "@/api/services/notificacaoService";
import { formatarDataISOcomHora, compareDateISO } from "@/utils/data";
import "../styles/shared-styles.css";
import "./notificacoes.css";
import { motion } from "framer-motion";

interface NotificacaoFormatada {
  id: number;
  data: string;
  dataOriginal: string; // Adicionando campo para data original
  caminhao: string;
  tipo: string;
  peca: string;
  descricao: string;
  vidaUtil: number;
  atual: number;
  urgente: boolean;
}

export default function Notificacoes() {
  const { data: session } = useSession();
  const [notificacoes, setNotificacoes] = useState<NotificacaoFormatada[]>([]);
  const [vistas, setVistas] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filtrosAvancados, setFiltrosAvancados] = useState<
    Record<string, unknown>
  >({});

  useEffect(() => {
    const buscarNotificacoes = async () => {
      try {
        if (!session?.user?.cnpj) return;

        const dados = await listarNotificacoes(session.user.cnpj);

        // Transformar os dados da API no formato necessário para exibição
        const notificacoesFormatadas: NotificacaoFormatada[] = dados.map(
          (n: unknown) => {
            if (typeof n !== "object" || n === null)
              return {} as NotificacaoFormatada;
            const obj = n as Record<string, unknown>;
            const dataOriginal =
              typeof obj.data_Manutencao === "string"
                ? obj.data_Manutencao
                : "";
            return {
              id: Number(obj.idManutencaoRealizada),
              data: formatarDataISOcomHora(dataOriginal),
              dataOriginal,
              caminhao: String(obj.nomeVeiculo ?? ""),
              tipo: String(obj.tipo_caminhao ?? ""),
              peca: String(obj.nomeManutencao ?? ""),
              descricao: String(obj.descricao_manutencao ?? ""),
              vidaUtil: Number(obj.quilometragemManutencao ?? 0),
              atual: Number(obj.quilometragemAtual ?? 0),
              urgente: Boolean(obj.urgencia),
            };
          }
        );

        const ordenadas = notificacoesFormatadas.sort(
          (a, b) =>
            new Date(b.dataOriginal).getTime() -
            new Date(a.dataOriginal).getTime()
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

  const notificacoesFiltradas = notificacoes.filter((notificacao) => {
    const matchSearch = notificacao.caminhao
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchTipo = filtrosAvancados.tipo
      ? notificacao.tipo === String(filtrosAvancados.tipo)
      : true;

    // Ajustando a lógica do filtro de urgência
    const matchUrgencia =
      filtrosAvancados.urgencia === undefined ||
      filtrosAvancados.urgencia === ""
        ? true
        : notificacao.urgente === (String(filtrosAvancados.urgencia) === "Sim");

    const matchData = filtrosAvancados.data
      ? compareDateISO(notificacao.dataOriginal, String(filtrosAvancados.data))
      : true;

    return matchSearch && matchTipo && matchUrgencia && matchData;
  });

  const tiposUnicos = [...new Set(notificacoes.map((n) => n.tipo))];

  const filtrosAvancadosConfig = [
    {
      name: "tipo",
      label: "Tipo Caminhão",
      type: "select" as const,
      options: tiposUnicos,
    },
    {
      name: "urgencia",
      label: "Urgência",
      type: "select" as const,
      options: ["Sim", "Não"],
    },
    {
      name: "data",
      label: "Data",
      type: "data" as const,
    },
  ];

  if (loading) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Notificações..."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box className="notificacoes-container">
        <Box className="notificacoes-header">
          <Typography variant="h6" className="notificacoes-title">
            <NotificationsIcon className="icon-title" /> NOTIFICAÇÕES
          </Typography>
        </Box>

        <Box className="notificacoes-filtros">
          <Box className="search-filtros-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por nome do veículo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              className="botao-filtrar"
              endIcon={<FilterAltOutlinedIcon />}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setOpenFiltros(true);
              }}
            >
              <span className="button-text">Filtros Avançados</span>
            </Button>
          </Box>
        </Box>

        <Timeline sx={{ p: 0, m: 0 }}>
          {notificacoesFiltradas.map((n, i) => {
            const isUrgente = n.urgente;
            const isNova = !vistas.includes(n.id);
            const uniqueKey = `notificacao-${n.id || i}-${Date.now()}-${i}`;
            return (
              <TimelineItem key={uniqueKey} sx={{ alignItems: "flex-start" }}>
                <TimelineOppositeContent
                  sx={{
                    fontSize: "0.75rem",
                    color: "#777",
                    flex: 0.1,
                    margin: "auto 0",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {n.data}
                </TimelineOppositeContent>
                <TimelineSeparator sx={{}}>
                  <TimelineDot
                    sx={{
                      boxShadow: "none",
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
                    <TimelineConnector sx={{ backgroundColor: "#ccc" }} />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} className="notificacao-card">
                    <Box
                      sx={{
                        display: { xs: "block", md: "none" },
                        fontSize: "0.75rem",
                        color: "#777",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {n.data}
                    </Box>
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

        <FiltroAvancado
          open={openFiltros}
          onClose={() => setOpenFiltros(false)}
          filters={filtrosAvancadosConfig}
          values={filtrosAvancados}
          onChange={setFiltrosAvancados}
          onApply={() => setOpenFiltros(false)}
          onClear={() => setFiltrosAvancados({})}
          anchorEl={anchorEl}
        />
      </Box>
    </motion.div>
  );
}
