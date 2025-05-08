import { ApiGateway } from '../api';

export interface Usuario {
  id_usuario: number;
  nome_usuario: string;
  email: string;
  data_cadastro: string;
  //permissoes do usuario
}

const api = new ApiGateway();

export const listarUsuarios = async (signal?: AbortSignal): Promise<Usuario[]> => {
  return await api.get<Usuario[]>('/Usuario/Listar', {}, signal);
};

export const deletarUsuario = async (id: number): Promise<void> => {
  await api.delete(`/Usuario/Deletar/${id}`);
};
