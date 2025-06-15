let errorHandler = null;

export const setGlobalErrorHandler = (fn) => {
  errorHandler = fn;
};

export const triggerGlobalError = (msg) => {
  if (errorHandler) {
    errorHandler(msg);
  } else {
    console.error("Global error handler tanımlı değil:", msg);
  }
};
