import { ApiGateway } from "../api";

export interface TipoCaminhao {
  id: number;
  nome: string;
  usaHorasMotor: boolean;
  habilitado: boolean;
  data_cadastro: string;
}

const api = new ApiGateway();

export const listarTiposCaminhao = async (
  signal?: AbortSignal
): Promise<TipoCaminhao[]> => {
  return await api.get<TipoCaminhao[]>("/TipoCaminhao/Listar", {}, signal);
};
