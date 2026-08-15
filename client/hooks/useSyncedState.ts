import { useState, type Dispatch, type SetStateAction } from "react";

export function useSyncedState<T>(
  value: T,
  syncKey: string | number
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(value);
  const [trackedKey, setTrackedKey] = useState(syncKey);

  if (trackedKey !== syncKey) {
    setTrackedKey(syncKey);
    if (state !== value) {
      setState(value);
    }
  }

  return [state, setState];
}
