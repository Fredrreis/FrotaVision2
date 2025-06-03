import { Popper, PopperProps } from "@mui/material";
import { ReactNode } from "react";

interface GenericPopperProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  children: ReactNode;
  placement?: PopperProps["placement"];
  zIndex?: number;
}

export default function GenericPopper({
  open,
  anchorEl,
  children,
  placement = "bottom-start",
  zIndex = 1100,
}: GenericPopperProps) {
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      disablePortal={false}
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
      style={{ zIndex }}
    >
      {children}
    </Popper>
  );
}
