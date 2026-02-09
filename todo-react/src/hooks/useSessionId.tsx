/* eslint-disable react-hooks/refs */
import { useRef } from "react";


export function useSessionId(key = "sessionId"): string {
  const storage = sessionStorage;

  const sessionRef = useRef<string | null>(null);

  if (!sessionRef.current) {
    let id = storage.getItem(key);

    if (!id) {
      id = crypto.randomUUID();
      storage.setItem(key, id);
    }

    sessionRef.current = id;
  }

  return sessionRef.current;
}
