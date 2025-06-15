"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  listarMotoristasDetalhado,
  cadastrarMotorista,
  atualizarMotorista,
  deletarMotorista,
  MotoristaDetalhado,
  MotoristaPayload,
} from "@/api/services/motoristaService";
import TabelaGenerica from "@/app/ferramentas/components/components/tabela/tabela-generica";
import ExportarRelatorioDialog from "../components/export/export-relatorio";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import Carregamento from "../../../components/carregamento/carregamento";
import { compareDateISO, formatarDataISOcomHora } from "@/utils/data";
import "./motoristas.css";
import EditarGenerico from "@/app/components/genericos/editarGenerico";
import CadastrarGenerico from "@/app/components/genericos/cadastrarGenerico";
import DeletarGenerico from "@/app/components/genericos/deletarGenerico";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import IosShareIcon from "@mui/icons-material/IosShare";
import { motoristaSchema } from "@/utils/motorista-validation";

const colunasMotoristas: {
  chave: "id" | "nome" | "dataCadastro" | "apelido" | "dataUltimaViagem";
  titulo: string;
  ordenavel: boolean;
}[] = [
  { chave: "nome", titulo: "Nome", ordenavel: false },
  { chave: "dataCadastro", titulo: "Data de Cadastro", ordenavel: true },
  { chave: "apelido", titulo: "Último Caminhão Dirigido", ordenavel: false },
  { chave: "dataUltimaViagem", titulo: "Data Última Viagem", ordenavel: true },
];

const mapeamentoCampos = {
  Nome: "nome",
  "Data de Cadastro": "dataCadastro",
  "Último caminhão dirigido": "apelido",
  "Data Última Viagem": "dataUltimaViagem",
};

const colunasFormulario: { chave: string; titulo: string; tipo: "texto" }[] = [
  { chave: "nome", titulo: "Nome", tipo: "texto" },
];

export default function Motoristas() {
  const { data: session } = useSession();
  const [dadosApi, setDadosApi] = useState<MotoristaDetalhado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [openCriar, setOpenCriar] = useState(false);
  const [itemSelecionado, setItemSelecionado] =
    useState<MotoristaDetalhado | null>(null);
  const [openEditar, setOpenEditar] = useState(false);
  const [openDeletar, setOpenDeletar] = useState(false);
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
  const [apelidosFiltro, setApelidosFiltro] = useState<string[]>([]);

  const carregarMotoristas = useCallback(() => {
    if (!session?.user?.cnpj) {
      return;
    }
    setCarregando(true);
    listarMotoristasDetalhado(session.user.cnpj)
      .then((res) => {
        setDadosApi(res);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [session?.user?.cnpj]);

  useEffect(() => {
    if (session?.user?.cnpj) {
      carregarMotoristas();
    }
  }, [session?.user?.cnpj, carregarMotoristas]);

  useEffect(() => {
    async function fetchApelidosFiltro() {
      const motoristas = await listarMotoristasDetalhado(
        session?.user?.cnpj ?? ""
      );
      setApelidosFiltro([...new Set(motoristas.map((m) => m.apelido || "—"))]);
    }
    if (session?.user?.cnpj) fetchApelidosFiltro();
  }, [session?.user?.cnpj]);

  // View-model para tabela
  const motoristasData = dadosApi.map((m) => ({
    id: m.id_motorista,
    nome: m.nome || "—",
    dataCadastro: m.data_cadastro
      ? formatarDataISOcomHora(m.data_cadastro)
      : "—",
    dataOriginal: m.data_cadastro || "",
    apelido: m.apelido || "—",
    dataUltimaViagem: m.data_ultima_viagem
      ? formatarDataISOcomHora(m.data_ultima_viagem)
      : "—",
    dataUltimaViagemOriginal: m.data_ultima_viagem || "",
  }));

  // Filtros e busca
  const dadosFiltrados = motoristasData.filter((m) => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase());
    const matchCadastro = filtrosAvancados.dataCadastro
      ? compareDateISO(m.dataOriginal, String(filtrosAvancados.dataCadastro))
      : true;
    const matchApelido = filtrosAvancados.apelido
      ? m.apelido === String(filtrosAvancados.apelido)
      : true;
    const matchUltima = filtrosAvancados.dataUltimaViagem
      ? compareDateISO(
          m.dataUltimaViagemOriginal,
          String(filtrosAvancados.dataUltimaViagem)
        )
      : true;
    return matchSearch && matchCadastro && matchApelido && matchUltima;
  });

  // Filtros avançados config
  const opcoesApelido = apelidosFiltro;
  const filtrosAvancadosConfig = [
    { name: "dataCadastro", label: "Data de Cadastro", type: "data" as const },
    {
      name: "apelido",
      label: "Último caminhão dirigido",
      type: "select" as const,
      options: opcoesApelido,
    },
    {
      name: "dataUltimaViagem",
      label: "Data Última Viagem",
      type: "data" as const,
    },
  ];

  // Payload para edição
  const payloadEdicao: MotoristaPayload | null = itemSelecionado
    ? {
        id_motorista: itemSelecionado.id_motorista,
        nome: itemSelecionado.nome,
        data_cadastro: itemSelecionado.data_cadastro,
        cnpj: session?.user?.cnpj ?? "",
        habilitado: true,
      }
    : null;

  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Motoristas..."
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
      <Box className="motoristas-container">
        <Box className="motoristas-header">
          <Typography variant="h6" className="motoristas-title">
            <AddIcon className="icon-title" /> MOTORISTAS
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
              Cadastrar Motorista
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
        <TabelaGenerica
          colunas={colunasMotoristas}
          dados={dadosFiltrados}
          onEditar={(item) => {
            const original = dadosApi.find((m) => m.id_motorista === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenEditar(true);
            }
          }}
          onExcluir={(item) => {
            const original = dadosApi.find((m) => m.id_motorista === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenDeletar(true);
            }
          }}
          exibirExaminar={false}
        />
        {/* Modal de Edição */}
        {openEditar && payloadEdicao && (
          <EditarGenerico<MotoristaPayload>
            open={openEditar}
            onClose={() => setOpenEditar(false)}
            titulo="EDITAR MOTORISTA"
            colunas={colunasFormulario}
            itemEdicao={payloadEdicao}
            schema={motoristaSchema}
            onSalvar={async (payload) => {
              setCarregando(true);
              try {
                await atualizarMotorista(payload.id_motorista, payload);
                await carregarMotoristas();
                setSnackbarMensagem("Motorista editado com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao editar motorista. Tente novamente."
                );
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenEditar(false);
              }
            }}
          />
        )}
        {/* Modal de Criação */}
        {openCriar && (
          <CadastrarGenerico<MotoristaPayload>
            open={openCriar}
            onClose={() => setOpenCriar(false)}
            titulo="CADASTRAR MOTORISTA"
            colunas={colunasFormulario}
            schema={motoristaSchema}
            onSalvar={async (formValues) => {
              setCarregando(true);
              const payload: MotoristaPayload = {
                ...formValues,
                id_motorista: 0,
                data_cadastro: new Date().toISOString(),
                cnpj: session?.user?.cnpj ?? "",
                habilitado: true,
              };
              try {
                await cadastrarMotorista(payload);
                await carregarMotoristas();
                setSnackbarMensagem("Motorista cadastrado com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao cadastrar motorista. Tente novamente."
                );
                setSnackbarCor("light");
              } finally {
                setCarregando(false);
                setSnackbarAberto(true);
                setOpenCriar(false);
              }
            }}
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
          colunas={colunasMotoristas.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
        />
        {/* Modal de Deleção */}
        {openDeletar && itemSelecionado && (
          <DeletarGenerico<MotoristaDetalhado>
            open={openDeletar}
            onClose={() => setOpenDeletar(false)}
            item={itemSelecionado}
            getDescricao={(m) => `motorista "${m.nome}"`}
            onConfirmar={async (m) => {
              setCarregando(true);
              try {
                await deletarMotorista(m.id_motorista);
                await carregarMotoristas();
                setSnackbarMensagem("Motorista excluído com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao excluir motorista. Tente novamente."
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
