import * as yup from "yup";
import { emailField, passwordField } from "@/utils/login-validation";

export const usuarioSchema = yup.object().shape({
  nome_usuario: yup.string().required("Nome obrigatório"),
  email: emailField,
  senha: passwordField,
  permissoes_usuario: yup.number().typeError("Permissão obrigatória").required("Permissão obrigatória"),
}); 