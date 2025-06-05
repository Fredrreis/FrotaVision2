import {
  Avatar,
  Box,
  Typography,
  Divider,
  Button,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSession, signOut } from "next-auth/react";
import GenericPopper from "@/app/components/popper/popper-generico";
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
  const { data: session } = useSession();

  if (!anchorEl) return null;

  return (
    <GenericPopper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      zIndex={3000}
    >
      <Paper
        className="usuario-dropdown-container animated-slide-down"
        elevation={6}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Box>
            <Box className="usuario-dropdown-header">
              <AccountCircleIcon className="usuario-avatar" />
              <Typography className="usuario-nome">
                {session?.user?.nome || "Sem nome"}
              </Typography>
              <Typography className="usuario-email">
                {session?.user?.email || "Sem e-mail"}
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
              onClick={() => {
                onClose();
                signOut({ callbackUrl: "/auth/login" });
              }}
            >
              SAIR
            </Button>
          </Box>
        </ClickAwayListener>
      </Paper>
    </GenericPopper>
  );
}
