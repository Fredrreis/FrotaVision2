import * as yup from "yup";

export const emailField = yup
  .string()
  .email("E-mail inválido")
  .required("E-mail obrigatório");

export const passwordField = yup
  .string()
  .min(6, "Mínimo de 6 caracteres")
  .required("Senha obrigatória");

export const cnpjField = yup
  .string()
  .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido")
  .required("CNPJ obrigatório");

export const requiredText = (label = "Campo") =>
  yup.string().required(`${label} obrigatório`);

export const step1Schema = yup.object().shape({
  email: emailField,
  password: passwordField,
});

export const step2Schema = yup.object().shape({
  empresa: requiredText("Nome da empresa"),
  cnpj: cnpjField,
});
