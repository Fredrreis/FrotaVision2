import { ApiGateway } from '../api';

// Interface base com campos comuns
export interface ViagemBase {
  id_veiculo: number;
  quilometragem_viagem: number;
  id_motorista: number;
  origem: string;
  destino: string;
  data_inicio: string;
  data_fim: string;
  descricao: string;
}

// Payload de cadastro/edição
export interface ViagemPayload extends ViagemBase {
  id_viagem: number;
  habilitado: boolean;
  cnpj: string;
  [key: string]: unknown;
}

// Resposta detalhada da API
export interface ViagemDetalhada extends ViagemBase {
  id_viagem: number;
  nome_motorista: string;
  apelido_veiculo: string;
  placa_veiculo: string;
}

const api = new ApiGateway();

export const cadastrarViagem = async (
  viagem: ViagemPayload
): Promise<void> => {
  await api.post('/Viagem/Cadastrar', viagem);
};

export const listarViagensDetalhado = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<ViagemDetalhada[]> => {
  return await api.get<ViagemDetalhada[]>(
    `/Viagem/ListarDetalhado/${cnpj}`,
    {},
    signal
  );
};

export const atualizarViagem = async (
  id: number,
  payload: ViagemPayload
): Promise<void> => {
  await api.put(`/Viagem/Atualizar/${id}`, payload);
};

export const deletarViagem = async (
  id: number,
  signal?: AbortSignal
): Promise<void> => {
  await api.delete<void>(`/Viagem/Deletar/${id}`, signal);
};
