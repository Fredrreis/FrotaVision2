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
import PeopleIcon from "@mui/icons-material/People";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import "./motoristas.css";

interface Motorista extends Record<string, unknown> {
  nome: string;
  dataCadastro: string;
  caminhaoDirigido: string;
  ultimaViagem: string;
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

const colunasMotoristasModal = colunasMotoristas.filter(
  (coluna) =>
    !["dataCadastro", "caminhaoDirigido", "ultimaViagem"].includes(coluna.chave)
);

const motoristasData: Motorista[] = [
  {
    nome: "Eloise Taulner",
    dataCadastro: "14/09/2024",
    caminhaoDirigido: "Caminhão 4",
    ultimaViagem: "15/01/2025",
  },
  {
    nome: "Jett Dawson",
    dataCadastro: "29/01/2023",
    caminhaoDirigido: "Caminhão 2",
    ultimaViagem: "09/03/2025",
  },
  {
    nome: "Ingrid Grimwall",
    dataCadastro: "09/04/2021",
    caminhaoDirigido: "Caminhão 2",
    ultimaViagem: "23/12/2024",
  },
  {
    nome: "Jorge Almeida",
    dataCadastro: "14/02/2025",
    caminhaoDirigido: "Caminhão 1",
    ultimaViagem: "02/03/2025",
  },
];

// Campos únicos para filtro do tipo select
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
  { name: "ultimaViagem", label: "Data Última Viagem", type: "data" as const },
];

function formatarDataISOparaBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Motoristas() {
  const [dados, setDados] = useState<Motorista | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<Record<string, any>>(
    {}
  );

  const dadosFiltrados = motoristasData.filter((motorista) => {
    const matchSearch = motorista.nome
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCadastro = filtrosAvancados.dataCadastro
      ? motorista.dataCadastro ===
        formatarDataISOparaBR(filtrosAvancados.dataCadastro)
      : true;
    const matchCaminhao = filtrosAvancados.caminhaoDirigido
      ? motorista.caminhaoDirigido === filtrosAvancados.caminhaoDirigido
      : true;
    const matchUltima = filtrosAvancados.ultimaViagem
      ? motorista.ultimaViagem ===
        formatarDataISOparaBR(filtrosAvancados.ultimaViagem)
      : true;

    return matchSearch && matchCadastro && matchCaminhao && matchUltima;
  });

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
      caminhaoDirigido: "",
      ultimaViagem: "",
    });
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    if (modoEdicao && dados) {
      console.log("Salvando edição:", dados);
    } else if (dados) {
      console.log("Cadastrando novo motorista:", dados);
    }
    setOpen(false);
  };

  return (
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
                  <SearchIcon />
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
          Cadastrar Motorista
        </Button>
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
        colunas={colunasMotoristasModal}
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
