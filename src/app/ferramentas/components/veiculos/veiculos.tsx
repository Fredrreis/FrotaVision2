"use client";
import { useEffect, useState } from "react";
import {
  listarVeiculos,
  deletarVeiculo,
  Veiculo as VeiculoAPI,
} from "@/api/services/veiculoService";
import TabelaGenerica from "../components/tabela/tabela-generica";
import ModalFormulario from "../components/formulario-modal/formulario-generico";
import ExportarRelatorioDialog from "../components/export/export-relatorio";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import IosShareIcon from "@mui/icons-material/IosShare";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import Carregamento from "../../../components/carregamento/carregamento";
import { formatarDataISOcomHora, compareDateISO } from "@/utils/data";
import { motion } from "framer-motion";
import "./veiculos.css";

interface Veiculo {
  id: number;
  placa: string;
  nome: string;
  tipo: string;
  chassi: string;
  descricao: string;
  km: number;
  ano: number;
  data: string;
  dataOriginal: string;
  [key: string]: string | number | boolean;
}

const colunasVeiculos = [
  { chave: "placa", titulo: "Placa", ordenavel: false },
  { chave: "nome", titulo: "Nome", ordenavel: false },
  { chave: "tipo", titulo: "Tipo Caminhão", ordenavel: false },
  { chave: "chassi", titulo: "Chassi", ordenavel: false },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "km", titulo: "Km", ordenavel: true },
  { chave: "ano", titulo: "Ano", ordenavel: true },
  { chave: "data", titulo: "Data", ordenavel: true },
];

const mapeamentoCampos = {
  Placa: "placa",
  Nome: "nome",
  "Tipo Caminhão": "tipo",
  Chassi: "chassi",
  Descrição: "descricao",
  Km: "km",
  Ano: "ano",
  Data: "data",
};

export default function Veiculos() {
  const [dadosApi, setDadosApi] = useState<VeiculoAPI[]>([]);
  const [dados, setDados] = useState<Veiculo | null>(null);
  const [carregando, setCarregando] = useState(true);
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

    listarVeiculos()
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

  const dadosFiltrados: Veiculo[] = dadosApi
    .map((v) => {
      const dataOriginal = v.data_cadastro || "";
      return {
        id: v.id_veiculo,
        placa: v.placa || "—",
        nome: v.apelido || "—",
        tipo: String(v.tipo) || "—",
        chassi: v.chassi || "—",
        descricao: v.descricao || "—",
        km: v.quilometragem ?? 0,
        ano: v.ano ?? 0,
        data: formatarDataISOcomHora(dataOriginal),
        dataOriginal,
      };
    })
    .filter((veiculo) => {
      const matchSearch =
        veiculo.nome.toLowerCase().includes(search.toLowerCase()) ||
        veiculo.placa.toLowerCase().includes(search.toLowerCase());

      const matchTipo = filtrosAvancados.tipo
        ? veiculo.tipo === filtrosAvancados.tipo
        : true;

      const matchAno = filtrosAvancados.ano
        ? veiculo.ano === Number(filtrosAvancados.ano)
        : true;

      const matchKm =
        filtrosAvancados.km !== undefined && filtrosAvancados.km !== ""
          ? veiculo.km <= Number(filtrosAvancados.km)
          : true;

      const matchData = filtrosAvancados.data
        ? compareDateISO(veiculo.dataOriginal, filtrosAvancados.data)
        : true;

      return matchSearch && matchTipo && matchAno && matchKm && matchData;
    });

  const tiposUnicos = [...new Set(dadosFiltrados.map((v) => v.tipo))];
  const maxKm = Math.max(0, ...dadosFiltrados.map((v) => v.km));

  const filtrosAvancadosConfig = [
    {
      name: "tipo",
      label: "Tipo Caminhão",
      type: "select" as const,
      options: tiposUnicos,
    },
    { name: "ano", label: "Ano", type: "number" as const },
    { name: "data", label: "Data", type: "data" as const },
    { name: "km", label: "Km", type: "range" as const, min: 0, max: maxKm },
  ];

  const handleEditar = (item: Veiculo) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = async (item: Veiculo) => {
    try {
      await deletarVeiculo(item.id);
      setDadosApi((prev) => prev.filter((v) => v.id_veiculo !== item.id));
      setSnackbarMensagem("Veículo excluído com sucesso!");
      setSnackbarCor("primary");
      setSnackbarAberto(true);
    } catch (err) {
      console.error("Erro ao excluir veículo:", err);
      setSnackbarMensagem("Erro ao excluir veículo. Tente novamente.");
      setSnackbarCor("light");
      setSnackbarAberto(true);
    }
  };

  const handleCadastrar = () => {
    setDados({} as Veiculo);
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    console.log(modoEdicao ? "Salvando edição:" : "Cadastrando novo:", dados);
    setOpen(false);
  };

  const handleVisualizar = (item: Veiculo) => {
    console.log("Visualizar veículo:", item);
  };

  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Veículos..."
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
      <Box className="veiculos-container">
        <Box className="veiculos-header">
          <Typography variant="h6" className="veiculos-title">
            <LocalShippingIcon className="icon-title" /> VEÍCULOS
          </Typography>
        </Box>

        <Box className="veiculos-filtros">
          <Box className="search-filtros-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por placa ou nome"
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
              Cadastrar Veículo
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

        <TabelaGenerica<Veiculo>
          colunas={colunasVeiculos}
          dados={dadosFiltrados}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          exibirExaminar={true}
          onExaminar={handleVisualizar}
        />

        <ModalFormulario<Veiculo>
          open={open}
          onClose={() => setOpen(false)}
          onSalvar={handleSalvar}
          colunas={colunasVeiculos}
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
          colunas={colunasVeiculos.map((c) => c.titulo)}
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
