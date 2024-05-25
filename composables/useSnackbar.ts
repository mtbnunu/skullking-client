const timeout = ref(3000);
const snackbar = ref(false);
const text = ref<string>();

export const useSnackbar = () => {
  return {
    timeout,
    snackbar,
    text,
    open: (_text: string, _timeout: number = 1000) => {
      snackbar.value = false;
      setTimeout(() => {
        snackbar.value = true;
      }, 0);
      text.value = _text;
      timeout.value = _timeout;
    },
  };
};
