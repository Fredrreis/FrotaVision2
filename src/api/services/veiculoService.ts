import { ApiGateway } from "../api";

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
  [key: string]: unknown;
}

export interface VeiculoDetalhadoResponse {
  cnpj: string;
  veiculo: Veiculo;
  countManutencao: number;
  countViagens: number;
  countUrgente: number;
  nomeUltimaManitencao: string;
  dataUltimaManutecao: string;
  ultimaManutencaoUrgenteNome: string;
  ultimaMantuenacaoUrgenteData: string;
  ultimaViagemData: string;
  ultimaViagemMotorista: string;
  ultimaViagemOrigem: string;
  ultimaViagemDestino: string;
}

export interface NovoVeiculo {
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
  [key: string]: unknown;
}

const api = new ApiGateway();

export const listarVeiculos = async (
  cnpj: string,
  signal?: AbortSignal
): Promise<Veiculo[]> => {
  return await api.get<Veiculo[]>(`/Veiculo/Listar/${cnpj}`, {}, signal);
};

export const deletarVeiculo = async (id: number): Promise<void> => {
  await api.delete(`/Veiculo/Deletar/${id}`);
};

export const cadastrarVeiculo = async (
  idUsuario: number,
  veiculo: NovoVeiculo
): Promise<void> => {
  await api.post(`/Veiculo/Cadastrar/${idUsuario}`, veiculo);
};

export const editarVeiculo = async (
  id: number,
  veiculo: Veiculo
): Promise<void> => {
  await api.put(`/Veiculo/Atualizar/${id}`, veiculo);
};

export const pesquisarVeiculoDetalhado = async (
  id: number
): Promise<VeiculoDetalhadoResponse> => {
  return await api.get<VeiculoDetalhadoResponse>(`/Veiculo/PesquisarDetalhado/${id}`);
};
