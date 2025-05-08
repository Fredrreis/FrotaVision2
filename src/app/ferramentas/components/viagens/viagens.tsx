"use client";
import { useEffect, useRef, useState } from "react";
import {
  listarViagens,
  deletarViagem,
  Viagem as ViagemAPI,
} from "@/api/services/viagemService";
import TabelaGenerica from "../components/tabela/tabela-generica";
import ModalFormulario from "../components/formulario-modal/formulario-generico";
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
import { compareDateISO, formatarDataISOcomHora } from "@/utils/data";
import { motion } from "framer-motion";
import CustomSnackbar from "../components/snackbar/snackbar";
import "./viagens.css";

interface Viagem {
  id: number;
  veiculo: string;
  motorista: string;
  origem: string;
  destino: string;
  dataSaida: string;
  dataRetorno: string;
  dataSaidaOriginal: string;
  dataRetornoOriginal: string;
  kmPercorrido: number;
  descricao: string;
  [key: string]: any;
}

const colunasViagens = [
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

export default function Viagens() {
  const [dadosApi, setDadosApi] = useState<ViagemAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<Viagem | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [openExportar, setOpenExportar] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<Record<string, any>>(
    {}
  );

  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState("");
  const [snackbarCor, setSnackbarCor] = useState<"primary" | "light">(
    "primary"
  );

  useEffect(() => {
    const controller = new AbortController();

    listarViagens()
      .then((res) => {
        if (!controller.signal.aborted) {
          setDadosApi(res);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.error("Erro:", err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      });

    return () => {
      controller.abort(); // cancela requisição
    };
  }, []);

  const viagensData: Viagem[] = dadosApi.map((v) => ({
    id: v.id_viagem,
    veiculo: v.apelido_veiculo || "—",
    motorista: v.nome_motorista || "—",
    origem: "Origem Temporária",
    destino: "Destino Temporária",
    dataSaida: formatarDataISOcomHora(v.data_inicio),
    dataRetorno: formatarDataISOcomHora(v.data_fim),
    dataSaidaOriginal: v.data_inicio,
    dataRetornoOriginal: v.data_fim,
    kmPercorrido: v.quilometragem_viagem ?? 0,
    descricao: "Descrição temporária",
  }));

  const dadosFiltrados = viagensData.filter((viagem) => {
    const matchesSearch =
      (viagem.veiculo?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (viagem.motorista?.toLowerCase() ?? "").includes(search.toLowerCase());

    const matchOrigem = filtrosAvancados.origem
      ? viagem.origem === filtrosAvancados.origem
      : true;

    const matchDestino = filtrosAvancados.destino
      ? viagem.destino === filtrosAvancados.destino
      : true;

    const matchSaida = filtrosAvancados.dataSaida
      ? compareDateISO(viagem.dataSaidaOriginal, filtrosAvancados.dataSaida)
      : true;

    const matchRetorno = filtrosAvancados.dataRetorno
      ? compareDateISO(viagem.dataRetornoOriginal, filtrosAvancados.dataRetorno)
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

  const origensUnicas = [...new Set(viagensData.map((v) => v.origem))];
  const destinosUnicas = [...new Set(viagensData.map((v) => v.destino))];
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

  const handleEditar = (item: Viagem) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = async (item: Viagem) => {
    try {
      await deletarViagem(item.id);
      setDadosApi((prev) => prev.filter((v) => v.id_viagem !== item.id));
      setSnackbarMensagem("Viagem excluída com sucesso!");
      setSnackbarCor("primary");
      setSnackbarAberto(true);
    } catch (err) {
      console.error("Erro ao excluir viagem:", err);
      setSnackbarMensagem("Erro ao excluir viagem. Tente novamente.");
      setSnackbarCor("light");
      setSnackbarAberto(true);
    }
  };

  const handleCadastrar = () => {
    setDados({} as Viagem);
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    console.log(
      modoEdicao ? "Salvando edição:" : "Cadastrando nova viagem:",
      dados
    );
    setOpen(false);
  };

  if (carregando) {
    return <Carregamento animationUrl="/lotties/carregamento.json" />;
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
              onClick={() => setOpenFiltros(true)}
            >
              Filtros Avançados
            </Button>
          </Box>

          <Box className="botoes-container">
            <Button
              variant="contained"
              className="botao-cadastrar"
              onClick={handleCadastrar}
            >
              Cadastrar Viagem
            </Button>
            <Button
              variant="contained"
              className="botao-exportar"
              startIcon={<IosShareIcon />}
              onClick={() => setOpenExportar(true)}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        <TabelaGenerica<Viagem>
          colunas={colunasViagens}
          dados={dadosFiltrados}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          exibirExaminar={false}
        />

        <ModalFormulario<Viagem>
          open={open}
          onClose={() => setOpen(false)}
          onSalvar={handleSalvar}
          colunas={colunasViagens}
          dados={dados}
          setDados={setDados}
          modoEdicao={modoEdicao}
        />

        <FiltroAvancado
          open={openFiltros}
          onClose={() => setOpenFiltros(false)}
          filters={filtrosAvancadosConfig}
          values={filtrosAvancados}
          onChange={setFiltrosAvancados}
          onApply={() => setOpenFiltros(false)}
          onClear={() => setFiltrosAvancados({})}
        />

        <ExportarRelatorioDialog
          open={openExportar}
          onClose={() => setOpenExportar(false)}
          colunas={colunasViagens.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
        />

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
