import { ApiGateway } from '../api';

export interface Notificacao {
  data_Manutencao: string;
  descricao_manutencao: string;
  idManutencaoRealizada: number;
  id_manutencao: number;
  id_veiculo: number;
  nomeManutencao: string;
  nomeVeiculo: string;
  quilometragemAtual: number;
  quilometragemManutencao: number;
  tipo_caminhao: string;
  urgencia: boolean;  // Alterado de urgente para urgencia
}

const api = new ApiGateway();

export const listarNotificacoes = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<Notificacao[]> => {
  return await api.get<Notificacao[]>(`/Notificacao/Notificar/${cnpj}`, {}, signal);
};
