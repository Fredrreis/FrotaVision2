import { useState } from "react";
import TabelaGenerica from "../templates/tabela/tabela-generica";
import ModalFormulario from "../templates/formulario-modal/modal-generico";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./manutencoes.css";

interface Manutencao extends Record<string, unknown> {
  veiculo: string;
  tipoVeiculo: string;
  manutencao: string;
  km: number;
  horasMotor: number;
  descricao: string;
  data: string;
  custo: string;
  tipo: string;
}

const colunasManutencoes: {
  chave:
    | "veiculo"
    | "tipoVeiculo"
    | "manutencao"
    | "km"
    | "horasMotor"
    | "descricao"
    | "data"
    | "custo"
    | "tipo";
  titulo: string;
  ordenavel: boolean;
}[] = [
  { chave: "veiculo", titulo: "Veículo", ordenavel: false },
  { chave: "tipoVeiculo", titulo: "Tipo Caminhão", ordenavel: false },
  { chave: "manutencao", titulo: "Manutenção", ordenavel: false },
  { chave: "km", titulo: "Km da Manutenção", ordenavel: true },
  { chave: "horasMotor", titulo: "Horas do Motor", ordenavel: true },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "data", titulo: "Data", ordenavel: true },
  { chave: "custo", titulo: "Custo", ordenavel: true },
  { chave: "tipo", titulo: "Tipo", ordenavel: false },
];

const colunasManutencoesModal = colunasManutencoes;

const manutencoesData: Manutencao[] = [
  {
    veiculo: "Caminhão 1",
    tipoVeiculo: "Betoneira",
    manutencao: "Troca de óleo",
    km: 90.7,
    horasMotor: 4500,
    descricao: "Troca completa de óleo do motor.",
    data: "10/03/2024",
    custo: "250,00",
    tipo: "Preventiva",
  },
  {
    veiculo: "Caminhão 2",
    tipoVeiculo: "Basculante",
    manutencao: "Reparo no motor",
    km: 140.1,
    horasMotor: 5200,
    descricao: "Substituição de componentes do motor.",
    data: "15/02/2024",
    custo: "1200,10",
    tipo: "Corretiva",
  },
  {
    veiculo: "Caminhão 3",
    tipoVeiculo: "Carga Seca",
    manutencao: "Revisão completa",
    km: 50.2,
    horasMotor: 3900,
    descricao: "Revisão preventiva geral.",
    data: "22/01/2024",
    custo: "540,50",
    tipo: "Preventiva",
  },
];

export default function Manutencoes() {
  const [dados, setDados] = useState<Manutencao | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const dadosFiltrados = manutencoesData.filter((manutencao) => {
    const matchesSearch =
      manutencao.veiculo.toLowerCase().includes(search.toLowerCase()) ||
      manutencao.manutencao.toLowerCase().includes(search.toLowerCase());

    const matchesFiltro =
      filtroTipo === "todos" ? true : manutencao.tipo === filtroTipo;

    return matchesSearch && matchesFiltro;
  });

  const handleEditar = (item: Manutencao) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = (item: Manutencao) => {
    console.log("Excluindo item:", item);
  };

  const handleCadastrar = () => {
    setDados({} as Manutencao);
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    if (modoEdicao) {
      console.log("Salvando edição:", dados);
    } else {
      console.log("Cadastrando nova manutenção:", dados);
    }
    setOpen(false);
  };

  return (
    <Box className="manutencoes-container">
      <Box className="manutencoes-header">
        <Typography variant="h6" className="manutencoes-title">
          <EngineeringIcon className="icon-title" /> MANUTENÇÕES
        </Typography>
      </Box>

      <Box className="manutencoes-filtros">
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
        <Box className="filtro-status">
          <Typography variant="body2" className="filtro-label">
            Filtrar por tipo de manutenção
          </Typography>
          <RadioGroup
            row
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="radio-group"
          >
            <FormControlLabel
              value="todos"
              control={<Radio className="radio-button" />}
              label={<Typography className="radio-text">Todos</Typography>}
            />
            <FormControlLabel
              value="Preventiva"
              control={<Radio className="radio-button" />}
              label={<Typography className="radio-text">Preventiva</Typography>}
            />
            <FormControlLabel
              value="Corretiva"
              control={<Radio className="radio-button" />}
              label={<Typography className="radio-text">Corretiva</Typography>}
            />
          </RadioGroup>
        </Box>
        <Button
          variant="contained"
          className="botao-cadastrar"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleCadastrar}
        >
          Cadastrar Manutenção
        </Button>
      </Box>

      <TabelaGenerica<Manutencao>
        colunas={colunasManutencoes}
        dados={dadosFiltrados}
        onEditar={handleEditar}
        onExcluir={handleExcluir}
        exibirExaminar={false}
      />
      <ModalFormulario<Manutencao>
        open={open}
        onClose={() => setOpen(false)}
        onSalvar={handleSalvar}
        colunas={colunasManutencoesModal}
        dados={dados}
        setDados={setDados}
        modoEdicao={modoEdicao}
      />
    </Box>
  );
}
