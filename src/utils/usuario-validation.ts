import * as yup from "yup";

export interface UsuarioSchemaType {
  nome_usuario: string;
  email: string;
  senha?: string;
  confirmarSenha?: string;
  permissoes_usuario: number;
  __editarSenha?: boolean;
}

export const usuarioCadastroSchema = yup.object().shape({
  nome_usuario: yup.string().required("Nome obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  senha: yup.string().min(6, "Mínimo de 6 caracteres").required("Senha obrigatória"),
  permissoes_usuario: yup.number().required("Permissão obrigatória"),
}) as yup.ObjectSchema<Record<string, unknown>>;

export const usuarioEdicaoSchema = yup.object().shape({
  nome_usuario: yup.string().required("Nome obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail obrigatório"),
  senha: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value))
    .when("__editarSenha", {
      is: true,
      then: (schema) => schema.min(6, "Mínimo de 6 caracteres").required("Senha obrigatória"),
      otherwise: (schema) => schema.optional(),
    }),
  confirmarSenha: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value))
    .when("__editarSenha", {
      is: true,
      then: (schema) =>
        schema
          .oneOf([yup.ref("senha")], "As senhas devem ser iguais")
          .required("Confirme a senha"),
      otherwise: (schema) => schema.optional(),
    }),
  permissoes_usuario: yup.number().required("Permissão obrigatória"),
  __editarSenha: yup.boolean().optional(),
}) as yup.ObjectSchema<Record<string, unknown>>; 