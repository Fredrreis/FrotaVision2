"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import IosShareIcon from "@mui/icons-material/IosShare";
import { useSession } from "next-auth/react";
import {
  listarVeiculos,
  deletarVeiculo,
  cadastrarVeiculo,
  editarVeiculo,
  pesquisarVeiculoDetalhado,
  Veiculo,
  NovoVeiculo,
} from "@/api/services/veiculoService";

import type { Coluna } from "@/app/ferramentas/components/components/formulario-modal/formulario-generico";
import TabelaGenerica from "@/app/ferramentas/components/components/tabela/tabela-generica";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import ExportarRelatorioDialog from "../components/export/export-relatorio";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import Carregamento from "../../../components/carregamento/carregamento";
import { formatarDataISOcomHora, compareDateISO } from "@/utils/data";
import { listarTiposCaminhao } from "@/api/services/tipoCaminhaoService";
import CadastrarGenerico from "@/app/components/genericos/cadastrarGenerico";
import EditarGenerico from "@/app/components/genericos/editarGenerico";
import DeletarGenerico from "@/app/components/genericos/deletarGenerico";
import VisualizarVeiculo from "./components/visualizar-veiculo/visualizar-veiculo";
import { veiculoSchema } from "@/utils/veiculo-validation";

import "../styles/shared-styles.css";
import "./veiculos.css";

interface VeiculoFormatado {
  id: number;
  placa: string;
  nome: string;
  tipo: string;
  chassi: string;
  descricao: string;
  km: number;
  ano: number;
  data: string;
  dataOriginal: string;
  [key: string]: unknown;
}

interface VeiculoDetalhado {
  apelido: string;
  placa: string;
  chassi: string;
  ano: number;
  km: number;
  dataCadastro: string;
  motorista: string;
  descricao: string;
  manutencao: {
    total: number;
    ultima: string;
    dataUltima: string;
  };
  preventiva: {
    total: number;
    pendente: string;
    dataNotificacao: string;
  };
  viagens: {
    total: number;
    ultima: string;
    dataUltima: string;
    origem: string;
    destino: string;
  };
}

const colunasVeiculos = [
  { chave: "placa", titulo: "Placa", ordenavel: false },
  { chave: "nome", titulo: "Nome", ordenavel: false },
  { chave: "tipo", titulo: "Tipo Caminhão", ordenavel: false },
  { chave: "chassi", titulo: "Chassi", ordenavel: false },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "km", titulo: "Km", ordenavel: true },
  { chave: "ano", titulo: "Ano", ordenavel: true },
  { chave: "data", titulo: "Data", ordenavel: true },
];

const mapeamentoCampos = {
  Placa: "placa",
  Nome: "nome",
  "Tipo Caminhão": "tipo",
  Chassi: "chassi",
  Descrição: "descricao",
  Km: "km",
  Ano: "ano",
  Data: "data",
};

export default function Veiculos() {
  const { data: session } = useSession();
  const [dadosApi, setDadosApi] = useState<Veiculo[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<Veiculo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [openCadastrar, setOpenCadastrar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openDeletar, setOpenDeletar] = useState(false);
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [dadosDetalhados, setDadosDetalhados] =
    useState<VeiculoDetalhado | null>(null);

  // 👉 Novo estado: mapeamento de ID do tipo para nome
  const [tiposCaminhao, setTiposCaminhao] = useState<Record<number, string>>(
    {}
  );

  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [openExportar, setOpenExportar] = useState(false);
  const [anchorElFiltros, setAnchorElFiltros] = useState<HTMLElement | null>(
    null
  );
  const [anchorElExportar, setAnchorElExportar] = useState<HTMLElement | null>(
    null
  );
  const [filtrosAvancados, setFiltrosAvancados] = useState<
    Record<string, unknown>
  >({});

  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState("");
  const [snackbarCor, setSnackbarCor] = useState<"primary" | "light" | "error">(
    "primary"
  );

  const [tiposCaminhaoFiltro, setTiposCaminhaoFiltro] = useState<string[]>([]);

  // Carrega lista de veículos
  const carregarVeiculos = useCallback(() => {
    if (!session?.user?.cnpj) return;
    setCarregando(true);
    listarVeiculos(session.user.cnpj)
      .then((res) => setDadosApi(res))
      .finally(() => setCarregando(false));
  }, [session?.user?.cnpj]);

  // Ao montar, busca os tipos de caminhão e preenche o mapeamento
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const tipos = await listarTiposCaminhao();
        const mapa: Record<number, string> = {};
        tipos.forEach((t) => {
          mapa[t.id] = t.nome;
        });
        setTiposCaminhao(mapa);
      } catch (err) {
        console.error("Erro ao buscar tipos de caminhão:", err);
      }
    };
    fetchTipos();
  }, []);

  useEffect(() => {
    async function fetchTiposFiltro() {
      const tipos = await listarTiposCaminhao();
      setTiposCaminhaoFiltro(tipos.map((t) => t.nome));
    }
    fetchTiposFiltro();
  }, []);

  // Recarrega veículos sempre que o CNPJ do usuário muda
  useEffect(() => {
    carregarVeiculos();
  }, [carregarVeiculos]);

  // Ao clicar no ícone de visualizar, busca detalhes e abre modal
  const handleVisualizar = async (item: VeiculoFormatado) => {
    try {
      setCarregando(true);
      const detalhes = await pesquisarVeiculoDetalhado(item.id);
      const veiculoDetalhado: VeiculoDetalhado = {
        apelido: detalhes.veiculo.apelido,
        placa: detalhes.veiculo.placa,
        chassi: detalhes.veiculo.chassi,
        ano: detalhes.veiculo.ano,
        km: detalhes.veiculo.quilometragem,
        dataCadastro: formatarDataISOcomHora(detalhes.veiculo.data_cadastro),
        motorista: detalhes.ultimaViagemMotorista,
        descricao: detalhes.veiculo.descricao,
        manutencao: {
          total: detalhes.countManutencao,
          ultima: detalhes.nomeUltimaManitencao,
          dataUltima: detalhes.dataUltimaManutecao,
        },
        preventiva: {
          total: detalhes.countUrgente,
          pendente: detalhes.ultimaManutencaoUrgenteNome,
          dataNotificacao: detalhes.ultimaMantuenacaoUrgenteData,
        },
        viagens: {
          total: detalhes.countViagens,
          ultima: detalhes.ultimaViagemMotorista,
          dataUltima: detalhes.ultimaViagemData,
          origem: detalhes.ultimaViagemOrigem,
          destino: detalhes.ultimaViagemDestino,
        },
      };
      setDadosDetalhados(veiculoDetalhado);
      setOpenVisualizar(true);
    } catch (err) {
      console.error("Erro ao carregar detalhes do veículo:", err);
      setSnackbarMensagem("Erro ao carregar detalhes do veículo");
      setSnackbarAberto(true);
    } finally {
      setCarregando(false);
    }
  };

  // Mostra loader enquanto carrega a lista inicial
  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Veículos..."
      />
    );
  }

  // Monta a lista formatada já traduzindo o ID do tipo para nome
  const dadosFiltrados: VeiculoFormatado[] = dadosApi
    .map((v) => {
      const dataOriginal = v.data_cadastro || "";
      return {
        id: v.id_veiculo,
        placa: v.placa || "—",
        nome: v.apelido || "—",
        tipo: tiposCaminhao[v.tipo] || `Tipo ${v.tipo}`,
        chassi: v.chassi || "—",
        descricao: v.descricao || "—",
        km: v.quilometragem ?? 0,
        ano: v.ano ?? 0,
        data: formatarDataISOcomHora(dataOriginal),
        dataOriginal,
      };
    })
    .filter((veiculo) => {
      const matchSearch =
        veiculo.nome.toLowerCase().includes(search.toLowerCase()) ||
        veiculo.placa.toLowerCase().includes(search.toLowerCase());

      const matchTipo = filtrosAvancados.tipo
        ? veiculo.tipo === String(filtrosAvancados.tipo)
        : true;
      const matchAno = filtrosAvancados.ano
        ? veiculo.ano === Number(filtrosAvancados.ano)
        : true;
      const matchKm =
        filtrosAvancados.km !== undefined && filtrosAvancados.km !== ""
          ? veiculo.km <= Number(filtrosAvancados.km)
          : true;
      const matchData = filtrosAvancados.data
        ? compareDateISO(veiculo.dataOriginal, String(filtrosAvancados.data))
        : true;

      return matchSearch && matchTipo && matchAno && matchKm && matchData;
    });

  // Extrai todos os nomes únicos de tipo para usar nos filtros
  const tiposUnicos = tiposCaminhaoFiltro;
  const maxKm = Math.max(0, ...dadosFiltrados.map((v) => v.km));

  const filtrosAvancadosConfig = [
    {
      name: "tipo",
      label: "Tipo Caminhão",
      type: "select" as const,
      options: tiposUnicos,
    },
    { name: "ano", label: "Ano", type: "number" as const },
    { name: "data", label: "Data", type: "data" as const },
    { name: "km", label: "Km", type: "range" as const, min: 0, max: maxKm },
  ];

  const colunasFormulario: Coluna[] = [
    { chave: "placa", titulo: "Placa", tipo: "texto" },
    { chave: "apelido", titulo: "Nome", tipo: "texto" },
    { chave: "tipo", titulo: "Tipo Caminhão", tipo: "selecao" },
    { chave: "chassi", titulo: "Chassi", tipo: "texto" },
    { chave: "descricao", titulo: "Descrição", tipo: "area" },
    { chave: "quilometragem", titulo: "Km", tipo: "number" },
    { chave: "ano", titulo: "Ano", tipo: "number" },
  ];

  const obterOpcoesDinamicas = async () => {
    const tipos = await listarTiposCaminhao();
    return {
      tipo: tipos.map((t) => ({ label: t.nome, value: t.id.toString() })),
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box className="veiculos-container">
        <Box className="veiculos-header">
          <Typography variant="h6" className="veiculos-title">
            <LocalShippingIcon className="icon-title" /> VEÍCULOS
          </Typography>
        </Box>

        <Box className="veiculos-filtros">
          <Box className="search-filtros-container">
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
              className="botao-filtrar"
              endIcon={<FilterAltOutlinedIcon />}
              onClick={(e) => {
                setAnchorElFiltros(e.currentTarget);
                setOpenFiltros(true);
                setOpenExportar(false);
              }}
            >
              <span className="button-text">Filtros Avançados</span>
            </Button>
          </Box>

          <Box className="botoes-container">
            <Button
              variant="contained"
              className="botao-cadastrar"
              onClick={() => setOpenCadastrar(true)}
            >
              Cadastrar Veículo
            </Button>
            <Button
              variant="contained"
              className="botao-exportar"
              startIcon={<IosShareIcon />}
              onClick={(e) => {
                setAnchorElExportar(e.currentTarget);
                setOpenExportar(true);
                setOpenFiltros(false);
              }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        <TabelaGenerica<VeiculoFormatado>
          colunas={colunasVeiculos}
          dados={dadosFiltrados}
          onEditar={(item) => {
            const original = dadosApi.find((v) => v.id_veiculo === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenEditar(true);
            }
          }}
          onExcluir={(item) => {
            const original = dadosApi.find((v) => v.id_veiculo === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenDeletar(true);
            }
          }}
          exibirExaminar={true}
          onExaminar={handleVisualizar}
        />

        <FiltroAvancado
          open={openFiltros}
          onClose={() => setOpenFiltros(false)}
          filters={filtrosAvancadosConfig}
          values={filtrosAvancados}
          onChange={setFiltrosAvancados}
          onApply={() => setOpenFiltros(false)}
          onClear={() => setFiltrosAvancados({})}
          anchorEl={anchorElFiltros}
        />

        <ExportarRelatorioDialog
          open={openExportar}
          onClose={() => setOpenExportar(false)}
          colunas={colunasVeiculos.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
          anchorEl={anchorElExportar}
        />

        {dadosDetalhados && (
          <VisualizarVeiculo
            open={openVisualizar}
            onClose={() => {
              setOpenVisualizar(false);
              setDadosDetalhados(null);
            }}
            veiculo={dadosDetalhados}
          />
        )}

        <CustomSnackbar
          open={snackbarAberto}
          onClose={() => setSnackbarAberto(false)}
          message={snackbarMensagem}
          color={snackbarCor}
        />

        {openCadastrar && (
          <CadastrarGenerico<NovoVeiculo>
            open={openCadastrar}
            onClose={() => setOpenCadastrar(false)}
            onSalvar={async (novo) => {
              await cadastrarVeiculo({
                ...novo,
                cnpj: session?.user?.cnpj ?? "",
                habilitado: true,
                data_cadastro: new Date().toISOString(),
              });
              carregarVeiculos();
              setSnackbarMensagem("Veículo cadastrado com sucesso!");
              setSnackbarCor("primary");
              setSnackbarAberto(true);
            }}
            colunas={colunasFormulario}
            titulo="CADASTRAR VEÍCULO"
            obterOpcoesDinamicas={obterOpcoesDinamicas}
            schema={veiculoSchema}
          />
        )}

        {openEditar && itemSelecionado && (
          <EditarGenerico<Veiculo>
            open={openEditar}
            onClose={() => setOpenEditar(false)}
            onSalvar={async (veiculoAtualizado) => {
              await editarVeiculo(
                veiculoAtualizado.id_veiculo,
                veiculoAtualizado
              );
              setSnackbarMensagem("Veículo editado com sucesso!");
              setSnackbarAberto(true);
              carregarVeiculos();
            }}
            itemEdicao={itemSelecionado}
            colunas={colunasFormulario}
            titulo="EDITAR VEÍCULO"
            obterOpcoesDinamicas={obterOpcoesDinamicas}
            schema={veiculoSchema}
          />
        )}

        {openDeletar && itemSelecionado && (
          <DeletarGenerico<Veiculo>
            open={openDeletar}
            onClose={() => setOpenDeletar(false)}
            item={itemSelecionado}
            getDescricao={(v) => `veículo de placa "${v.placa}"`}
            onConfirmar={async (v) => {
              await deletarVeiculo(v.id_veiculo);
              carregarVeiculos();
              setSnackbarMensagem("Veículo deletado com sucesso!");
              setSnackbarCor("light");
              setSnackbarAberto(true);
            }}
          />
        )}
      </Box>
    </motion.div>
  );
}
