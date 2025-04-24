import { useState } from "react";
import TabelaGenerica from "../components/tabela/tabela-generica";
import ModalFormulario from "../components/formulario-modal/formulario-generico";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import "./usuarios.css";

interface Usuario extends Record<string, unknown> {
  email: string;
  nome: string;
  data: string;
  permissoes: string;
}

const colunasUsuarios: {
  chave: string;
  titulo: string;
  ordenavel: boolean;
}[] = [
  { chave: "email", titulo: "Email", ordenavel: false },
  { chave: "nome", titulo: "Nome de Usuário", ordenavel: false },
  { chave: "data", titulo: "Data", ordenavel: true },
  { chave: "permissoes", titulo: "Permissões do Usuário", ordenavel: false },
];

const dadosUsuarios: Usuario[] = [
  {
    email: "paulo@example.com",
    nome: "Paulo Franco",
    data: "12/01/2023",
    permissoes: "Admin",
  },
  {
    email: "maria@example.com",
    nome: "Maria Souza",
    data: "25/02/2023",
    permissoes: "Editor",
  },
  {
    email: "ana@example.com",
    nome: "Ana Lima",
    data: "05/03/2023",
    permissoes: "Visualizador",
  },
];

const filtrosAvancadosConfig = [
  {
    name: "permissoes",
    label: "Permissões",
    type: "select" as const,
    options: ["Admin", "Editor", "Visualizador"],
  },
  { name: "data", label: "Data", type: "data" as const },
];

function formatarDataISOparaBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Usuarios() {
  const [dados, setDados] = useState<Usuario | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<Record<string, any>>(
    {}
  );

  const dadosFiltrados = dadosUsuarios.filter((usuario) => {
    const matchSearch =
      usuario.nome.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase());

    const matchPermissao = filtrosAvancados.permissoes
      ? usuario.permissoes === filtrosAvancados.permissoes
      : true;

    const matchData = filtrosAvancados.data
      ? usuario.data === formatarDataISOparaBR(filtrosAvancados.data)
      : true;

    return matchSearch && matchPermissao && matchData;
  });

  const handleEditar = (item: Usuario) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = (item: Usuario) => {
    console.log("Excluindo item:", item);
  };

  const handleCadastrar = () => {
    setDados({} as Usuario);
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    if (modoEdicao) {
      console.log("Salvando edição:", dados);
    } else {
      console.log("Cadastrando novo usuário:", dados);
    }
    setOpen(false);
  };

  return (
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

        <Button
          variant="contained"
          className="botao-cadastrar"
          onClick={handleCadastrar}
        >
          Cadastrar Usuário
        </Button>
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
    </Box>
  );
}
