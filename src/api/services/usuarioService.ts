import { ApiGateway } from "../api";

// Interface base com campos comuns
export interface UsuarioBase {
  nome_usuario: string;
  email: string;
  senha?: string;
  data_cadastro: string;
  cnpj: string;
  permissoes_usuario: number;
  habilitado: boolean;
}

// Payload de cadastro/edição
export interface UsuarioPayload extends UsuarioBase {
  id_usuario: number;
  [key: string]: unknown;
}

// Resposta detalhada da API
export interface UsuarioDetalhado extends UsuarioBase {
  id_usuario: number;
  nomePermissao: string;
  // outros campos que podem vir na resposta detalhada
}

// Resposta básica da API (listagem simples)
export interface UsuarioListagem extends UsuarioBase {
  id_usuario: number;
}

export interface LoginResponse {
  message: string;
  id: number;
  nome: string;
  cnpj: string;
  permissao: number;
}

const api = new ApiGateway();

export const cadastrarUsuario = async (
  usuario: UsuarioPayload
): Promise<void> => {
  await api.post("/Usuario/Cadastrar", usuario);
};

export const listarUsuarios = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<UsuarioListagem[]> => {
  return await api.get<UsuarioListagem[]>(`/Usuario/Listar/${cnpj}`, {}, signal);
};

export const listarUsuariosDetalhado = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<UsuarioDetalhado[]> => {
  return await api.get<UsuarioDetalhado[]>(`/Usuario/ListarDetalhado/${cnpj}`, {}, signal);
};

export const deletarUsuario = async (
  id: number,
  signal?: AbortSignal
): Promise<void> => {
  await api.delete<void>(`/Usuario/Deletar/${id}`, signal);
};

export const atualizarUsuario = async (
  id: number,
  usuario: UsuarioPayload,
  trocarSenha: boolean = true // valor padrão true (1)
): Promise<void> => {
  await api.put(`/Usuario/Atualizar/${id}?trocarSenha=${trocarSenha}`, usuario);
};

export const loginUsuario = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return await api.post<LoginResponse>("/Usuario/login", { email, password });
};

export const pesquisarUsuario = async (
  id: number,
  signal?: AbortSignal
): Promise<UsuarioDetalhado> => {
  return await api.get<UsuarioDetalhado>(`/Usuario/Pesquisar/${id}`, {}, signal);
};

export const pesquisarUsuarioPorEmail = async (
  email: string,
  signal?: AbortSignal
): Promise<UsuarioDetalhado> => {
  return await api.get<UsuarioDetalhado>(`/Usuario/PesquisarEmail/${email}`, {}, signal);
};
