import { useState } from "react";
import TabelaGenerica from "../templates/tabela/tabela-generica";
import ModalFormulario from "../templates/formulario-modal/modal-generico";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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

export default function Motoristas() {
  const [dados, setDados] = useState<Motorista | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");

  const dadosFiltrados = motoristasData.filter((motorista) =>
    motorista.nome.toLowerCase().includes(search.toLowerCase())
  );

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
          variant="contained"
          className="botao-cadastrar"
          startIcon={<AddCircleOutlineIcon />}
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
    </Box>
  );
}
