import { triggerGlobalError, setGlobalErrorHandler } from "@/utils/errorManager";
import { Snackbar } from "@mui/material";
import { createContext, useCallback, useEffect, useState } from "react";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export default function GlobalSnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackbar = useCallback((msg) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  useEffect(() => {
    setGlobalErrorHandler(showSnackbar);
  }, [showSnackbar]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        message={message}
        onClose={() => setOpen(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ width: 350 }}
      />
    </SnackbarContext.Provider>
  );
}