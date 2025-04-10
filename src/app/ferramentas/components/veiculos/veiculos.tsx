import { useState } from "react";
import TabelaGenerica from "../templates/tabela/tabela-generica";
import ModalFormulario from "../templates/formulario-modal/formulario-generico";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FiltroAvancado from "../filtro/filtro-avancado";
import "./veiculos.css";

interface Veiculo extends Record<string, unknown> {
  placa: string;
  nome: string;
  tipo: string;
  chassi: string;
  descricao: string;
  km: number;
  ano: number;
  data: string;
}

const colunasVeiculos: {
  chave:
    | "placa"
    | "nome"
    | "tipo"
    | "chassi"
    | "descricao"
    | "km"
    | "ano"
    | "data";
  titulo: string;
  ordenavel: boolean;
}[] = [
  { chave: "placa", titulo: "Placa", ordenavel: false },
  { chave: "nome", titulo: "Nome", ordenavel: false },
  { chave: "tipo", titulo: "Tipo Caminhão", ordenavel: false },
  { chave: "chassi", titulo: "Chassi", ordenavel: false },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "km", titulo: "Km", ordenavel: true },
  { chave: "ano", titulo: "Ano", ordenavel: true },
  { chave: "data", titulo: "Data", ordenavel: true },
];

const dadosVeiculos: Veiculo[] = [
  {
    placa: "ABC1D34",
    nome: "Caminhão 1",
    tipo: "Betoneira",
    chassi: "9BWZZZ377VT004251",
    descricao: "Modelo A, cor branca",
    km: 134.5,
    ano: 2014,
    data: "23/09/2023",
  },
  {
    placa: "XYZ2E56",
    nome: "Caminhão 2",
    tipo: "Basculante",
    chassi: "8ABCDZ998HT003122",
    descricao: "Modelo B, cor azul",
    km: 256.8,
    ano: 2018,
    data: "23/09/2023",
  },
  {
    placa: "LMN3F78",
    nome: "Caminhão 3",
    tipo: "Carga Seca",
    chassi: "7XYYZ123ET002233",
    descricao: "Modelo C, cor vermelha",
    km: 98.2,
    ano: 2016,
    data: "30/12/2021",
  },
  {
    placa: "OPQ4G90",
    nome: "Caminhão 4",
    tipo: "Sider",
    chassi: "5LMNO999RT006789",
    descricao: "Modelo D, cor preta",
    km: 430.1,
    ano: 2012,
    data: "15/02/2023",
  },
  {
    placa: "RST5H12",
    nome: "Caminhão 5",
    tipo: "Prancha",
    chassi: "3ZXXTT667GH001111",
    descricao: "Modelo E, cor cinza",
    km: 210,
    ano: 2020,
    data: "08/07/2020",
  },
];

const tiposUnicos = [...new Set(dadosVeiculos.map((v) => v.tipo))];
const maxKm = Math.max(...dadosVeiculos.map((v) => v.km));

const filtrosAvancadosConfig = [
  { name: "tipo", label: "Tipo Caminhão", type: "select" as const, options: tiposUnicos },
  { name: "ano", label: "Ano", type: "number" as const },
  { name: "data", label: "Data", type: "data" as const },
  { name: "km", label: "Km", type: "range" as const, min: 0, max: maxKm }
];

function formatarDataISOparaBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Veiculos() {
  const [dados, setDados] = useState<Veiculo | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<Record<string, any>>({});

  const dadosFiltrados = dadosVeiculos.filter((veiculo) => {
    const matchSearch =
      veiculo.nome.toLowerCase().includes(search.toLowerCase()) ||
      veiculo.placa.toLowerCase().includes(search.toLowerCase());

    const matchTipo = filtrosAvancados.tipo ? veiculo.tipo === filtrosAvancados.tipo : true;
    const matchAno = filtrosAvancados.ano ? veiculo.ano === Number(filtrosAvancados.ano) : true;
    const matchKm = filtrosAvancados.km !== undefined && filtrosAvancados.km !== ''
      ? veiculo.km <= Number(filtrosAvancados.km)
      : true;
    const matchData = filtrosAvancados.data
      ? veiculo.data === formatarDataISOparaBR(filtrosAvancados.data)
      : true;

    return matchSearch && matchTipo && matchAno && matchKm && matchData;
  });

  const handleEditar = (item: Veiculo) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = (item: Veiculo) => {
    console.log("Excluindo item:", item);
  };

  const handleCadastrar = () => {
    setDados({} as Veiculo);
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    if (modoEdicao) {
      console.log("Salvando edição:", dados);
    } else {
      console.log("Cadastrando novo veículo:", dados);
    }
    setOpen(false);
  };

  return (
    <Box className="viagens-container">
      <Box className="viagens-header">
        <Typography variant="h6" className="viagens-title">
          <TimelineIcon className="icon-title" /> VEÍCULOS
        </Typography>
      </Box>

      <Box className="viagens-filtros">
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
          onClick={() => setOpenFiltros(true)}
        >
          Filtros Avançados
        </Button>
        <Button
          variant="contained"
          className="botao-cadastrar"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleCadastrar}
        >
          Cadastrar Veículo
        </Button>
      </Box>

      <TabelaGenerica<Veiculo>
        colunas={colunasVeiculos}
        dados={dadosFiltrados}
        onEditar={handleEditar}
        onExcluir={handleExcluir}
        exibirExaminar={false}
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
    </Box>
  );
}
