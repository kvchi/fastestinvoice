import { useCallback, useState } from 'react';
import { readStoredJson, writeStoredJson } from '../services/storage.js';

export default function useLocalStorage(key, fallback, normalize = (value) => value) {
  const [value, setValue] = useState(() => normalize(readStoredJson(key, fallback)));

  const updateValue = useCallback(
    (nextValue) => {
      setValue((current) => {
        const resolved =
          typeof nextValue === 'function' ? nextValue(current) : nextValue;
        writeStoredJson(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, updateValue];
}
