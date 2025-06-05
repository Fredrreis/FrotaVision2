// src/api/services/usuarioService.ts

import { ApiGateway } from "../api";

export interface Usuario {
  id_usuario: number;
  nome_usuario: string;
  email: string;
  senha: string;
  data_cadastro: string;
  cnpj: string;
  permissoes_usuario: number;
  habilitado: boolean;
}

export interface LoginResponse {
  message: string;
  id: number;
  nome: string;
  cnpj: string;
  permissao: number;
}

const api = new ApiGateway();

export const listarUsuarios = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<Usuario[]> => {
  return await api.get<Usuario[]>(`/Usuario/Listar/${cnpj}`, {}, signal);
};

export const deletarUsuario = async (id: number): Promise<void> => {
  await api.delete(`/Usuario/Deletar/${id}`);
};

export const cadastrarUsuario = async (usuario: Usuario): Promise<void> => {
  await api.post("/Usuario/Cadastrar", usuario);
};

export const loginUsuario = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return await api.post<LoginResponse>("/Usuario/login", { email, password });
};

export const atualizarUsuario = async (
  id: number,
  usuario: Usuario
): Promise<void> => {
  await api.put(`/Usuario/Atualizar/${id}`, usuario);
};
