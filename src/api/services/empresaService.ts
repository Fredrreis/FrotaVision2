import { ApiGateway } from "../api";

export interface Empresa {
  cnpj: string;
  nome_social: string;
  data_cadastro: string;
  id_plano: number;
  habilitado: boolean;
}

const api = new ApiGateway();

export const cadastrarEmpresa = async (empresa: Empresa): Promise<void> => {
  await api.post("/Empresa/Cadastrar", empresa);
};

export const pesquisarEmpresa = async (
   cnpj: string
): Promise<Empresa> => {
  return await api.get<Empresa>(`/Empresa/Pesquisar/${cnpj}`);
};
