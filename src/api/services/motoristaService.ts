import { ApiGateway } from '../api';

export interface Motorista {
  id_motorista: number;
  nome: string;
  data_cadastro: string;
  //ultimo caminhão dirigido
  //data ultima viagem
}

const api = new ApiGateway();

export const listarMotorista = async (
  signal?: AbortSignal
): Promise<Motorista[]> => {
  return await api.get<Motorista[]>('/Motorista/Listar', {}, signal);
};

export const deletarMotorista = async (id: number): Promise<void> => {
  await api.delete(`/Motorista/Deletar/${id}`);
};
