import { ApiGateway } from "../api";

export interface PermissaoUsuario {
  id_permissao: number;
  nome: string;
  descricao: string;
  habilitado: boolean;
  data_cadastro: string;
}

const api = new ApiGateway();

export const listarPermissoes = async (): Promise<PermissaoUsuario[]> => {
  return await api.get<PermissaoUsuario[]>("/Permissoes/Listar");
};

