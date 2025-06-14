"use client";
import React, { useEffect, useState } from "react";
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
  listarUsuariosDetalhado,
  cadastrarUsuario,
  atualizarUsuario,
  deletarUsuario,
  UsuarioDetalhado,
  UsuarioPayload,
} from "@/api/services/usuarioService";
import TabelaGenerica from "@/app/ferramentas/components/components/tabela/tabela-generica";
import ExportarRelatorioDialog from "../components/export/export-relatorio";
import FiltroAvancado from "../components/filtro/filtro-avancado";
import CustomSnackbar from "../../../components/snackbar/snackbar";
import Carregamento from "../../../components/carregamento/carregamento";
import { formatarDataISOcomHora, compareDateISO } from "@/utils/data";
import "./usuarios.css";
import EditarGenerico from "@/app/components/genericos/editarGenerico";
import CadastrarGenerico from "@/app/components/genericos/cadastrarGenerico";
import DeletarGenerico from "@/app/components/genericos/deletarGenerico";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import SearchIcon from "@mui/icons-material/Search";
import { usuarioSchema } from "@/utils/usuario-validation";
import {
  listarPermissoes,
  PermissaoUsuario,
} from "@/api/services/permissaoUsuarioService";

const colunasUsuarios: {
  chave: "id" | "nome" | "email" | "data" | "dataOriginal" | "permissoes";
  titulo: string;
  ordenavel: boolean;
}[] = [
  { chave: "email", titulo: "Email", ordenavel: false },
  { chave: "nome", titulo: "Nome de Usuário", ordenavel: false },
  { chave: "data", titulo: "Data", ordenavel: true },
  { chave: "permissoes", titulo: "Permissões do Usuário", ordenavel: false },
];

const mapeamentoCampos = {
  Email: "email",
  "Nome de Usuário": "nome",
  Data: "data",
  "Permissões do Usuário": "permissoes",
};

const colunasFormulario = [
  { chave: "nome_usuario", titulo: "Nome de Usuário", tipo: "texto" as const },
  { chave: "email", titulo: "Email", tipo: "texto" as const },
  { chave: "senha", titulo: "Senha", tipo: "senha" as const },
  {
    chave: "permissoes_usuario",
    titulo: "Permissão",
    tipo: "selecao" as const,
  },
];

// Função para buscar opções dinâmicas do select de permissões
async function obterOpcoesDinamicasPermissoes() {
  try {
    const permissoes: PermissaoUsuario[] = await listarPermissoes();
    return {
      permissoes_usuario: permissoes.map((p) => ({
        label: p.nome,
        value: String(p.id_permissao),
      })),
    };
  } catch {
    return { permissoes_usuario: [] };
  }
}

export default function Usuarios() {
  const { data: session } = useSession();
  const [dadosApi, setDadosApi] = useState<UsuarioDetalhado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [openCriar, setOpenCriar] = useState(false);
  const [itemSelecionado, setItemSelecionado] =
    useState<UsuarioDetalhado | null>(null);
  const [openEditar, setOpenEditar] = useState(false);
  const [openDeletar, setOpenDeletar] = useState(false);
  const [search, setSearch] = useState("");
  const [openFiltros, setOpenFiltros] = useState(false);
  const [openExportar, setOpenExportar] = useState(false);
  const [filtrosAvancados, setFiltrosAvancados] = useState<
    Record<string, unknown>
  >({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [anchorElExportar, setAnchorElExportar] = useState<HTMLElement | null>(
    null
  );
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [snackbarMensagem, setSnackbarMensagem] = useState("");
  const [snackbarCor, setSnackbarCor] = useState<"primary" | "light">(
    "primary"
  );

  const carregarUsuarios = () => {
    if (!session?.user?.cnpj) return;
    setCarregando(true);
    listarUsuariosDetalhado(session.user.cnpj)
      .then((res) => setDadosApi(res))
      .catch((err) => {
        if (
          !(
            err.name === "CanceledError" ||
            err.code === "ERR_CANCELED" ||
            err.message === "canceled"
          )
        )
          console.error(err);
      })
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    if (session?.user?.cnpj) {
      carregarUsuarios();
    }
  }, [session?.user?.cnpj, carregarUsuarios]);

  console.log(dadosApi);

  const usuariosData = dadosApi.map((u) => ({
    id: u.id_usuario,
    nome: u.nome_usuario || "—",
    email: u.email || "—",
    data: u.data_cadastro ? formatarDataISOcomHora(u.data_cadastro) : "—",
    dataOriginal: u.data_cadastro || "",
    permissoes: u.nomePermissao || "—",
  }));

  const dadosFiltrados = usuariosData.filter((usuario) => {
    const matchSearch =
      usuario.nome.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase());
    const matchPermissao = filtrosAvancados.permissoes
      ? usuario.permissoes === String(filtrosAvancados.permissoes)
      : true;
    const matchData = filtrosAvancados.data
      ? compareDateISO(usuario.dataOriginal, String(filtrosAvancados.data))
      : true;
    return matchSearch && matchPermissao && matchData;
  });

  const permissoesUnicas = [...new Set(usuariosData.map((u) => u.permissoes))];
  const filtrosAvancadosConfig = [
    {
      name: "permissoes",
      label: "Permissões",
      type: "select" as const,
      options: permissoesUnicas,
    },
    {
      name: "data",
      label: "Data",
      type: "data" as const,
    },
  ];

  // Payload para edição
  const payloadEdicao: UsuarioPayload | null = itemSelecionado
    ? {
        id_usuario: itemSelecionado.id_usuario,
        nome_usuario: itemSelecionado.nome_usuario,
        email: itemSelecionado.email,
        senha: "",
        permissoes_usuario: itemSelecionado.permissoes_usuario,
        data_cadastro: itemSelecionado.data_cadastro,
        cnpj: session?.user?.cnpj ?? "",
        habilitado: true,
      }
    : null;

  if (carregando) {
    return (
      <Carregamento
        animationUrl="/lotties/carregamento.json"
        mensagem="Carregando Usuários..."
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
      <Box className="usuarios-container">
        <Box className="usuarios-header">
          <Typography variant="h6" className="usuarios-title">
            <AddIcon className="icon-title" /> USUÁRIOS
          </Typography>
        </Box>
        <Box className="usuarios-filtros">
          <Box className="search-filtros-container">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar por nome ou email"
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
                setAnchorEl(e.currentTarget);
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
              Cadastrar Usuário
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
          colunas={colunasUsuarios}
          dados={dadosFiltrados}
          onEditar={(item) => {
            const original = dadosApi.find((u) => u.id_usuario === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenEditar(true);
            }
          }}
          onExcluir={(item) => {
            const original = dadosApi.find((u) => u.id_usuario === item.id);
            if (original) {
              setItemSelecionado(original);
              setOpenDeletar(true);
            }
          }}
          exibirExaminar={false}
        />
        {/* Modal de Edição */}
        {openEditar && payloadEdicao && (
          <EditarGenerico<UsuarioPayload>
            open={openEditar}
            onClose={() => setOpenEditar(false)}
            titulo="EDITAR USUÁRIO"
            colunas={colunasFormulario}
            itemEdicao={payloadEdicao}
            schema={usuarioSchema}
            obterOpcoesDinamicas={obterOpcoesDinamicasPermissoes}
            onSalvar={async (payload) => {
              setCarregando(true);
              try {
                await atualizarUsuario(payload.id_usuario, payload);
                await carregarUsuarios();
                setSnackbarMensagem("Usuário editado com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem("Erro ao editar usuário. Tente novamente.");
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
          <CadastrarGenerico<UsuarioPayload>
            open={openCriar}
            onClose={() => setOpenCriar(false)}
            titulo="CADASTRAR USUÁRIO"
            colunas={colunasFormulario}
            schema={usuarioSchema}
            obterOpcoesDinamicas={obterOpcoesDinamicasPermissoes}
            onSalvar={async (formValues) => {
              setCarregando(true);
              const payload: UsuarioPayload = {
                ...formValues,
                id_usuario: 0,
                data_cadastro: new Date().toISOString(),
                cnpj: session?.user?.cnpj ?? "",
                habilitado: true,
              };
              try {
                await cadastrarUsuario(payload);
                await carregarUsuarios();
                setSnackbarMensagem("Usuário cadastrado com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao cadastrar usuário. Tente novamente."
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
          filters={filtrosAvancadosConfig}
          values={filtrosAvancados}
          onChange={setFiltrosAvancados}
          onApply={() => setOpenFiltros(false)}
          onClear={() => setFiltrosAvancados({})}
          anchorEl={anchorEl}
        />
        {/* Exportar */}
        <ExportarRelatorioDialog
          open={openExportar}
          onClose={() => setOpenExportar(false)}
          colunas={colunasUsuarios.map((c) => c.titulo)}
          dados={dadosFiltrados}
          mapeamentoCampos={mapeamentoCampos}
          anchorEl={anchorElExportar}
        />
        {/* Modal de Deleção */}
        {openDeletar && itemSelecionado && (
          <DeletarGenerico<UsuarioDetalhado>
            open={openDeletar}
            onClose={() => setOpenDeletar(false)}
            item={itemSelecionado}
            getDescricao={(u) => `usuário "${u.nome_usuario}"`}
            onConfirmar={async (u) => {
              setCarregando(true);
              try {
                await deletarUsuario(u.id_usuario);
                await carregarUsuarios();
                setSnackbarMensagem("Usuário excluído com sucesso!");
                setSnackbarCor("primary");
              } catch {
                setSnackbarMensagem(
                  "Erro ao excluir usuário. Tente novamente."
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
