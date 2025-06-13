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
  .test("len", "CNPJ deve ter exatamente 14 dígitos", (val) => {
    if (!val) return false;
    
    const cnpjLimpo = val.replace(/\D/g, "");
    return cnpjLimpo.length === 14;
  })
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

// Schema para validação do perfil com confirmação de senha
export const perfilSchema = yup.object().shape({
  nome: requiredText("Nome"),
  email: emailField,
  novaSenha: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value))
    .min(6, "Mínimo de 6 caracteres")
    .optional(),
  confirmarSenha: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value))
    .when("novaSenha", {
      is: (val: string | undefined) => val && val.length > 0,
      then: (schema) => schema.oneOf([yup.ref("novaSenha")], "As senhas devem ser iguais"),
      otherwise: (schema) => schema.optional(),
    })
    .optional(),
});
