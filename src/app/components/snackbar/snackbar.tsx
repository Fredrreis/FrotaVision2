import { Snackbar, Fade, Box } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import "./snackbar.css";

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  color?: "primary" | "light" | "error";
}

export default function CustomSnackbar({
  open,
  onClose,
  message,
  color = "primary",
}: CustomSnackbarProps) {
  const className =
    color === "primary"
      ? "custom-snackbar-primary"
      : color === "light"
      ? "custom-snackbar-light"
      : "custom-snackbar-error";

  const icon =
    color === "error" ? (
      <CloseIcon fontSize="small" />
    ) : (
      <DoneIcon fontSize="small" />
    );

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={5000}
      slots={{ transition: Fade }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      slotProps={{
        content: {
          className,
        },
      }}
      message={
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <span>{message}</span>
        </Box>
      }
    />
  );
}
