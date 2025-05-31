import {
  Avatar,
  Box,
  Typography,
  Divider,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./usuario-dropdown.css";

interface Props {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function UsuarioDropdown({
  open,
  anchorEl,
  onClose,
  onOpenSettings,
}: Props) {
  if (!anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
      disablePortal
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ]}
      style={{ zIndex: 3000 }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={150}>
          <Paper className="usuario-dropdown-container" elevation={6}>
            <ClickAwayListener onClickAway={onClose}>
              <Box>
                <Box className="usuario-dropdown-header">
                  <AccountCircleIcon className="usuario-avatar" />
                  <Typography className="usuario-nome">Paulo Franco</Typography>
                  <Typography className="usuario-email">
                    paulo.franco@email.com
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Button
                  fullWidth
                  startIcon={<SettingsIcon />}
                  className="button-configuracoes"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                >
                  CONFIGURAÇÕES
                </Button>
                <Button
                  fullWidth
                  startIcon={<LogoutIcon />}
                  className="button-sair"
                  onClick={() => alert("Logout")}
                >
                  SAIR
                </Button>
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
