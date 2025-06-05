import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { ObjectSchema } from "yup";
import ModalFormulario, {
  Coluna,
} from "@/app/ferramentas/components/components/formulario-modal/formulario-generico";

interface EditarGenericoProps<T extends Record<string, unknown>> {
  open: boolean;
  onClose: () => void;
  onSalvar: (dados: T) => Promise<void>;
  colunas: Coluna[];
  itemEdicao: T;
  titulo?: string;
  obterOpcoesDinamicas?: () => Promise<
    Record<string, { label: string; value: string }[]>
  >;
  schema?: ObjectSchema<any>; // Yup schema opcional
}

export default function EditarGenerico<T extends Record<string, unknown>>({
  open,
  onClose,
  onSalvar,
  colunas,
  itemEdicao,
  titulo = "Editar",
  obterOpcoesDinamicas,
  schema,
}: EditarGenericoProps<T>) {
  const [dados, setDados] = useState<Partial<T>>(itemEdicao || {});
  const [colunasComOpcoes, setColunasComOpcoes] = useState<Coluna[]>(colunas);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      if (!obterOpcoesDinamicas) return;
      try {
        const opcoesMapeadas = await obterOpcoesDinamicas();
        const colunasAtualizadas = colunas.map((coluna) =>
          coluna.tipo === "selecao" && opcoesMapeadas[coluna.chave]
            ? { ...coluna, opcoes: opcoesMapeadas[coluna.chave] }
            : coluna
        );
        setColunasComOpcoes(colunasAtualizadas);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar opções dinâmicas.");
      }
    };

    if (open) {
      setDados(itemEdicao || {});
      setErro("");
      carregar();
    }
  }, [open, colunas, obterOpcoesDinamicas, itemEdicao]);

  const handleSalvar = async () => {
    try {
      if (schema) {
        await schema.validate(dados, { abortEarly: false });
      }
      await onSalvar(dados as T);
      onClose();
    } catch (error: any) {
      if (error?.inner?.length) {
        const msg = error.inner
          .map((e: any) => `${e.path}: ${e.message}`)
          .join("\n");
        setErro(msg);
      } else {
        console.error("Erro ao salvar:", error);
        setErro("Erro ao salvar os dados.");
      }
    }
  };

  return (
    <ModalFormulario
      open={open}
      onClose={onClose}
      onSalvar={handleSalvar}
      colunas={colunasComOpcoes}
      dados={dados}
      setDados={setDados}
      titulo={titulo}
      modoEdicao={true}
    >
      {erro && (
        <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>
          {erro}
        </Alert>
      )}
    </ModalFormulario>
  );
}
