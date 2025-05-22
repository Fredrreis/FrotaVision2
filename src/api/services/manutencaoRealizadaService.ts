import { ApiGateway } from '../api';

export interface ManutencaoRealizada {
  id_manutencao_realizada: number;
  id_veiculo: number;
  id_manutencao: number;
  apelido: string;
  descricao: string;
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

export const cadastrarManutencaoRealizada = async (
  manutencao: ManutencaoRealizada
): Promise<void> => {
  await api.post('/ManutencaoRealizada/Cadastrar', manutencao);
};

export const listarManutencaoRealizada = async (
  signal?: AbortSignal
): Promise<ManutencaoRealizada[]> => {
  return await api.get<ManutencaoRealizada[]>(
    '/ManutencaoRealizada/ListarDetalhado',
    {},
    signal
  );
};

export const deletarManutencaoRealizada = async (
  id: number,
  signal?: AbortSignal
): Promise<void> => {
  await api.delete<void>(`/ManutencaoRealizada/Deletar/${id}`, signal);
};
