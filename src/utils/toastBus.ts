type ToastPayload = { message: string; durationMs?: number };

type Listener = (payload: ToastPayload) => void;

const listeners = new Set<Listener>();

export function emitToast(payload: ToastPayload) {
  listeners.forEach((l) => l(payload));
}

export function subscribeToast(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener); // 반환값 무시
  };
}
