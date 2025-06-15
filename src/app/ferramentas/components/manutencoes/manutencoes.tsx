// pages/ferramentas/manutencoes.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
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
import IosShareIcon from "@mui/icons-material/IosShare";
import TabelaGenerica from "@/app/ferramentas/components/components/tabela/tabela-generica";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import ExportarRelatorioDialog from "../components/export/export-relatorio";
import Carregamento from "../../../components/carregamento/carregamento";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import EditarGenerico from "@/app/components/genericos/editarGenerico";
import CadastrarGenerico from "@/app/components/genericos/cadastrarGenerico";
import { Coluna } from "@/app/ferramentas/components/components/formulario-modal/formulario-generico";
import DeletarGenerico from "@/app/components/genericos/deletarGenerico";

import {
  listarManutencaoRealizada,
  cadastrarManutencaoRealizada,
  atualizarManutencaoRealizada,
  deletarManutencaoRealizada,
  ManutencaoRealizadaDetalhado,
  ManutencaoRealizada,
} from "@/api/services/manutencaoRealizadaService";

import {
  compareDateISO,
  formatarDataISOcomHora,
  inputDatetimeLocalToISO,
} from "@/utils/data";
import { listarTiposManutencao } from "@/api/services/tipoManutencaoService";
import { listarVeiculos } from "@/api/services/veiculoService";
import { listarTiposCaminhao } from "@/api/services/tipoCaminhaoService";

import "../styles/shared-styles.css";
import "./manutencoes.css";
import { manutencaoSchema } from "@/utils/manutencao-validation";

// view-model para a tabela
interface Manutencao {
  id: number;
  veiculo: string;
  tipoVeiculo: string;
  nome: string;
  km: number;
  descricao: string;
  data: string;
  dataOriginal: string;
  custo: number;
  tipo: string;
  [key: string]: unknown;
}

// colunas da tabela
const colunasManutencoes = [
  { chave: "veiculo", titulo: "Veículo", ordenavel: false },
  { chave: "tipoVeiculo", titulo: "Tipo Caminhão", ordenavel: false },
  { chave: "nome", titulo: "Manutenção", ordenavel: false },
  { chave: "km", titulo: "Km da Manutenção", ordenavel: true },
  { chave: "descricao", titulo: "Descrição", ordenavel: false },
  { chave: "data", titulo: "Data", ordenavel: true },
  { chave: "custo", titulo: "Custo", ordenavel: true },
  { chave: "tipo", titulo: "Tipo", ordenavel: false },
];

// mapeamento para exportação
const mapeamentoCampos = {
  Veículo: "veiculo",
  "Tipo Caminhão": "tipoVeiculo",
  Manutenção: "nome",
  "Km da Manutenção": "km",
  Descrição: "descricao",
  Data: "data",
  Custo: "custo",
  Tipo: "tipo",
};

// colunas do formulário de criação/edição
const colunasFormulario: Coluna[] = [
  { chave: "id_veiculo", titulo: "Veículo", tipo: "selecao" },
  { chave: "id_manutencao", titulo: "Tipo de Manutenção", tipo: "selecao" },
  {
    chave: "quilometragem_ultima_manutencao",
    titulo: "Km da Manutenção",
    tipo: "number",
  },
  { chave: "data_manutencao", titulo: "Data", tipo: "datetime" },
  { chave: "descricao", titulo: "Descrição", tipo: "area" },
  { chave: "valor_manutencao", titulo: "Valor", tipo: "number" },
  {
    chave: "eManuntencaoPreventiva",
    titulo: "É manutenção preventiva?",
    tipo: "radio",
    opcoes: [
      { label: "Sim", value: "true" },
      { label: "Não", value: "false" },
    ],
  },
];

interface SessionUser {
  cnpj: string;
  // adicione outros campos do usuário conforme necessário
}

interface Session {
  user?: SessionUser;
}

// obtém opções para selects
async function obterOpcoesDinamicas(session: unknown) {
  const user =
    session && typeof session === "object" && "user" in session
      ? (session as Session).user
      : undefined;
  try {
    const [tiposManutencao, veiculos] = await Promise.all([
      listarTiposManutencao(),
      listarVeiculos(user?.cnpj ?? ""),
    ]);
    return {
      id_veiculo: veiculos
        .filter((v) => v && v.id_veiculo && v.apelido)
        .map((v) => ({
          label: v.apelido || "Veículo sem nome",
          value: String(v.id_veiculo),
        })),
      id_manutencao: tiposManutencao
        .filter((t) => t && t.id_manutencao && t.nome)
        .map((t) => ({
          label: t.nome || "Manutenção sem nome",
          value: String(t.id_manutencao),
        })),
      eManuntencaoPreventiva: [
        { label: "Sim", value: "true" },
        { label: "Não", value: "false" },
      ],
    };
  } catch {
    return {
      id_veiculo: [],
      id_manutencao: [],
      eManuntencaoPreventiva: [
        { label: "Sim", value: "true" },
        { label: "Não", value: "false" },
      ],
    };
  }
}

export default function Manutencoes() {
  const { data: session } = useSession();

  // dados da API e loading
  const [dadosApi, setDadosApi] = useState<ManutencaoRealizadaDetalhado[]>([]);
  const [carregando, setCarregando] = useState(true);

  // estados de CRUD
  const [openCriar, setOpenCriar] = useState(false);
  const [itemSelecionado, setItemSelecionado] =
    useState<ManutencaoRealizadaDetalhado | null>(null);
  const [openEditar, setOpenEditar] = useState(false);
  const [openDeletar, setOpenDeletar] = useState(false);

  // busca, filtros, export, snackbar
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [anchorElFiltro, setAnchorElFiltro] = useState<HTMLElement | null>(
    null
  );
  const [openExportar, setOpenExportar] = useState(false);
  const [anchorElExportar, setAnchorElExportar] = useState<HTMLElement | null>(
    null
  );
  const [filtrosAvancados, setFiltrosAvancados] = useState<
    Record<string, unknown>
  >({});
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState("");
  const [snackbarCor, setSnackbarCor] = useState<"primary" | "light">(
    "primary"
  );

  const [tiposCaminhaoFiltro, setTiposCaminhaoFiltro] = useState<string[]>([]);

  useEffect(() => {}, [session]);

  useEffect(() => {
    async function fetchTiposFiltro() {
      const tipos = await listarTiposCaminhao();
      setTiposCaminhaoFiltro(tipos.map((t) => t.nome));
    }
    fetchTiposFiltro();
  }, []);

  // carrega lista de manutenções
  const carregarManutencoes = useCallback(() => {
    if (!session?.user?.cnpj) {
      return;
    }
    setCarregando(true);
    listarManutencaoRealizada(session.user.cnpj)
      .then((res) => {
        setDadosApi(res);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [session?.user?.cnpj]);

  useEffect(() => {
    if (session?.user?.cnpj) {
      carregarManutencoes();
    }
  }, [session?.user?.cnpj, carregarManutencoes]);

  // mapeia para view-model da tabela
  const manutencoesData: Manutencao[] = dadosApi.map((m) => ({
    id: m.id_manutencao_realizada,
    veiculo: m.apelido || "—",
    tipoVeiculo: m.tipo || "—",
    nome: m.manutencao || "—",
    km: m.quilometragem_ultima_manutencao ?? 0,
    descricao: m.descricaoRealizada || "—",
    data: formatarDataISOcomHora(m.data_manutencao),
    dataOriginal: m.data_manutencao,
    custo: m.valor_manutencao,
    tipo: m.eManuntencaoPreventiva ? "Preventiva" : "Corretiva",
  }));

  // aplica busca e filtros
  const dadosFiltrados = manutencoesData.filter((m) => {
    const matchSearch =
      m.veiculo.toLowerCase().includes(search.toLowerCase()) ||
      m.nome.toLowerCase().includes(search.toLowerCase());
    const matchTipoVeiculo = filtrosAvancados.tipoVeiculo
      ? m.tipoVeiculo === String(filtrosAvancados.tipoVeiculo)
      : true;
    const matchData = filtrosAvancados.data
      ? compareDateISO(m.dataOriginal, String(filtrosAvancados.data))
      : true;
    const matchCusto = filtrosAvancados.custo
      ? m.custo <= Number(filtrosAvancados.custo)
      : true;
    const matchTipo = filtrosAvancados.tipo
      ? m.tipo === String(filtrosAvancados.tipo)
      : true;
    const matchKm = filtrosAvancados.km
      ? m.km <= Number(filtrosAvancados.km)
      : true;
    return (
      matchSearch &&
      matchTipoVeiculo &&
      matchData &&
      matchCusto &&
      matchTipo &&
      matchKm
    );
  });

  // configura filtros avançados
  const tiposVeiculo = tiposCaminhaoFiltro;
  const tiposManutencao = [...new Set(manutencoesData.map((m) => m.tipo))];
  const maxKm = Math.max(0, ...manutencoesData.map((m) => m.km));
  const maxCusto = Math.max(0, ...manutencoesData.map((m) => m.custo));
  const filtrosAvancadosConfig = [
    {
      name: "tipoVeiculo",
      label: "Tipo Caminhão",
      type: "select" as const,
      options: tiposVeiculo,
    },
    { name: "data", label: "Data", type: "data" as const },
    {
      name: "tipo",
      label: "Tipo",
      type: "select" as const,
      options: tiposManutencao,
    },
    {
      name: "custo",
      label: "Custo",
      type: "range" as const,
      min: 0,
      max: maxCusto,
    },
    { name: "km", label: "Km", type: "range" as const, min: 0, max: maxKm },
  ];

  // prepara payload de edição
  const payloadEdicao: ManutencaoRealizada | null =
    itemSelecionado && session?.user?.cnpj
      ? {
          id_manutencao_realizada: itemSelecionado.id_manutencao_realizada,
          id_veiculo: itemSelecionado.id_veiculo,
          id_manutencao: itemSelecionado.id_manutencao,
          quilometragem_ultima_manutencao:
            itemSelecionado.quilometragem_ultima_manutencao,
          data_manutencao: itemSelecionado.data_manutencao,
          descricao: itemSelecionado.descricaoRealizada,
          data_cadastro:
            itemSelecionado.data_cadastro ?? new Date().toISOString(),
          valor_manutencao: itemSelecionado.valor_manutencao,
          habilitado: true,
          cnpj: session.user.cnpj,
          eManuntencaoPreventiva: Boolean(
            itemSelecionado.eManuntencaoPreventiva
          ),
        }
      : null;

  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Manutenções..."
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box className="manutencoes-container">
        {/* Header e Filtros */}
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
              onClick={(e) => {
                setAnchorElFiltro(e.currentTarget);
                setOpenFiltros(true);
              }}
            >
              Filtros Avançados
            </Button>
          </Box>
          <Box className="botoes-container">
            <Button
              variant="contained"
              className="botao-cadastrar"
              onClick={() => setOpenCriar(true)}
            >
              Cadastrar Manutenção
            </Button>
            <Button
              variant="contained"
              className="botao-exportar"
              startIcon={<IosShareIcon />}
              onClick={(e) => {
                setAnchorElExportar(e.currentTarget);
                setOpenExportar(true);
              }}
            >
              Exportar
            </Button>
          </Box>
        </Box>

        {/* Tabela */}
        <TabelaGenerica<Manutencao>
          colunas={colunasManutencoes}
          dados={dadosFiltrados}
          onEditar={(item) => {
            const original = dadosApi.find(
              (m) => m.id_manutencao_realizada === item.id
            );
            if (original) {
              setItemSelecionado(original);
              setOpenEditar(true);
            }
          }}
          onExcluir={(item) => {
            const original = dadosApi.find(
              (m) => m.id_manutencao_realizada === item.id
            );
            if (original) {
              setItemSelecionado(original);
              setOpenDeletar(true);
            }
          }}
          exibirExaminar={false}
        />

        {/* Modal de Edição */}
        {openEditar && payloadEdicao && (
          <EditarGenerico<ManutencaoRealizada>
            open={openEditar}
            onClose={() => setOpenEditar(false)}
            titulo="EDITAR MANUTENÇÃO"
            colunas={colunasFormulario}
            itemEdicao={payloadEdicao}
            obterOpcoesDinamicas={() => obterOpcoesDinamicas(session)}
            onSalvar={async (payload) => {
              setCarregando(true);
              const payloadFinal: ManutencaoRealizada = {
                ...payload,
                id_veiculo: Number(payload.id_veiculo),
                id_manutencao: Number(payload.id_manutencao),
                data_manutencao: inputDatetimeLocalToISO(
                  payload.data_manutencao
                ),
                eManuntencaoPreventiva:
                  String(payload.eManuntencaoPreventiva) === "true",
              };
              try {
                await atualizarManutencaoRealizada(
                  payloadFinal.id_manutencao_realizada,
                  payloadFinal
                );
                await carregarManutencoes();
                setSnackbarMensagem("Manutenção editada com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao editar manutenção. Tente novamente."
                );
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenEditar(false);
              }
            }}
            schema={manutencaoSchema}
          />
        )}

        {/* Modal de Criação */}
        {openCriar && (
          <CadastrarGenerico<ManutencaoRealizada>
            open={openCriar}
            onClose={() => setOpenCriar(false)}
            titulo="CADASTRAR MANUTENÇÃO"
            colunas={colunasFormulario}
            obterOpcoesDinamicas={() => obterOpcoesDinamicas(session)}
            onSalvar={async (formValues) => {
              setCarregando(true);
              const payload: ManutencaoRealizada = {
                id_manutencao_realizada: 0, // Will be assigned by the backend
                quilometragem_ultima_manutencao: Number(
                  formValues.quilometragem_ultima_manutencao
                ),
                valor_manutencao: Number(formValues.valor_manutencao),
                descricao: String(formValues.descricao),
                id_veiculo: Number(formValues.id_veiculo),
                id_manutencao: Number(formValues.id_manutencao),
                data_manutencao: inputDatetimeLocalToISO(
                  formValues.data_manutencao
                ),
                eManuntencaoPreventiva:
                  String(formValues.eManuntencaoPreventiva) === "true",
                data_cadastro: new Date().toISOString(),
                habilitado: true,
                cnpj: session?.user?.cnpj ?? "",
              };
              try {
                await cadastrarManutencaoRealizada(payload);
                await carregarManutencoes();
                setSnackbarMensagem("Manutenção cadastrada com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao cadastrar manutenção. Tente novamente."
                );
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenCriar(false);
              }
            }}
            schema={manutencaoSchema}
          />
        )}

        {/* Filtros Avançados */}
        <FiltroAvancado
          open={openFiltros}
          onClose={() => setOpenFiltros(false)}
          anchorEl={anchorElFiltro}
          filters={filtrosAvancadosConfig}
          values={filtrosAvancados}
          onChange={setFiltrosAvancados}
          onApply={() => setOpenFiltros(false)}
          onClear={() => setFiltrosAvancados({})}
        />

        {/* Exportar */}
        <ExportarRelatorioDialog
          open={openExportar}
          onClose={() => setOpenExportar(false)}
          anchorEl={anchorElExportar}
          colunas={colunasManutencoes.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
        />

        {/* Modal de Deleção */}
        {openDeletar && itemSelecionado && (
          <DeletarGenerico<ManutencaoRealizadaDetalhado>
            open={openDeletar}
            onClose={() => setOpenDeletar(false)}
            item={itemSelecionado}
            getDescricao={(m) =>
              `manutenção "${
                m.manutencao ??
                m.descricaoRealizada ??
                m.id_manutencao_realizada
              }"`
            }
            onConfirmar={async (m) => {
              setCarregando(true);
              try {
                await deletarManutencaoRealizada(m.id_manutencao_realizada);
                await carregarManutencoes();
                setSnackbarMensagem("Manutenção excluída com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao excluir manutenção. Tente novamente."
                );
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenDeletar(false);
                setItemSelecionado(null);
              }
            }}
          />
        )}

        {/* Snackbar */}
        <CustomSnackbar
          open={snackbarAberto}
          onClose={() => setSnackbarAberto(false)}
          message={snackbarMensagem}
          color={snackbarCor}
        />
      </Box>
    </motion.div>
  );
}
