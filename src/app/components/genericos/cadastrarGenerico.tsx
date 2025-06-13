import React, { useEffect, useState, useRef } from "react";
import { Alert } from "@mui/material";
import { ObjectSchema } from "yup";
import ModalFormulario, {
  Coluna,
} from "@/app/ferramentas/components/components/formulario-modal/formulario-generico";

interface CadastrarGenericoProps<T extends Record<string, unknown>> {
  open: boolean;
  onClose: () => void;
  onSalvar: (dados: T) => Promise<void>;
  colunas: Coluna[];
  titulo?: string;
  obterOpcoesDinamicas?: () => Promise<
    Record<string, { label: string; value: string }[]>
  >;
  schema?: ObjectSchema<any>; // opcional
}

export default function CadastrarGenerico<T extends Record<string, unknown>>({
  open,
  onClose,
  onSalvar,
  colunas,
  titulo = "Cadastrar",
  obterOpcoesDinamicas,
  schema,
}: CadastrarGenericoProps<T>) {
  const [dados, setDados] = useState<Partial<T>>({});
  const [colunasComOpcoes, setColunasComOpcoes] = useState<Coluna[]>(colunas);
  const [erros, setErros] = useState<Record<string, string>>({});
  const prevOpen = useRef(open);

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
        setErros({ geral: "Erro ao carregar opções dinâmicas." });
      }
    };

    if (open) {
      carregar();
    }
  }, [open, colunas, obterOpcoesDinamicas]);

  useEffect(() => {
    if (!prevOpen.current && open) {
      setDados({});
      setErros({});
    }
    prevOpen.current = open;
  }, [open]);

  const handleSalvar = async () => {
    try {
      if (schema) {
        await schema.validate(dados, { abortEarly: false });
      }
      await onSalvar(dados as T);
      onClose();
    } catch (error: any) {
      if (error?.inner?.length) {
        const errosObj: Record<string, string> = {};
        error.inner.forEach((e: any) => {
          if (e.path) errosObj[e.path] = e.message;
        });
        setErros(errosObj);
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
      modoEdicao={false}
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
