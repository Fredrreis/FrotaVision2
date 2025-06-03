"use client";
import { useEffect, useState } from "react";
import {
  listarManutencaoRealizada,
  deletarManutencaoRealizada,
  ManutencaoRealizada,
} from "@/api/services/manutencaoRealizadaService";
import TabelaGenerica from "@/app/ferramentas/components/components/tabela/tabela-generica";
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
import EngineeringIcon from "@mui/icons-material/Engineering";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import Carregamento from "../../../components/carregamento/carregamento";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import { compareDateISO, formatarDataISOcomHora } from "@/utils/data";
import { motion } from "framer-motion";
import "../styles/shared-styles.css";
import "./manutencoes.css";

interface Manutencao {
  id: number;
  veiculo: string;
  tipoVeiculo: string;
  nome: string;
  km: number;
  horasMotor: number;
  descricao: string;
  data: string;
  dataOriginal: string;
  custo: string;
  tipo: string;
  [key: string]: unknown;
}

const colunasManutencoes = [
  { chave: "veiculo", titulo: "Veículo", ordenavel: false },
  { chave: "tipoVeiculo", titulo: "Tipo Caminhão", ordenavel: false },
  { chave: "nome", titulo: "Manutenção", ordenavel: false },
  { chave: "km", titulo: "Km da Manutenção", ordenavel: true },
  { chave: "horasMotor", titulo: "Horas do Motor", ordenavel: true },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "data", titulo: "Data", ordenavel: true },
  { chave: "custo", titulo: "Custo", ordenavel: true },
  { chave: "tipo", titulo: "Tipo", ordenavel: false },
];

const mapeamentoCampos = {
  Veículo: "veiculo",
  "Tipo Caminhão": "tipoVeiculo",
  Manutenção: "nome",
  "Km da Manutenção": "km",
  "Horas do Motor": "horasMotor",
  Descrição: "descricao",
  Data: "data",
  Custo: "custo",
  Tipo: "tipo",
};

export default function Manutencoes() {
  const [dadosApi, setDadosApi] = useState<ManutencaoRealizada[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<Manutencao | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [openExportar, setOpenExportar] = useState(false);
  const [anchorElFiltro, setAnchorElFiltro] = useState<HTMLElement | null>(
    null
  );
  const [anchorElExportar, setAnchorElExportar] = useState<HTMLElement | null>(
    null
  );
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
    listarManutencaoRealizada()
      .then((res) => {
        if (!controller.signal.aborted) setDadosApi(res);
      })
      .catch((err) => console.error("Erro:", err))
      .finally(() => !controller.signal.aborted && setCarregando(false));
    return () => controller.abort();
  }, []);

  const manutencoesData: Manutencao[] = dadosApi.map((m) => ({
    id: m.id_manutencao_realizada,
    veiculo: m.apelido || "Desconhecido",
    tipoVeiculo: "Tipo Caminhão",
    nome: m.nome || "—",
    km: m.quilometragem_ultima_manutencao ?? 0,
    horasMotor: m.horasMotorManutencao ?? 0,
    descricao: m.descricaoManutencao || "—",
    data: formatarDataISOcomHora(m.data_manutencao),
    dataOriginal: m.data_manutencao,
    custo: m.valor_manutencao?.toFixed(2).replace(".", ",") || "0,00",
    tipo: m.eManuntencaoPreventiva ? "Preventiva" : "Corretiva",
  }));

  const dadosFiltrados = manutencoesData.filter((m) => {
    const matchSearch =
      (m.veiculo?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (m.nome?.toLowerCase() ?? "").includes(search.toLowerCase());
    const matchTipoVeiculo = filtrosAvancados.tipoVeiculo
      ? m.tipoVeiculo === filtrosAvancados.tipoVeiculo
      : true;
    const matchData = filtrosAvancados.data
      ? compareDateISO(m.dataOriginal as string, filtrosAvancados.data)
      : true;
    const matchHorasMotor = filtrosAvancados.horasMotor
      ? m.horasMotor <= Number(filtrosAvancados.horasMotor)
      : true;
    const matchCusto = filtrosAvancados.custo
      ? parseFloat(m.custo.replace(",", ".")) <= filtrosAvancados.custo
      : true;
    const matchTipo = filtrosAvancados.tipo
      ? m.tipo === filtrosAvancados.tipo
      : true;
    const matchKm = filtrosAvancados.km ? m.km <= filtrosAvancados.km : true;
    return (
      matchSearch &&
      matchTipoVeiculo &&
      matchHorasMotor &&
      matchData &&
      matchCusto &&
      matchTipo &&
      matchKm
    );
  });

  const tiposVeiculo = [...new Set(manutencoesData.map((m) => m.tipoVeiculo))];
  const tiposManutencao = [...new Set(manutencoesData.map((m) => m.tipo))];
  const maxKm = Math.max(...manutencoesData.map((m) => m.km));
  const maxCusto = Math.max(
    ...manutencoesData.map((m) => parseFloat(m.custo.replace(",", ".")))
  );
  const maxHorasMotor = Math.max(...manutencoesData.map((m) => m.horasMotor));

  const filtrosAvancadosConfig = [
    {
      name: "tipoVeiculo",
      label: "Tipo Caminhão",
      type: "select" as const,
      options: tiposVeiculo,
    },
    { name: "data", label: "Data", type: "data" as const },
    {
      name: "tipo",
      label: "Tipo Manutenção",
      type: "select" as const,
      options: tiposManutencao,
    },
    {
      name: "horasMotor",
      label: "Horas do Motor",
      type: "range" as const,
      min: 0,
      max: maxHorasMotor,
    },
    {
      name: "custo",
      label: "Custo",
      type: "range" as const,
      min: 0,
      max: maxCusto,
    },
    { name: "km", label: "Km", type: "range" as const, min: 0, max: maxKm },
  ];

  const handleCadastrar = () => {
    setDados({} as Manutencao);
    setModoEdicao(false);
    setOpen(true);
  };

  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Manutenções..."
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
      <Box className="manutencoes-container">
        <Box className="manutencoes-header">
          <Typography variant="h6" className="manutencoes-title">
            <EngineeringIcon className="icon-title" /> MANUTENÇÕES
          </Typography>
        </Box>

        <Box className="manutencoes-filtros">
          <Box className="search-filtros-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por veículo ou manutenção"
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
              <span className="button-text">Filtros Avançados</span>
            </Button>
          </Box>

          <Box className="botoes-container">
            <Button
              variant="contained"
              className="botao-cadastrar"
              onClick={handleCadastrar}
            >
              Cadastrar Manutenção
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

        <TabelaGenerica<Manutencao>
          colunas={colunasManutencoes}
          dados={dadosFiltrados}
          onEditar={(item) => {
            setDados(item);
            setModoEdicao(true);
            setOpen(true);
          }}
          onExcluir={async (item) => {
            try {
              await deletarManutencaoRealizada(item.id);
              setDadosApi((prev) =>
                prev.filter((m) => m.id_manutencao_realizada !== item.id)
              );
              setSnackbarMensagem("Manutenção excluída com sucesso!");
              setSnackbarCor("primary");
              setSnackbarAberto(true);
            } catch (err) {
              setSnackbarMensagem(
                "Erro ao excluir manutenção. Tente novamente."
              );
              setSnackbarCor("light");
              setSnackbarAberto(true);
            }
          }}
          exibirExaminar={false}
        />

        <ModalFormulario<Manutencao>
          open={open}
          onClose={() => setOpen(false)}
          onSalvar={() => setOpen(false)}
          colunas={colunasManutencoes}
          dados={dados}
          setDados={setDados}
          modoEdicao={modoEdicao}
        />

        <FiltroAvancado
          open={openFiltros}
          onClose={() => setOpenFiltros(false)}
          anchorEl={anchorElFiltro}
          filters={filtrosAvancadosConfig}
          values={filtrosAvancados}
          onChange={setFiltrosAvancados}
          onApply={() => setOpenFiltros(false)}
          onClear={() => setFiltrosAvancados({})}
        />

        <ExportarRelatorioDialog
          open={openExportar}
          onClose={() => setOpenExportar(false)}
          anchorEl={anchorElExportar}
          colunas={colunasManutencoes.map((c) => c.titulo)}
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
