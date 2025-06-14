import React, { useEffect, useState, useRef } from "react";
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
  schema?: ObjectSchema<Record<string, unknown>>; // Yup schema opcional
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
  const [erros, setErros] = useState<Record<string, string>>({});
  const prevOpen = useRef(open);

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
      setErros({ geral: "Erro ao carregar opções dinâmicas." });
    }
  };

  useEffect(() => {
    if (open) {
      carregar();
    }
  }, [open, colunas, obterOpcoesDinamicas, itemEdicao, carregar]);

  useEffect(() => {
    if (!prevOpen.current && open) {
      setDados(itemEdicao || {});
      setErros({});
    }
    prevOpen.current = open;
  }, [open, itemEdicao]);

  const handleSalvar = async () => {
    try {
      if (schema) {
        await schema.validate(dados, { abortEarly: false });
      }
      await onSalvar(dados as T);
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error && error.message) {
        setErros({ geral: error.message });
      } else {
        console.error("Erro ao salvar:", error);
        setErros({ geral: "Erro ao salvar os dados." });
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
      erros={erros}
    >
      {erros.geral && (
        <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>
          {erros.geral}
        </Alert>
      )}
    </ModalFormulario>
  );
}
