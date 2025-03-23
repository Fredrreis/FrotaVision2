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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "./veiculos.css";

const colunasVeiculos = [
  { chave: "placa", titulo: "Placa", ordenavel: false },
  { chave: "nome", titulo: "Nome", ordenavel: false },
  { chave: "chassi", titulo: "Chassi", ordenavel: false },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "km", titulo: "Km", ordenavel: true },
  { chave: "ano", titulo: "Ano", ordenavel: true },
  { chave: "dataCadastro", titulo: "Data de Cadastro", ordenavel: true },
];

const colunasVeiculosModal = colunasVeiculos.filter(
  (coluna) => coluna.chave !== "dataCadastro"
);

const veiculosData = [
  {
    placa: "ABC1D34",
    nome: "Caminhão 1",
    chassi: "9BWZZZ377VT004251",
    descricao: "Modelo A, cor branca",
    km: 134.5,
    ano: 2014,
    dataCadastro: "23/09/2023",
    manutencaoProxima: true,
  },
  {
    placa: "XYZ2E56",
    nome: "Caminhão 2",
    chassi: "8ABCDZ998HT003122",
    descricao: "Modelo B, cor azul",
    km: 256.8,
    ano: 2018,
    dataCadastro: "12/06/2022",
    manutencaoProxima: false,
  },
  {
    placa: "LMN3F78",
    nome: "Caminhão 3",
    chassi: "7XYYZZ123ET002233",
    descricao: "Modelo C, cor vermelha",
    km: 98.2,
    ano: 2016,
    dataCadastro: "30/12/2021",
    manutencaoProxima: true,
  },
  {
    placa: "OPQ4G90",
    nome: "Caminhão 4",
    chassi: "5LMNO999RT006789",
    descricao: "Modelo D, cor preta",
    km: 430.1,
    ano: 2012,
    dataCadastro: "15/02/2023",
    manutencaoProxima: false,
  },
  {
    placa: "RST5H12",
    nome: "Caminhão 5",
    chassi: "3ZXXTT667GH001111",
    descricao: "Modelo E, cor cinza",
    km: 210.0,
    ano: 2020,
    dataCadastro: "08/07/2020",
    manutencaoProxima: true,
  },
];

export default function Veiculos() {
  const [dados, setDados] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroManutencao, setFiltroManutencao] = useState("nao");

  const dadosFiltrados = veiculosData.filter((veiculo) => {
    const matchesSearch =
      veiculo.placa.toLowerCase().includes(search.toLowerCase()) ||
      veiculo.nome.toLowerCase().includes(search.toLowerCase());

    const matchesFiltro =
      filtroManutencao === "sim" ? veiculo.manutencaoProxima : true;

    return matchesSearch && matchesFiltro;
  });

  const handleEditar = (item: any) => {
    setDados(item);
    setModoEdicao(true);
    setOpen(true);
  };

  const handleExcluir = (item: any) => {
    console.log("Excluindo item:", item);
  };
  

  const handleCadastrar = () => {
    setDados({});
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
    <Box className="veiculos-container">
      <Box className="veiculos-header">
        <Typography variant="h6" className="veiculos-title">
          <LocalShippingIcon className="icon-title" /> VEÍCULOS
        </Typography>
      </Box>

      {/* 🔍 FILTROS */}
      <Box className="veiculos-filtros">
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
        <Box className="filtro-manutencao">
          <Typography variant="body2" className="filtro-label">
            Filtrar por manutenção preventiva pendente?
          </Typography>
          <RadioGroup
            row
            value={filtroManutencao}
            onChange={(e) => setFiltroManutencao(e.target.value)}
            className="radio-group"
          >
            <FormControlLabel
              value="sim"
              control={<Radio className="radio-button" />}
              label={<Typography className="radio-text">Sim</Typography>}
            />
            <FormControlLabel
              value="nao"
              control={<Radio className="radio-button" />}
              label={<Typography className="radio-text">Não</Typography>}
            />
          </RadioGroup>
        </Box>
        <Button
          variant="contained"
          className="botao-cadastrar"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleCadastrar}
        >
          Cadastrar Veículo
        </Button>
      </Box>

      <TabelaGenerica
        colunas={colunasVeiculos}
        dados={dadosFiltrados}
        onEditar={handleEditar}
        onExcluir={handleExcluir}
        exibirVisualizar={true}
      />
      <ModalFormulario
        open={open}
        onClose={() => setOpen(false)}
        onSalvar={handleSalvar}
        colunas={colunasVeiculosModal}
        dados={dados}
        setDados={setDados}
        modoEdicao={modoEdicao} // 🔹 Agora passamos essa prop para indicar se é edição ou cadastro
      />
    </Box>
  );
}
