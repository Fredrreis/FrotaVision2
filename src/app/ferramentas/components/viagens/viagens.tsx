import { useState } from "react";
import TabelaGenerica from "../templates/tabela/tabela-generica";
import ModalFormulario from "../templates/formulario-modal/formulario-generico";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TimelineIcon from "@mui/icons-material/Timeline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Fade from "@mui/material/Fade";
import "./viagens.css";

interface Viagem extends Record<string, unknown> {
  veiculo: string;
  motorista: string;
  origem: string;
  destino: string;
  dataSaida: string;
  dataRetorno: string;
  kmPercorrido: number;
  descricao: string;
}

const colunasViagens: {
  chave:
    | "veiculo"
    | "motorista"
    | "origem"
    | "destino"
    | "dataSaida"
    | "dataRetorno"
    | "kmPercorrido"
    | "descricao";
  titulo: string;
  ordenavel: boolean;
}[] = [
  { chave: "veiculo", titulo: "Veículo", ordenavel: false },
  { chave: "motorista", titulo: "Motorista", ordenavel: false },
  { chave: "origem", titulo: "Origem", ordenavel: false },
  { chave: "destino", titulo: "Destino", ordenavel: false },
  { chave: "dataSaida", titulo: "Data de Saída", ordenavel: true },
  { chave: "dataRetorno", titulo: "Data de Retorno", ordenavel: true },
  { chave: "kmPercorrido", titulo: "Km Percorrido", ordenavel: true },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
];

const colunasViagensModal = colunasViagens;

const viagensData: Viagem[] = [
  {
    veiculo: "Caminhão 1",
    motorista: "Eloise Taulner",
    origem: "São Paulo",
    destino: "Curitiba",
    dataSaida: "01/10/2024",
    dataRetorno: "03/10/2024",
    kmPercorrido: 415,
    descricao: "Entrega de eletrônicos",
  },
  {
    veiculo: "Caminhão 2",
    motorista: "Ingrid Grimwall",
    origem: "Belo Horizonte",
    destino: "Rio de Janeiro",
    dataSaida: "10/08/2024",
    dataRetorno: "12/08/2024",
    kmPercorrido: 435,
    descricao: "Transporte de alimentos",
  },
  {
    veiculo: "Caminhão 3",
    motorista: "Jett Dawnson",
    origem: "Porto Alegre",
    destino: "Florianópolis",
    dataSaida: "05/03/2024",
    dataRetorno: "06/03/2024",
    kmPercorrido: 470,
    descricao: "Carregamento de móveis",
  },
  {
    veiculo: "Caminhão 4",
    motorista: "Ingrid Grimwall",
    origem: "Belo Horizonte",
    destino: "São Paulo",
    dataSaida: "01/02/2024",
    dataRetorno: "02/02/2024",
    kmPercorrido: 520,
    descricao: "Carregamento de cimento",
  },
];

const origensUnicas = [...new Set(viagensData.map((v) => v.origem))];
const destinosUnicas = [...new Set(viagensData.map((v) => v.destino))];

export default function Viagens() {
  const [dados, setDados] = useState<Viagem | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("");
  const [filtroDestino, setFiltroDestino] = useState("");

  const encurtarTextoResponsivo = (texto: string, limite = 12): string => {
    if (typeof window !== "undefined" && window.innerWidth < 768 && texto.length > limite) {
      return texto.slice(0, limite) + "...";
    }
    return texto;
  };

  const dadosFiltrados = viagensData.filter((viagem) => {
    const matchesSearch =
      viagem.veiculo.toLowerCase().includes(search.toLowerCase()) ||
      viagem.motorista.toLowerCase().includes(search.toLowerCase());

    const matchesOrigem = filtroOrigem ? viagem.origem === filtroOrigem : true;
    const matchesDestino = filtroDestino ? viagem.destino === filtroDestino : true;

    return matchesSearch && matchesOrigem && matchesDestino;
  });

  const handleEditar = (item: Viagem) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = (item: Viagem) => {
    console.log("Excluindo item:", item);
  };

  const handleCadastrar = () => {
    setDados({} as Viagem);
    setModoEdicao(false);
    setOpen(true);
  };

  const handleSalvar = () => {
    if (modoEdicao) {
      console.log("Salvando edição:", dados);
    } else {
      console.log("Cadastrando nova viagem:", dados);
    }
    setOpen(false);
  };

  return (
    <Box className="viagens-container">
      <Box className="viagens-header">
        <Typography variant="h6" className="viagens-title">
          <TimelineIcon className="icon-title" /> VIAGENS
        </Typography>
      </Box>

      <Box className="viagens-filtros">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Buscar por veículo ou motorista"
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
        <Box className="dropdows-container">
          <TextField
            select
            variant="outlined"
            size="small"
            value={filtroOrigem}
            onChange={(e) => setFiltroOrigem(e.target.value)}
            className="dropdown-input origem-dropdown"
            SelectProps={{
              displayEmpty: true,
              IconComponent: KeyboardArrowDownIcon,
              renderValue: (value: unknown) =>
                              typeof value === "string" && value ? encurtarTextoResponsivo(value) : encurtarTextoResponsivo("Todas as Origens"),
              MenuProps: {
                TransitionComponent: Fade,
              },
            }}
          >
            <MenuItem value="">Todas as Origens</MenuItem>
            {origensUnicas.map((origem) => (
              <MenuItem key={origem} value={origem}>
                {origem}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            variant="outlined"
            size="small"
            value={filtroDestino}
            onChange={(e) => setFiltroDestino(e.target.value)}
            className="dropdown-input destino-dropdown"
            SelectProps={{
              displayEmpty: true,
              IconComponent: KeyboardArrowDownIcon,
              renderValue: (value: unknown) =>
                              typeof value === "string" && value ? encurtarTextoResponsivo(value) : encurtarTextoResponsivo("Todos os Destinos"),
              MenuProps: {
                TransitionComponent: Fade,
              },
            }}
          >
            <MenuItem value="">Todos os Destinos</MenuItem>
            {destinosUnicas.map((destino) => (
              <MenuItem key={destino} value={destino}>
                {destino}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Button
          variant="contained"
          className="botao-cadastrar"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleCadastrar}
        >
          Cadastrar Viagem
        </Button>
      </Box>

      <TabelaGenerica<Viagem>
        colunas={colunasViagens}
        dados={dadosFiltrados}
        onEditar={handleEditar}
        onExcluir={handleExcluir}
        exibirExaminar={false}
      />
      <ModalFormulario<Viagem>
        open={open}
        onClose={() => setOpen(false)}
        onSalvar={handleSalvar}
        colunas={colunasViagensModal}
        dados={dados}
        setDados={setDados}
        modoEdicao={modoEdicao}
      />
    </Box>
  );
}
