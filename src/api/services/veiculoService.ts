import { ApiGateway } from '../api';

export interface Veiculo {
  id_veiculo: number;
  apelido: string;
  quilometragem: number;
  horas_motor: number;
  descricao: string;
  placa: string;
  chassi: string;
  cnpj: string;
  tipo: number;
  habilitado: boolean;
  data_cadastro: string;
  ano: number;
}

const api = new ApiGateway();

export const listarVeiculos = async (
  signal?: AbortSignal
): Promise<Veiculo[]> => {
  return await api.get<Veiculo[]>('/Veiculo/Listar', {}, signal);
};

export const deletarVeiculo = async (id: number): Promise<void> => {
  await api.delete(`/Veiculo/Deletar/${id}`);
};
