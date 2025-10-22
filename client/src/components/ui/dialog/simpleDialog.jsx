import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SimpleDialog({
  open,
  onClose,
  title,
  children,
  actions,              
  maxWidth = "sm",
  fullWidth = true,
  dividers = true,
  hideClose = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
      {title && (
        <DialogTitle sx={{ pr: hideClose ? 3 : 5 }}>
          {title}
          {!hideClose && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              size="small"
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent dividers={dividers}>{children}</DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
