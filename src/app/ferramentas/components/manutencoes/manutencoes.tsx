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
import EngineeringIcon from "@mui/icons-material/Engineering";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import "./manutencoes.css";

interface Manutencao extends Record<string, unknown> {
  veiculo: string;
  tipoVeiculo: string;
  nome: string;
  km: number;
  horasMotor: number;
  descricao: string;
  data: string;
  custo: string;
  tipo: string;
}

const colunasManutencoes = [
  { chave: "veiculo", titulo: "Veículo", ordenavel: false },
  { chave: "tipoVeiculo", titulo: "Tipo Caminhão", ordenavel: false },
  { chave: "nome", titulo: "Manutenção", ordenavel: false },
  { chave: "km", titulo: "Km da Manutenção", ordenavel: true },
  { chave: "horasMotor", titulo: "Horas do Motor", ordenavel: true },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "data", titulo: "Data", ordenavel: true },
  { chave: "custo", titulo: "Custo", ordenavel: true },
  { chave: "tipo", titulo: "Tipo", ordenavel: false },
];

const manutencoesData: Manutencao[] = [
  {
    veiculo: "Caminhão 1",
    tipoVeiculo: "Betoneira",
    nome: "Troca de óleo",
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
    nome: "Reparo no motor",
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
    nome: "Revisão completa",
    km: 50.2,
    horasMotor: 3900,
    descricao: "Revisão preventiva geral.",
    data: "22/01/2024",
    custo: "540,50",
    tipo: "Preventiva",
  },
];

const tiposVeiculo = [...new Set(manutencoesData.map((m) => m.tipoVeiculo))];
const tiposManutencao = [...new Set(manutencoesData.map((m) => m.tipo))];
const maxKm = Math.max(...manutencoesData.map((m) => m.km));
const maxCusto = Math.max(
  ...manutencoesData.map((m) => parseFloat(m.custo.replace(",", ".")))
);
const maxHorasMotor = Math.max(...manutencoesData.map((m) => m.horasMotor));

const filtrosAvancadosConfig = [
  {
    name: "tipoVeiculo",
    label: "Tipo Caminhão",
    type: "select" as const,
    options: tiposVeiculo,
  },
  {
    name: "data",
    label: "Data",
    type: "data" as const,
  },
  {
    name: "tipo",
    label: "Tipo Manutenção",
    type: "select" as const,
    options: tiposManutencao,
  },
  {
    name: "horasMotor",
    label: "Horas do Motor",
    type: "range" as const,
    min: 0,
    max: maxHorasMotor,
  },
  {
    name: "custo",
    label: "Custo",
    type: "range" as const,
    min: 0,
    max: maxCusto,
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

export default function Manutencoes() {
  const [dados, setDados] = useState<Manutencao | null>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<Record<string, any>>(
    {}
  );

  const dadosFiltrados = manutencoesData.filter((m) => {
    const matchSearch =
      m.veiculo.toLowerCase().includes(search.toLowerCase()) ||
      m.nome.toLowerCase().includes(search.toLowerCase());

    const matchTipoVeiculo = filtrosAvancados.tipoVeiculo
      ? m.tipoVeiculo === filtrosAvancados.tipoVeiculo
      : true;

    const matchHorasMotor = filtrosAvancados.horasMotor
      ? m.horasMotor <= Number(filtrosAvancados.horasMotor)
      : true;

    const matchData = filtrosAvancados.data
      ? m.data === formatarDataISOparaBR(filtrosAvancados.data)
      : true;

    const matchCusto = filtrosAvancados.custo
      ? parseFloat(m.custo.replace(",", ".")) <= filtrosAvancados.custo
      : true;

    const matchTipo = filtrosAvancados.tipo
      ? m.tipo === filtrosAvancados.tipo
      : true;

    const matchKm = filtrosAvancados.km ? m.km <= filtrosAvancados.km : true;

    return (
      matchSearch &&
      matchTipoVeiculo &&
      matchHorasMotor &&
      matchData &&
      matchCusto &&
      matchTipo &&
      matchKm
    );
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
    console.log(
      modoEdicao ? "Salvando edição:" : "Cadastrando nova manutenção:",
      dados
    );
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
        <Box className="search-filtros-container">
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
        colunas={colunasManutencoes}
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
