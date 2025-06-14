import { ApiGateway } from '../api';

// Campos comuns entre payload e resposta
interface ManutencaoRealizadaBase {
  id_veiculo: number;
  id_manutencao: number;
  quilometragem_ultima_manutencao: number;
  data_manutencao: string;
  valor_manutencao: number;
  eManuntencaoPreventiva: boolean;
  descricao: string;
}

// Payload de cadastro/edição
export interface ManutencaoRealizada extends ManutencaoRealizadaBase {
  id_manutencao_realizada: number;
  data_cadastro: string;
  habilitado: boolean;
  cnpj: string;
  [key: string]: unknown;
}

// Resposta da API (listagem/detalhe)
export interface ManutencaoRealizadaDetalhado extends ManutencaoRealizadaBase {
  id_manutencao_realizada: number;
  apelido: string;
  tipo: string;
  descricaoRealizada: string;
  manutencao: string;
  data_cadastro?: string;
}

const api = new ApiGateway();

export const cadastrarManutencaoRealizada = async (
  manutencao: ManutencaoRealizada
): Promise<void> => {
  await api.post('/ManutencaoRealizada/Cadastrar', manutencao);
};

export const listarManutencaoRealizada = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<ManutencaoRealizadaDetalhado[]> => {
  return await api.get<ManutencaoRealizadaDetalhado[]>(
    `/ManutencaoRealizada/ListarDetalhado/${cnpj}`,
    {},
    signal
  );
};

export const atualizarManutencaoRealizada = async (
  id: number,
  payload: ManutencaoRealizada
): Promise<void> => {
  await api.put(`/ManutencaoRealizada/Atualizar/${id}`, payload);
};

export const deletarManutencaoRealizada = async (
  id: number,
  signal?: AbortSignal
): Promise<void> => {
  await api.delete<void>(`/ManutencaoRealizada/Deletar/${id}`, signal);
};
