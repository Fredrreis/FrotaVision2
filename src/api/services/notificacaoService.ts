import { ApiGateway } from '../api';

export interface Notificacao {
  data_viagem: string;
  descricao_manutencao: string;
  idManutencaoRealizada: number;
  id_manutencao: number;
  id_veiculo: number;
  nomeManutencao: string;
  nomeVeiculo: string;
  quilometragemAtual: number;
  quilometragemManutencao: number;
  tipo_caminhao: string;
  urgente: boolean;
}

const api = new ApiGateway();

export const listarNotificacoes = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<Notificacao[]> => {
  return await api.get<Notificacao[]>(`/Notificacao/Notifacar/${cnpj}`, {}, signal);
};
