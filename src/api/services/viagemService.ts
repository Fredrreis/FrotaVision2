import { ApiGateway } from '../api';

export interface Viagem {
  id_viagem: number;
  data_inicio: string;
  data_fim: string;
  quilometragem_viagem: number;
  nome_motorista: string;
  apelido_veiculo: string;
  placa_veiculo: string;
  //origem
  //destino
  //descricao
}

const api = new ApiGateway();

export const listarViagens = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<Viagem[]> => {
  return await api.get<Viagem[]>(`/Viagem/Listar/${cnpj}`, {}, signal);
};

export const deletarViagem = async (id: number): Promise<void> => {
  await api.delete(`/Viagem/Deletar/${id}`);
};
