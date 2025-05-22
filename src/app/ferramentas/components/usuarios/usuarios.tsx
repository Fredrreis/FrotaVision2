"use client";
import { useEffect, useRef, useState } from "react";
import {
  listarUsuarios,
  deletarUsuario,
  Usuario as UsuarioAPI,
} from "@/api/services/usuarioService";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import Carregamento from "../../../components/carregamento/carregamento";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import { compareDateISO, formatarDataISOcomHora } from "@/utils/data";
import { motion } from "framer-motion";
import "./usuarios.css";

interface Usuario {
  nome: string;
  email: string;
  data: string;
  dataOriginal: string;
  permissoes: string;
  [key: string]: string;
}

const colunasUsuarios = [
  { chave: "email", titulo: "Email", ordenavel: false },
  { chave: "nome", titulo: "Nome de Usuário", ordenavel: false },
  { chave: "data", titulo: "Data", ordenavel: true },
  { chave: "permissoes", titulo: "Permissões do Usuário", ordenavel: false },
];

const mapeamentoCampos = {
  Email: "email",
  "Nome de Usuário": "nome",
  Data: "data",
  "Permissões do Usuário": "permissoes",
};

export default function Usuarios() {
  const [dadosApi, setDadosApi] = useState<UsuarioAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dados, setDados] = useState<Usuario | null>(null);
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

  const isMounted = useRef(true);

  useEffect(() => {
    const controller = new AbortController();

    listarUsuarios()
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

  const usuariosData: Usuario[] = dadosApi.map((u) => ({
    nome: u.nome_usuario || "—",
    email: u.email || "—",
    data: formatarDataISOcomHora(u.data_cadastro),
    dataOriginal: u.data_cadastro,
    permissoes: "Admin", // valor temporário
  }));

  const dadosFiltrados = usuariosData.filter((usuario) => {
    const matchSearch =
      usuario.nome.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase());

    const matchPermissao = filtrosAvancados.permissoes
      ? usuario.permissoes === filtrosAvancados.permissoes
      : true;

    const matchData = filtrosAvancados.data
      ? compareDateISO(usuario.dataOriginal, filtrosAvancados.data)
      : true;

    return matchSearch && matchPermissao && matchData;
  });

  const permissoesUnicas = [...new Set(usuariosData.map((u) => u.permissoes))];

  const filtrosAvancadosConfig = [
    {
      name: "permissoes",
      label: "Permissões",
      type: "select" as const,
      options: permissoesUnicas,
    },
    {
      name: "data",
      label: "Data",
      type: "data" as const,
    },
  ];

  const handleEditar = (item: Usuario) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = async (item: Usuario) => {
    try {
      const usuarioCorrespondente = dadosApi.find(
        (u) =>
          u.nome_usuario === item.nome &&
          u.email === item.email &&
          formatarDataISOcomHora(u.data_cadastro) === item.data
      );

      if (!usuarioCorrespondente) {
        throw new Error("Usuário não encontrado na lista original.");
      }

      await deletarUsuario(usuarioCorrespondente.id_usuario);
      setDadosApi((prev) =>
        prev.filter((u) => u.id_usuario !== usuarioCorrespondente.id_usuario)
      );

      setSnackbarMensagem("Usuário excluído com sucesso!");
      setSnackbarCor("primary");
      setSnackbarAberto(true);
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setSnackbarMensagem("Erro ao excluir usuário. Tente novamente.");
      setSnackbarCor("light");
      setSnackbarAberto(true);
    }
  };

  const handleCadastrar = () => {
    setDados({} as Usuario);
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    console.log(
      modoEdicao ? "Salvando edição:" : "Cadastrando novo usuário:",
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
      <Box className="usuarios-container">
        <Box className="usuarios-header">
          <Typography variant="h6" className="usuarios-title">
            <AccountCircleIcon className="icon-title" /> USUÁRIOS
          </Typography>
        </Box>

        <Box className="usuarios-filtros">
          <Box className="search-filtros-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por nome ou email"
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
              Cadastrar Usuário
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

        <TabelaGenerica<Usuario>
          colunas={colunasUsuarios}
          dados={dadosFiltrados}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
          exibirExaminar={false}
        />

        <ModalFormulario<Usuario>
          open={open}
          onClose={() => setOpen(false)}
          onSalvar={handleSalvar}
          colunas={colunasUsuarios}
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
          colunas={colunasUsuarios.map((c) => c.titulo)}
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
