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

export const listarViagens = async (): Promise<Viagem[]> => {
  return await api.get<Viagem[]>('/Viagem/ListarDetalhado');
};
