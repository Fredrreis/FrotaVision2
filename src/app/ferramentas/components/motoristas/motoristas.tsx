"use client";
import { useEffect, useState } from "react";
import {
  listarMotorista,
  Motorista as MotoristaAPI,
} from "@/api/services/motoristaService";
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
import PeopleIcon from "@mui/icons-material/People";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import Carregamento from "../../../components/carregamento/carregamento";
import { compareDateISO, formatarDataISOcomHora } from "@/utils/data";
import { motion } from "framer-motion";
import "./motoristas.css";

interface Motorista {
  nome: string;
  dataCadastro: string;
  dataOriginal: string;
  caminhaoDirigido: string;
  ultimaViagem: string;
  [key: string]: string;
}

const colunasMotoristas = [
  { chave: "nome", titulo: "Nome", ordenavel: false },
  { chave: "dataCadastro", titulo: "Data de Cadastro", ordenavel: true },
  {
    chave: "caminhaoDirigido",
    titulo: "Último Caminhão Dirigido",
    ordenavel: false,
  },
  { chave: "ultimaViagem", titulo: "Data Última Viagem", ordenavel: true },
];

const mapeamentoCampos = {
  Nome: "nome",
  "Data de Cadastro": "dataCadastro",
  "Último Caminhão Dirigido": "caminhaoDirigido",
  "Data Última Viagem": "ultimaViagem",
};

export default function Motoristas() {
  const [dadosApi, setDadosApi] = useState<MotoristaAPI[]>([]);
  const [dados, setDados] = useState<Motorista | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [openExportar, setOpenExportar] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    const controller = new AbortController();

    listarMotorista()
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

  const motoristasData: Motorista[] = dadosApi.map((m) => {
    const dataOriginal = m.data_cadastro || "";
    return {
      nome: m.nome || "—",
      dataCadastro: formatarDataISOcomHora(dataOriginal),
      dataOriginal,
      caminhaoDirigido: "—",
      ultimaViagem: "—",
    };
  });

  const dadosFiltrados = motoristasData.filter((m) => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase());
    const matchCadastro = filtrosAvancados.dataCadastro
      ? compareDateISO(m.dataOriginal, filtrosAvancados.dataCadastro)
      : true;
    const matchCaminhao = filtrosAvancados.caminhaoDirigido
      ? m.caminhaoDirigido === filtrosAvancados.caminhaoDirigido
      : true;
    const matchUltima = filtrosAvancados.ultimaViagem
      ? m.ultimaViagem === filtrosAvancados.ultimaViagem
      : true;

    return matchSearch && matchCadastro && matchCaminhao && matchUltima;
  });

  const opcoesCaminhao = [
    ...new Set(motoristasData.map((m) => m.caminhaoDirigido)),
  ];

  const filtrosAvancadosConfig = [
    { name: "dataCadastro", label: "Data de Cadastro", type: "data" as const },
    {
      name: "caminhaoDirigido",
      label: "Último Caminhão Dirigido",
      type: "select" as const,
      options: opcoesCaminhao,
    },
    {
      name: "ultimaViagem",
      label: "Data Última Viagem",
      type: "data" as const,
    },
  ];

  const handleEditar = (item: Motorista) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = (item: Motorista) => {
    console.log("Excluindo item:", item);
  };

  const handleCadastrar = () => {
    setDados({
      nome: "",
      dataCadastro: "",
      dataOriginal: "",
      caminhaoDirigido: "—",
      ultimaViagem: "—",
    });
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    console.log(modoEdicao ? "Salvando edição:" : "Cadastrando novo:", dados);
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
      <Box className="motoristas-container">
        <Box className="motoristas-header">
          <Typography variant="h6" className="motoristas-title">
            <PeopleIcon className="icon-title" /> MOTORISTAS
          </Typography>
        </Box>

        <Box className="motoristas-filtros">
          <Box className="search-filtros-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por nome"
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
              Cadastrar Motorista
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

        <TabelaGenerica<Motorista>
          colunas={colunasMotoristas}
          dados={dadosFiltrados}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          exibirExaminar={false}
        />

        <ModalFormulario<Motorista>
          open={open}
          onClose={() => setOpen(false)}
          onSalvar={handleSalvar}
          colunas={colunasMotoristas.filter((c) => c.chave === "nome")}
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
          colunas={colunasMotoristas.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
        />
      </Box>
    </motion.div>
  );
}
