import * as yup from "yup";

export const viagemSchema = yup.object().shape({
  id_veiculo: yup
    .number()
    .typeError("Selecione um veículo")
    .required("Veículo obrigatório"),
  id_motorista: yup
    .number()
    .typeError("Selecione um motorista")
    .required("Motorista obrigatório"),
  origem: yup
    .string()
    .required("Origem obrigatória"),
  destino: yup
    .string()
    .required("Destino obrigatório"),
  data_inicio: yup
    .string()
    .required("Data de saída obrigatória"),
  data_fim: yup
    .string()
    .required("Data de retorno obrigatória"),
  quilometragem_viagem: yup
    .number()
    .typeError("Km deve ser um número")
    .min(0, "Km deve ser positivo")
    .required("Km obrigatório"),
  descricao: yup
    .string()
    .required("Descrição obrigatória"),
}); 