// src/utils/data.ts

/**
 * Compara se duas datas (formato ISO e input date) representam o mesmo dia.
 * @param iso ISO string ou `dd/mm/yyyy`
 * @param inputData String no formato `yyyy-mm-dd` (vindo de input type="date")
 */
export const compareDateISO = (iso: string, inputData: string): boolean => {
    if (!iso || !inputData) return false;
    const isoDate = new Date(iso).toISOString().slice(0, 10);
    return isoDate === inputData;
  };
  
  /**
   * Formata uma string ISO para `dd/mm/yyyy` + `HH:mm`
   */
  export const formatarDataISOcomHora = (iso: string): string => {
    if (!iso) return "—";
    const data = new Date(iso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
  };
  