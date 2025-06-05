import * as yup from "yup";

const placaField = yup
  .string()
  .transform((value) => (value ? value.toUpperCase() : ""))
  .required("obrigatória")
  .matches(
    /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/,
    "Placa inválida (formato esperado: ABC1D23)"
  );

export const veiculoSchema = yup.object().shape({
  placa: placaField,
  apelido: yup.string().required("obrigatório"),
  tipo: yup.string().required("obrigatório"),
  chassi: yup.string().required("obrigatório"),
  descricao: yup.string().required("obrigatória"),
  quilometragem: yup
    .number()
    .typeError("Km deve ser um número")
    .min(0, "Km deve ser positivo")
    .required("Km obrigatório"),
  ano: yup
    .number()
    .typeError("Ano deve ser um número")
    .min(1900, "Ano inválido")
    .required("Ano obrigatório"),
});
