import { ApiGateway } from '../api';

export interface Motorista {
  id_motorista: number;
  nome: string;
  data_cadastro: string;
  //ultimo caminhão dirigido
  //data ultima viagem
}

const api = new ApiGateway();

export const cadastrarMotorista = async (motorista: {
  id_motorista: number;
  nome: string;
  data_cadastro: string;
  cnpj: string;
  habilitado: boolean;
}): Promise<void> => {
  const api = new ApiGateway();
  await api.post("/Motorista/Cadastrar", motorista);
};

export const listarMotorista = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<Motorista[]> => {
  return await api.get<Motorista[]>(`/Motorista/Listar/${cnpj}`, {}, signal);
};

export const deletarMotorista = async (id: number): Promise<void> => {
  await api.delete(`/Motorista/Deletar/${id}`);
};
