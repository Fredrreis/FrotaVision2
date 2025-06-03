import React, { useState, useEffect, useRef } from "react";
import { exportarDocx } from "./templates/export-docx-file";
import { exportarPdf } from "./templates/export-pdf-file";
import { exportarCsv } from "./templates/export-csv-file";
import {
  Box,
  IconButton,
  MenuItem,
  Button,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IosShareIcon from "@mui/icons-material/IosShare";
import SnackBarCustomizada from "../../../../components/snackbar/snackbar";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import GenericPopper from "@/app/components/popper/popper-generico";
import "./export-relatorio.css";

interface Props {
  open: boolean;
  onClose: () => void;
  colunas: string[];
  dados: Record<string, any>[];
  mapeamentoCampos: Record<string, string>;
  anchorEl: HTMLElement | null;
}

export default function ExportarRelatorioDialog({
  open,
  onClose,
  colunas,
  dados,
  mapeamentoCampos,
  anchorEl,
}: Props) {
  const [formato, setFormato] = useState("pdf");
  const [colunasSelecionadas, setColunasSelecionadas] =
    useState<string[]>(colunas);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSnackbarOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (formato !== "csv") setColunasSelecionadas(colunas);
  }, [formato, colunas]);

  const requestClose = () => {
    onClose();
  };

  const handleExportar = async () => {
    if (formato === "pdf") exportarPdf(colunas, dados, mapeamentoCampos);
    else if (formato === "csv")
      exportarCsv(colunasSelecionadas, dados, mapeamentoCampos);
    else if (formato === "docx")
      await exportarDocx(colunas, dados, mapeamentoCampos);

    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 3000);
    requestClose();
  };

  const handleToggleAll = () => {
    setColunasSelecionadas((prev) =>
      prev.length === colunas.length ? [] : colunas
    );
  };

  const isExportDisabled =
    formato === "csv" && colunasSelecionadas.length === 0;

  return (
    <>
      <GenericPopper open={open} anchorEl={anchorEl}>
        <Box ref={ref} className="exportar-popup animated-slide-down">
          <Box className="exportar-header">
            <IosShareIcon className="exportar-icon" />
            <IconButton onClick={requestClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box className="exportar-form-group">
            <TextField
              select
              label="Formato"
              value={formato}
              onChange={(e) => setFormato(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              className="filtro-input"
            >
              <MenuItem value="pdf">
                <PictureAsPdfIcon className="dropdown-icons" /> Pdf
              </MenuItem>
              <MenuItem value="csv">
                <FormatIndentIncreaseIcon className="dropdown-icons" /> Csv
              </MenuItem>
              <MenuItem value="docx">
                <ArticleIcon className="dropdown-icons" /> Docx
              </MenuItem>
            </TextField>
          </Box>

          {formato === "csv" && (
            <Box className="exportar-colunas">
              <Typography className="exportar-label">
                Selecione as colunas:
              </Typography>
              <FormGroup>
                {colunas.map((col) => (
                  <FormControlLabel
                    key={col}
                    control={
                      <Checkbox
                        size="small"
                        checked={colunasSelecionadas.includes(col)}
                        onChange={() =>
                          setColunasSelecionadas((prev) =>
                            prev.includes(col)
                              ? prev.filter((c) => c !== col)
                              : [...prev, col]
                          )
                        }
                      />
                    }
                    label={col}
                    className="exportar-checkbox"
                  />
                ))}
              </FormGroup>
            </Box>
          )}

          <Box className="exportar-actions">
            {formato === "csv" && (
              <Button
                onClick={handleToggleAll}
                className="exportar-toggle"
                variant="outlined"
                size="small"
              >
                Marcar/Desmarcar Tudo
              </Button>
            )}
            <Button
              onClick={handleExportar}
              className="exportar-aplicar"
              variant="contained"
              disabled={isExportDisabled}
            >
              Baixar
            </Button>
          </Box>
        </Box>
      </GenericPopper>

      <SnackBarCustomizada
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="Relatório exportado com sucesso!"
        color="primary"
      />
    </>
  );
}
