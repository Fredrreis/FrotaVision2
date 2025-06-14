import {
  Box,
  TextField,
  MenuItem,
  Slider,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useEffect, useRef, useState } from "react";
import SnackBarCustomizada from "../../../../components/snackbar/snackbar";
import GenericPopper from "@/app/components/popper/popper-generico";
import "./filtro-avancado.css";

export interface FilterField {
  name: string;
  label: string;
  type: "select" | "data" | "number" | "range" | "text";
  options?: string[];
  min?: number;
  max?: number;
  transform?: (value: unknown) => unknown;
}

interface AdvancedFilterProps {
  open: boolean;
  onClose: () => void;
  filters: FilterField[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onClear: () => void;
  onApply: () => void;
  anchorEl: HTMLElement | null;
}

export default function AdvancedFilter({
  open,
  onClose,
  filters,
  values,
  onChange,
  onClear,
  onApply,
  anchorEl,
}: AdvancedFilterProps) {
  const [localValues, setLocalValues] =
    useState<Record<string, unknown>>(values);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarClearOpen, setSnackbarClearOpen] = useState(false);
  const [resetSelectKey, setResetSelectKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleChange = (name: string, value: unknown) => {
    setLocalValues((prev) => ({ ...prev, [name]: value }));
  };

  const requestClose = () => {
    onClose();
  };

  const handleApply = () => {
    const transformedValues = { ...localValues };
    filters.forEach((filter) => {
      if (filter.transform && transformedValues[filter.name]) {
        transformedValues[filter.name] = filter.transform(
          transformedValues[filter.name]
        );
      }
    });
    onChange(transformedValues);
    onApply();
    setSnackbarOpen(true);
    setTimeout(() => requestClose(), 300);
  };

  const handleClear = () => {
    const cleared = Object.fromEntries(filters.map((f) => [f.name, ""]));
    setLocalValues(cleared);
    onClear();
    setSnackbarClearOpen(true);
    setResetSelectKey((prev) => prev + 1);
    setTimeout(() => requestClose(), 300); // <- FECHA O POPPER TAMBÉM
  };

  return (
    <>
      <GenericPopper open={open} anchorEl={anchorEl}>
        <Box ref={ref} className="filtro-popup animated-slide-down">
          <Box className="filtro-header-box">
            <FilterAltOutlinedIcon className="filtro-header-icon" />
            <IconButton onClick={requestClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box className="filtro-grid">
            {filters.map((filter) => (
              <Box
                key={filter.name}
                className={`filtro-form-group ${
                  filter.type === "range" ? "filtro-range-wrapper" : ""
                }`}
              >
                {filter.type === "select" ? (
                  <TextField
                    key={`${filter.name}-${resetSelectKey}`}
                    select
                    label={filter.label}
                    name={filter.name}
                    value={localValues[filter.name] ?? ""}
                    onChange={(e) => handleChange(filter.name, e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="filtro-input"
                    SelectProps={{
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            "& .MuiMenuItem-root": {
                              fontSize: "0.7rem",
                              minHeight: "1.5rem",
                              paddingY: "0.2rem",
                            },
                          },
                        },
                      },
                    }}
                  >
                    {filter.options?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : filter.type === "range" ? (
                  <Box width="100%">
                    <Typography className="filtro-range-label">
                      {filter.label}
                    </Typography>
                    <Slider
                      value={
                        typeof localValues[filter.name] === "number"
                          ? (localValues[filter.name] as number)
                          : filter.max ?? 0
                      }
                      onChange={(_, value) => handleChange(filter.name, value)}
                      min={filter.min}
                      max={filter.max}
                      className="filtro-range-slider"
                      valueLabelDisplay="on"
                      valueLabelFormat={(value) => {
                        if (filter.name === "custo")
                          return `R$ ${value.toFixed(2)}`;
                        if (filter.name === "km") return `${value} km`;
                        if (filter.name === "horasMotor") return `${value} h`;
                        return value;
                      }}
                    />
                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Typography className="filtro-range-label">
                        {filter.min}
                      </Typography>
                      <Typography className="filtro-range-label">
                        {filter.max}
                      </Typography>
                    </Box>
                  </Box>
                ) : filter.type === "data" ? (
                  <TextField
                    label={filter.label}
                    name={filter.name}
                    type="date"
                    value={localValues[filter.name] ?? ""}
                    onChange={(e) => handleChange(filter.name, e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="filtro-input"
                    InputLabelProps={{ shrink: true }}
                  />
                ) : (
                  <TextField
                    label={filter.label}
                    name={filter.name}
                    type={filter.type}
                    value={localValues[filter.name] ?? ""}
                    onChange={(e) => handleChange(filter.name, e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    className="filtro-input"
                  />
                )}
              </Box>
            ))}
          </Box>

          <Box className="filtro-actions">
            <Button
              onClick={handleClear}
              className="filtro-cancelar"
              variant="contained"
            >
              LIMPAR
            </Button>
            <Button
              onClick={handleApply}
              className="filtro-aplicar"
              variant="contained"
            >
              APLICAR
            </Button>
          </Box>
        </Box>
      </GenericPopper>

      <SnackBarCustomizada
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="Filtros aplicados com sucesso!"
        color="primary"
      />

      <SnackBarCustomizada
        open={snackbarClearOpen}
        onClose={() => setSnackbarClearOpen(false)}
        message="Filtros limpos com sucesso!"
        color="light"
      />
    </>
  );
}
