import { ApiGateway } from '../api';

export interface ManutencaoRealizada {
  id_manutencao_realizada: number;
  apelido: string;
  //tipo do caminhão
  quilometragem_ultima_manutencao: number;
  horasMotorManutencao: number;
  data_manutencao: string;
  valor_manutencao: number;
  eManuntencaoPreventiva: string;
  descricaoManutencao: string;
  nome: string;
}

const api = new ApiGateway();

export const listarManutencaoRealizada = async (): Promise<ManutencaoRealizada[]> => {
  return await api.get<ManutencaoRealizada[]>('/ManutencaoRealizada/ListarDetalhado');
};
