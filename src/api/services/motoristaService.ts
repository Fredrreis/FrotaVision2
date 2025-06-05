// src/services/motoristasService.ts

import { ApiGateway } from '../api';

export interface Motorista {
  id_motorista: number;
  nome: string;
  data_cadastro: string;
  ultimo_caminhao?: string;
  data_ultima_viagem?: string;
}

export interface NovoMotorista {
  id_motorista: number;
  nome: string;
  data_cadastro: string;
  cnpj: string;
  habilitado: boolean;
}

const api = new ApiGateway();

export const cadastrarMotorista = async (
  motorista: NovoMotorista
): Promise<void> => {
  await api.post("/Motorista/Cadastrar", motorista);
};

export const listarMotoristas = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<Motorista[]> => {
  return await api.get<Motorista[]>(`/Motorista/Listar/${cnpj}`, {}, signal);
};

export const deletarMotorista = async (id: number): Promise<void> => {
  await api.delete(`/Motorista/Deletar/${id}`);
};
