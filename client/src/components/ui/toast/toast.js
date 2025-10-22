import { enqueueSnackbar } from "notistack";
/**
 * Generic toast utility using notistack.
 * Enables consistent success/error/info notifications across the app.
 */

export const toast = {
  success(msg, options = {}) {
    enqueueSnackbar(msg, { variant: "success", ...options });
  },
  error(msg, options = {}) {
    enqueueSnackbar(msg, { variant: "error", ...options });
  },
  info(msg, options = {}) {
    enqueueSnackbar(msg, { variant: "info", ...options });
  },
  warning(msg, options = {}) {
    enqueueSnackbar(msg, { variant: "warning", ...options });
  },
};
