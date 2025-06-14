// src/services/motoristasService.ts

import { ApiGateway } from '../api';

// Interface base com campos comuns
export interface MotoristaBase {
  id_motorista: number;
  nome: string;
  data_cadastro: string;
}

// Payload de cadastro/edição
export interface MotoristaPayload extends MotoristaBase {
  cnpj: string;
  habilitado: boolean;
  [key: string]: unknown;
}

// Resposta detalhada da API
export interface MotoristaDetalhado extends MotoristaBase {
  apelido?: string;
  data_ultima_viagem?: string;
  // outros campos que podem vir na resposta detalhada
}

const api = new ApiGateway();

export const cadastrarMotorista = async (
  motorista: MotoristaPayload
): Promise<void> => {
  await api.post('/Motorista/Cadastrar', motorista);
};

export const listarMotoristas = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<MotoristaBase[]> => {
  return await api.get<MotoristaBase[]>(`/Motorista/Listar/${cnpj}`, {}, signal);
};

export const listarMotoristasDetalhado = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<MotoristaDetalhado[]> => {
  return await api.get<MotoristaDetalhado[]>(
    `/Motorista/ListarDetalhado/${cnpj}`,
    {},
    signal
  );
};

export const atualizarMotorista = async (
  id: number,
  payload: MotoristaPayload
): Promise<void> => {
  await api.put(`/Motorista/Atualizar/${id}`, payload);
};

export const deletarMotorista = async (
  id: number,
  signal?: AbortSignal
): Promise<void> => {
  await api.delete<void>(`/Motorista/Deletar/${id}`, signal);
};
