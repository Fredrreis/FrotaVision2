import { ApiGateway } from '../api';

export interface Motorista {
  id_motorista: number;
  nome: string;
  data_cadastro: string;
  //ultimo caminhão dirigido
  //data ultima viagem
}

const api = new ApiGateway();

export const listarMotorista = async (): Promise<Motorista[]> => {
  return await api.get<Motorista[]>('/Motorista/Listar');
};
