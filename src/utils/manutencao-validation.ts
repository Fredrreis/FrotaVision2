import * as yup from "yup";

export const manutencaoSchema = yup.object().shape({
  id_veiculo: yup
    .number()
    .typeError("Selecione um veículo")
    .required("Veículo obrigatório"),
  id_manutencao: yup
    .number()
    .typeError("Selecione o tipo de manutenção")
    .required("Tipo de manutenção obrigatório"),
  quilometragem_ultima_manutencao: yup
    .number()
    .typeError("Km deve ser um número")
    .min(0, "Km deve ser positivo")
    .required("Km obrigatório"),
  data_manutencao: yup
    .string()
    .required("Data obrigatória"),
  descricao: yup
    .string()
    .required("Descrição obrigatória"),
  valor_manutencao: yup
    .number()
    .typeError("Valor deve ser um número")
    .min(0, "Valor deve ser positivo")
    .required("Valor obrigatório"),
  eManuntencaoPreventiva: yup
    .string()
    .oneOf(["true", "false"], "Selecione se é preventiva ou não")
    .required("Selecione uma opção"),
}); 