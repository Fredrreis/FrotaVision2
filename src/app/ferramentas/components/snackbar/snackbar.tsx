import { Snackbar, Fade, Box } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import './snackbar.css';

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
  color?: 'primary' | 'light';
}

export default function CustomSnackbar({
  open,
  onClose,
  message,
  color = 'primary',
}: CustomSnackbarProps) {
  const className =
    color === 'primary' ? 'custom-snackbar-primary' : 'custom-snackbar-light';

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={5000}
      slots={{ transition: Fade }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slotProps={{
        content: {
          className,
        },
      }}
      message={
        <Box display="flex" alignItems="center" gap={1}>
          <DoneIcon fontSize="small" />
          <span>{message}</span>
        </Box>
      }
    />
  );
}
