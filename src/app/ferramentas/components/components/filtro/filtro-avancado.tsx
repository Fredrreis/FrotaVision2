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
import SnackBarCustomizada from "../../snackbar/snackbar";
import "./filtro-avancado.css";

interface FilterField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "range" | "data";
  options?: string[];
  min?: number;
  max?: number;
}

interface AdvancedFilterProps {
  open: boolean;
  onClose: () => void;
  filters: FilterField[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onClear: () => void;
  onApply: () => void;
}

export default function AdvancedFilter({
  open,
  onClose,
  filters,
  values,
  onChange,
  onClear,
  onApply,
}: AdvancedFilterProps) {
  const [localValues, setLocalValues] = useState(values);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarClearOpen, setSnackbarClearOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSnackbarOpen(false);
      setSnackbarClearOpen(false);
      setVisible(true);
    }
  }, [open]);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const isInsidePopup = ref.current?.contains(target);
      const isInsideDropdown = !!document
        .querySelector(".MuiPopover-root")
        ?.contains(target);
      if (!isInsidePopup && !isInsideDropdown) {
        requestClose();
      }
    }

    if (visible || closing) {
      document.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [visible, closing]);

  const requestClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setVisible(false);
      onClose();
    }, 100);
  };

  const handleChange = (name: string, value: any) => {
    setLocalValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onChange(localValues);
    onApply();
    setSnackbarOpen(true);
    setTimeout(() => requestClose(), 300);
  };

  const handleClear = () => {
    const cleared = Object.fromEntries(filters.map((f) => [f.name, ""]));
    setLocalValues(cleared);
    onClear();
    setSnackbarClearOpen(true);
  };

  if (!visible && !closing) return null;

  return (
    <>
      <Box
        ref={ref}
        className={`filtro-popup ${
          closing ? "slide-up-out" : "animated-slide-down"
        }`}
      >
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
                  select
                  label={filter.label}
                  name={filter.name}
                  value={localValues[filter.name] ?? ""}
                  onChange={(e) => handleChange(filter.name, e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="filtro-input"
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
                    value={localValues[filter.name] ?? filter.max ?? 0}
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
                  <Box display="flex" justifyContent="space-between" mt={-1}>
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
                  slotProps={{ inputLabel: { shrink: true } }}
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
