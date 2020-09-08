import { Dispatch, SetStateAction, useState } from "react";
import { getLocal } from "../Utilities/getLocal";
import { setLocal } from "../Utilities/setLocal";

export const useLocalState = <S>(
  key: string,
  initialValue: (() => S) | S
): [S, Dispatch<SetStateAction<S>>] => {
  const [storedValue, setStoredValue] = useState<S>(() => {
    const iv = initialValue instanceof Function ? initialValue() : initialValue;
    try {
      return getLocal<S>(key) ?? iv;
    } catch (error) {
      console.log(error);
      return iv;
    }
  });

  const setValue = (value: S | ((prev: S) => S)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setLocal(key, valueToStore);
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
};
