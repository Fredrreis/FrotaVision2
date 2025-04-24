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
import TimelineIcon from "@mui/icons-material/Timeline";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FiltroAvancado from "../components/filtro/filtro-avancado";
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

const colunasViagens = [
  { chave: "veiculo", titulo: "Veículo", ordenavel: false },
  { chave: "motorista", titulo: "Motorista", ordenavel: false },
  { chave: "origem", titulo: "Origem", ordenavel: false },
  { chave: "destino", titulo: "Destino", ordenavel: false },
  { chave: "dataSaida", titulo: "Data de Saída", ordenavel: true },
  { chave: "dataRetorno", titulo: "Data de Retorno", ordenavel: true },
  { chave: "kmPercorrido", titulo: "Km Percorrido", ordenavel: true },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
];

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
const maxKm = Math.max(...viagensData.map((v) => v.kmPercorrido));

const filtrosAvancadosConfig = [
  {
    name: "origem",
    label: "Origem",
    type: "select" as const,
    options: origensUnicas,
  },
  {
    name: "destino",
    label: "Destino",
    type: "select" as const,
    options: destinosUnicas,
  },
  {
    name: "dataSaida",
    label: "Data de Saída",
    type: "data" as const,
  },
  {
    name: "dataRetorno",
    label: "Data de Retorno",
    type: "data" as const,
  },
  {
    name: "km",
    label: "Km",
    type: "range" as const,
    min: 0,
    max: maxKm,
  },
];

function formatarDataISOparaBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Viagens() {
  const [dados, setDados] = useState<Viagem | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<Record<string, any>>(
    {}
  );

  const dadosFiltrados = viagensData.filter((viagem) => {
    const matchesSearch =
      viagem.veiculo.toLowerCase().includes(search.toLowerCase()) ||
      viagem.motorista.toLowerCase().includes(search.toLowerCase());

    const matchOrigem = filtrosAvancados.origem
      ? viagem.origem === filtrosAvancados.origem
      : true;

    const matchDestino = filtrosAvancados.destino
      ? viagem.destino === filtrosAvancados.destino
      : true;

    const matchSaida = filtrosAvancados.dataSaida
      ? viagem.dataSaida === formatarDataISOparaBR(filtrosAvancados.dataSaida)
      : true;

    const matchRetorno = filtrosAvancados.dataRetorno
      ? viagem.dataRetorno ===
        formatarDataISOparaBR(filtrosAvancados.dataRetorno)
      : true;

    const matchKm =
      filtrosAvancados.kmPercorrido !== undefined
        ? viagem.kmPercorrido <= filtrosAvancados.kmPercorrido
        : true;

    return (
      matchOrigem &&
      matchDestino &&
      matchSaida &&
      matchRetorno &&
      matchKm &&
      matchesSearch
    );
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
    console.log(
      modoEdicao ? "Salvando edição:" : "Cadastrando nova viagem:",
      dados
    );
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
        <Box className="search-filtros-container">
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
        colunas={colunasViagens}
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
