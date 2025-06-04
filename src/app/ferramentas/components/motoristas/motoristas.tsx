"use client";
import { useEffect, useRef, useState } from "react";
import {
  listarMotorista,
  deletarMotorista,
  cadastrarMotorista,
  Motorista as MotoristaAPI,
} from "@/api/services/motoristaService";
import { useSession } from "next-auth/react";
import TabelaGenerica from "@/app/ferramentas/components/components/tabela/tabela-generica";
import ModalFormulario from "../components/formulario-modal/formulario-generico";
import ExportarRelatorioDialog from "../components/export/export-relatorio";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import CustomSnackbar from "../../../components/snackbar/snackbar";
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
import Carregamento from "../../../components/carregamento/carregamento";
import { compareDateISO, formatarDataISOcomHora } from "@/utils/data";
import { motion } from "framer-motion";
import "../styles/shared-styles.css";
import "./motoristas.css";

interface Motorista {
  id: number;
  nome: string;
  dataCadastro: string;
  dataOriginal: string;
  caminhaoDirigido: string;
  ultimaViagem: string;
  [key: string]: string | number;
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
  const { data: session } = useSession();
  const [dadosApi, setDadosApi] = useState<MotoristaAPI[]>([]);
  const [dados, setDados] = useState<Motorista | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [openExportar, setOpenExportar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
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

    if (!session?.user?.cnpj) return;

    listarMotorista(session.user.cnpj, controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) setDadosApi(res);
      })
      .catch((err) => {
        if (
          !(
            err.name === "CanceledError" ||
            err.code === "ERR_CANCELED" ||
            err.message === "canceled"
          )
        ) {
          console.error("Erro:", err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });

    return () => controller.abort();
  }, [session?.user?.cnpj]);

  const motoristasData: Motorista[] = dadosApi.map((m) => {
    const dataOriginal = m.data_cadastro || "";
    return {
      id: m.id_motorista,
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

  const handleExcluir = async (item: Motorista) => {
    try {
      await deletarMotorista(item.id);
      setDadosApi((prev) => prev.filter((m) => m.id_motorista !== item.id));
      setSnackbarMensagem("Motorista excluído com sucesso!");
      setSnackbarCor("primary");
      setSnackbarAberto(true);
    } catch (err) {
      console.error("Erro ao excluir motorista:", err);
      setSnackbarMensagem("Erro ao excluir motorista.");
      setSnackbarCor("light");
      setSnackbarAberto(true);
    }
  };

  const handleCadastrar = () => {
    setDados({
      id: 0,
      nome: "",
      dataCadastro: "",
      dataOriginal: "",
      caminhaoDirigido: "—",
      ultimaViagem: "—",
    });
    setModoEdicao(false);
    setOpen(true);
  };
  const handleSalvar = async () => {
    try {
      if (!dados?.nome) {
        alert("Nome é obrigatório");
        return;
      }
      if (!session?.user?.cnpj) {
        alert("Erro: CNPJ não encontrado na sessão.");
        return;
      }
      const payload = {
        id_motorista: 0,
        nome: dados.nome,
        data_cadastro: new Date().toISOString(),
        cnpj: session.user.cnpj,
        habilitado: true,
      };
      await cadastrarMotorista(payload);
      setSnackbarMensagem("Motorista cadastrado com sucesso!");
      setSnackbarCor("primary");
      setSnackbarAberto(true);
      setOpen(false);
      setCarregando(true);
      const res = await listarMotorista(session.user.cnpj);
      setDadosApi(res);
    } catch (err) {
      console.error("Erro ao cadastrar motorista:", err);
      setSnackbarMensagem("Erro ao cadastrar motorista.");
      setSnackbarCor("light");
      setSnackbarAberto(true);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Motoristas..."
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
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
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
              Cadastrar Motorista
            </Button>
            <Button
              variant="contained"
              className="botao-exportar"
              startIcon={<IosShareIcon />}
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
                setOpenExportar(true);
              }}
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
          anchorEl={anchorEl}
        />

        <ExportarRelatorioDialog
          open={openExportar}
          onClose={() => setOpenExportar(false)}
          colunas={colunasMotoristas.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
          anchorEl={anchorEl}
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
