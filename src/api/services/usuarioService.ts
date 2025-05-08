import { ApiGateway } from '../api';

export interface Usuario {
  id_usuario: number;
  nome_usuario: string;
  email: string;
  data_cadastro: string;
  //permissoes do usuario
}

const api = new ApiGateway();

export const listarUsuarios = async (): Promise<Usuario[]> => {
  return await api.get<Usuario[]>('/Usuario/Listar');
};
