import * as yup from "yup";
 
export const motoristaSchema = yup.object().shape({
  nome: yup
    .string()
    .required("Nome do motorista obrigatório"),
}); 