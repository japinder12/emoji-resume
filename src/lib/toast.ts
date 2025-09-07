let pushToast: ((text: string) => void) | null = null;

export function toast(text: string) {
  pushToast?.(text);
}

export function setToastHandler(fn: ((text: string) => void) | null) {
  pushToast = fn;
}
