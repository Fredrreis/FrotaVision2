import { ApiGateway } from "../api";

export interface TipoManutencao {
  id_manutencao: number;
  nome: string;
  descricao: string;
  quilometragem_preventiva: number;
  habilitado: boolean;
}

const api = new ApiGateway();

export const listarTiposManutencao = async (
  signal?: AbortSignal
): Promise<TipoManutencao[]> => {
  return await api.get<TipoManutencao[]>("/Manutencoes/Listar", {}, signal);
};
