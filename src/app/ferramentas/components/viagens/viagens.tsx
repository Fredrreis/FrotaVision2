"use client";
import { useEffect, useState, useCallback } from "react";
import {
  listarViagensDetalhado,
  cadastrarViagem,
  atualizarViagem,
  deletarViagem,
  ViagemDetalhada,
  ViagemPayload,
} from "@/api/services/viagemService";
import { useSession } from "next-auth/react";
import TabelaGenerica from "@/app/ferramentas/components/components/tabela/tabela-generica";
import ExportarRelatorioDialog from "../components/export/export-relatorio";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TimelineIcon from "@mui/icons-material/Timeline";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import Carregamento from "../../../components/carregamento/carregamento";
import {
  compareDateISO,
  formatarDataISOcomHora,
  inputDatetimeLocalToISO,
} from "@/utils/data";
import { motion } from "framer-motion";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import "../styles/shared-styles.css";
import "./viagens.css";
import EditarGenerico from "@/app/components/genericos/editarGenerico";
import CadastrarGenerico from "@/app/components/genericos/cadastrarGenerico";
import DeletarGenerico from "@/app/components/genericos/deletarGenerico";
import { listarVeiculos } from "@/api/services/veiculoService";
import { listarMotoristas } from "@/api/services/motoristaService";
import { viagemSchema } from "@/utils/viagem-validation";

interface SessionUser {
  cnpj: string;
}

interface Session {
  user: SessionUser;
}

interface Veiculo {
  id_veiculo: number;
  apelido?: string;
  placa?: string;
}

interface Motorista {
  id_motorista: number;
  nome: string;
}

const colunasViagens: {
  chave:
    | "id"
    | "veiculo"
    | "motorista"
    | "origem"
    | "destino"
    | "dataSaida"
    | "dataRetorno"
    | "kmPercorrido"
    | "descricao";
  titulo: string;
  ordenavel: boolean;
}[] = [
  { chave: "veiculo", titulo: "Veículo", ordenavel: false },
  { chave: "motorista", titulo: "Motorista", ordenavel: false },
  { chave: "origem", titulo: "Origem", ordenavel: false },
  { chave: "destino", titulo: "Destino", ordenavel: false },
  { chave: "dataSaida", titulo: "Data de Saída", ordenavel: true },
  { chave: "dataRetorno", titulo: "Data de Retorno", ordenavel: true },
  { chave: "kmPercorrido", titulo: "Km Percorrido", ordenavel: true },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
];

const mapeamentoCampos = {
  Veículo: "veiculo",
  Motorista: "motorista",
  Origem: "origem",
  Destino: "destino",
  "Data de Saída": "dataSaida",
  "Data de Retorno": "dataRetorno",
  "Km Percorrido": "kmPercorrido",
  Descrição: "descricao",
};

const colunasFormulario: {
  chave: string;
  titulo: string;
  tipo: "texto" | "number" | "datetime" | "area" | "selecao";
}[] = [
  { chave: "id_veiculo", titulo: "Veículo", tipo: "selecao" },
  { chave: "id_motorista", titulo: "Motorista", tipo: "selecao" },
  { chave: "origem", titulo: "Origem", tipo: "texto" },
  { chave: "destino", titulo: "Destino", tipo: "texto" },
  { chave: "data_inicio", titulo: "Data de Saída", tipo: "datetime" },
  { chave: "data_fim", titulo: "Data de Retorno", tipo: "datetime" },
  { chave: "quilometragem_viagem", titulo: "Km Percorrido", tipo: "number" },
  { chave: "descricao", titulo: "Descrição", tipo: "area" },
];

async function obterOpcoesDinamicas(session: unknown) {
  if (
    !session ||
    typeof session !== "object" ||
    !("user" in session) ||
    !(session as Session).user?.cnpj
  ) {
    return { id_veiculo: [], id_motorista: [] };
  }
  try {
    const user = (session as Session).user;
    const [veiculos, motoristas] = await Promise.all([
      listarVeiculos(user.cnpj),
      listarMotoristas(user.cnpj),
    ]);
    return {
      id_veiculo: veiculos.map((v: Veiculo) => ({
        label: v.apelido || v.placa || "Sem nome",
        value: String(v.id_veiculo),
      })),
      id_motorista: motoristas.map((m: Motorista) => ({
        label: m.nome,
        value: String(m.id_motorista),
      })),
    };
  } catch {
    return { id_veiculo: [], id_motorista: [] };
  }
}

export default function Viagens() {
  const { data: session } = useSession();
  const [dadosApi, setDadosApi] = useState<ViagemDetalhada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [openCriar, setOpenCriar] = useState(false);
  const [itemSelecionado, setItemSelecionado] =
    useState<ViagemDetalhada | null>(null);
  const [openEditar, setOpenEditar] = useState(false);
  const [openDeletar, setOpenDeletar] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [anchorElFiltro, setAnchorElFiltro] = useState<HTMLElement | null>(
    null
  );
  const [openExportar, setOpenExportar] = useState(false);
  const [anchorElExportar, setAnchorElExportar] = useState<HTMLElement | null>(
    null
  );
  const [filtrosAvancados, setFiltrosAvancados] = useState<
    Record<string, unknown>
  >({});
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState("");
  const [snackbarCor, setSnackbarCor] = useState<"primary" | "light">(
    "primary"
  );
  const [origensFiltro, setOrigensFiltro] = useState<string[]>([]);
  const [destinosFiltro, setDestinosFiltro] = useState<string[]>([]);

  useEffect(() => {
    console.log("[DEBUG] Session em Viagens:", session);
  }, [session]);

  const carregarViagens = useCallback(() => {
    if (!session?.user?.cnpj) {
      console.log(
        "[DEBUG] CNPJ não encontrado na sessão em Viagens! Session:",
        session
      );
      return;
    }
    setCarregando(true);
    console.log(
      "[DEBUG] Chamando listarViagensDetalhado com CNPJ:",
      session.user.cnpj
    );
    listarViagensDetalhado(session.user.cnpj)
      .then((res) => {
        console.log("[DEBUG] Resposta da API listarViagensDetalhado:", res);
        setDadosApi(res);
      })
      .catch((err) => {
        console.error("[DEBUG] Erro ao carregar viagens:", err);
      })
      .finally(() => {
        console.log("[DEBUG] Finalizou carregamento de viagens");
        setCarregando(false);
      });
  }, [session?.user?.cnpj]);

  useEffect(() => {
    if (session?.user?.cnpj) {
      carregarViagens();
    }
  }, [session?.user?.cnpj, carregarViagens]);

  useEffect(() => {
    async function fetchOrigensDestinosFiltro() {
      if (!session?.user?.cnpj) return;
      const viagens = await listarViagensDetalhado(session.user.cnpj);
      setOrigensFiltro([...new Set(viagens.map((v) => v.origem || "—"))]);
      setDestinosFiltro([...new Set(viagens.map((v) => v.destino || "—"))]);
    }
    fetchOrigensDestinosFiltro();
  }, [session?.user?.cnpj]);

  // View-model para tabela
  const viagensData = dadosApi.map((v) => ({
    id: v.id_viagem,
    veiculo: v.apelido_veiculo || "—",
    motorista: v.nome_motorista || "—",
    origem: v.origem || "—",
    destino: v.destino || "—",
    dataSaida: v.data_inicio ? formatarDataISOcomHora(v.data_inicio) : "—",
    dataRetorno: v.data_fim ? formatarDataISOcomHora(v.data_fim) : "—",
    dataSaidaOriginal: v.data_inicio || "",
    dataRetornoOriginal: v.data_fim || "",
    kmPercorrido: v.quilometragem_viagem ?? 0,
    descricao: v.descricao || "—",
  }));

  // Filtros e busca
  const dadosFiltrados = viagensData.filter((viagem) => {
    const matchesSearch =
      (viagem.veiculo?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (viagem.motorista?.toLowerCase() ?? "").includes(search.toLowerCase());

    const matchOrigem = filtrosAvancados.origem
      ? viagem.origem === String(filtrosAvancados.origem)
      : true;
    const matchDestino = filtrosAvancados.destino
      ? viagem.destino === String(filtrosAvancados.destino)
      : true;
    const matchSaida = filtrosAvancados.dataSaida
      ? compareDateISO(
          viagem.dataSaidaOriginal,
          String(filtrosAvancados.dataSaida)
        )
      : true;
    const matchRetorno = filtrosAvancados.dataRetorno
      ? compareDateISO(
          viagem.dataRetornoOriginal,
          String(filtrosAvancados.dataRetorno)
        )
      : true;
    const matchKm =
      filtrosAvancados.km !== undefined && filtrosAvancados.km !== ""
        ? viagem.kmPercorrido <= Number(filtrosAvancados.km)
        : true;

    return (
      matchesSearch &&
      matchOrigem &&
      matchDestino &&
      matchSaida &&
      matchRetorno &&
      matchKm
    );
  });

  const origensUnicas = origensFiltro;
  const destinosUnicas = destinosFiltro;
  const maxKm = Math.max(0, ...viagensData.map((v) => v.kmPercorrido));

  const filtrosAvancadosConfig = [
    {
      name: "origem",
      label: "Origem",
      type: "select" as const,
      options: origensUnicas,
    },
    {
      name: "destino",
      label: "Destino",
      type: "select" as const,
      options: destinosUnicas,
    },
    { name: "dataSaida", label: "Data de Saída", type: "data" as const },
    { name: "dataRetorno", label: "Data de Retorno", type: "data" as const },
    { name: "km", label: "Km", type: "range" as const, min: 0, max: maxKm },
  ];

  // prepara payload de edição
  const payloadEdicao: ViagemPayload | null =
    itemSelecionado && session?.user?.cnpj
      ? {
          id_viagem: itemSelecionado.id_viagem,
          id_veiculo: itemSelecionado.id_veiculo,
          quilometragem_viagem: itemSelecionado.quilometragem_viagem,
          id_motorista: itemSelecionado.id_motorista,
          origem: itemSelecionado.origem,
          destino: itemSelecionado.destino,
          data_inicio: itemSelecionado.data_inicio,
          data_fim: itemSelecionado.data_fim,
          descricao: itemSelecionado.descricao,
          habilitado: true,
          cnpj: session.user.cnpj,
        }
      : null;

  const handleChange = (values: Record<string, unknown>) => {
    setFiltrosAvancados(values);
  };

  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Viagens..."
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
      <Box className="viagens-container">
        <Box className="viagens-header">
          <Typography variant="h6" className="viagens-title">
            <TimelineIcon className="icon-title" /> VIAGENS
          </Typography>
        </Box>
        <Box className="viagens-filtros">
          <Box className="search-filtros-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por veículo ou motorista"
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
                setAnchorElFiltro(e.currentTarget);
                setOpenFiltros(true);
              }}
            >
              Filtros Avançados
            </Button>
          </Box>
          <Box className="botoes-container">
            <Button
              variant="contained"
              className="botao-cadastrar"
              onClick={() => setOpenCriar(true)}
            >
              Cadastrar Viagem
            </Button>
            <Button
              variant="contained"
              className="botao-exportar"
              startIcon={<IosShareIcon />}
              onClick={(e) => {
                setAnchorElExportar(e.currentTarget);
                setOpenExportar(true);
              }}
            >
              Exportar
            </Button>
          </Box>
        </Box>
        <TabelaGenerica
          colunas={colunasViagens}
          dados={dadosFiltrados}
          onEditar={(item) => {
            const original = dadosApi.find((v) => v.id_viagem === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenEditar(true);
            }
          }}
          onExcluir={(item) => {
            const original = dadosApi.find((v) => v.id_viagem === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenDeletar(true);
            }
          }}
          exibirExaminar={false}
        />
        {/* Modal de Edição */}
        {openEditar && payloadEdicao && (
          <EditarGenerico<ViagemPayload>
            open={openEditar}
            onClose={() => setOpenEditar(false)}
            titulo="EDITAR VIAGEM"
            colunas={colunasFormulario}
            itemEdicao={payloadEdicao}
            obterOpcoesDinamicas={() => obterOpcoesDinamicas(session)}
            schema={viagemSchema}
            onSalvar={async (payload) => {
              setCarregando(true);
              try {
                const payloadFinal = {
                  ...payload,
                  data_inicio: inputDatetimeLocalToISO(payload.data_inicio),
                  data_fim: inputDatetimeLocalToISO(payload.data_fim),
                };
                await atualizarViagem(payloadFinal.id_viagem, payloadFinal);
                await carregarViagens();
                setSnackbarMensagem("Viagem editada com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem("Erro ao editar viagem. Tente novamente.");
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenEditar(false);
              }
            }}
          />
        )}
        {/* Modal de Criação */}
        {openCriar && (
          <CadastrarGenerico<ViagemPayload>
            open={openCriar}
            onClose={() => setOpenCriar(false)}
            titulo="CADASTRAR VIAGEM"
            colunas={colunasFormulario}
            obterOpcoesDinamicas={() => obterOpcoesDinamicas(session)}
            schema={viagemSchema}
            onSalvar={async (formValues) => {
              setCarregando(true);
              const payload: ViagemPayload = {
                ...formValues,
                id_viagem: 0,
                habilitado: true,
                cnpj: session?.user?.cnpj ?? "",
                data_inicio: inputDatetimeLocalToISO(formValues.data_inicio),
                data_fim: inputDatetimeLocalToISO(formValues.data_fim),
              };
              try {
                await cadastrarViagem(payload);
                await carregarViagens();
                setSnackbarMensagem("Viagem cadastrada com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao cadastrar viagem. Tente novamente."
                );
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenCriar(false);
              }
            }}
          />
        )}
        {/* Filtros Avançados */}
        <FiltroAvancado
          open={openFiltros}
          onClose={() => setOpenFiltros(false)}
          anchorEl={anchorElFiltro}
          filters={filtrosAvancadosConfig}
          values={filtrosAvancados}
          onChange={handleChange}
          onApply={() => setOpenFiltros(false)}
          onClear={() => setFiltrosAvancados({})}
        />
        {/* Exportar */}
        <ExportarRelatorioDialog
          open={openExportar}
          onClose={() => setOpenExportar(false)}
          anchorEl={anchorElExportar}
          colunas={colunasViagens.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
        />
        {/* Modal de Deleção */}
        {openDeletar && itemSelecionado && (
          <DeletarGenerico<ViagemDetalhada>
            open={openDeletar}
            onClose={() => setOpenDeletar(false)}
            item={itemSelecionado}
            getDescricao={(v) => `viagem de "${v.nome_motorista}"`}
            onConfirmar={async (v) => {
              setCarregando(true);
              try {
                await deletarViagem(v.id_viagem);
                await carregarViagens();
                setSnackbarMensagem("Viagem excluída com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem("Erro ao excluir viagem. Tente novamente.");
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenDeletar(false);
                setItemSelecionado(null);
              }
            }}
          />
        )}
        {/* Snackbar */}
        <CustomSnackbar
          open={snackbarAberto}
          onClose={() => setSnackbarAberto(false)}
          message={snackbarMensagem}
          color={snackbarCor}
        />
      </Box>
    </motion.div>
  );
}
