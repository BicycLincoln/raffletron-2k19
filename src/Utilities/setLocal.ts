import { getLocal } from "./getLocal";

const getInitialValue = <S>(iv: (() => S) | S) => {
  if (iv instanceof Function) {
    return iv();
  } else {
    return iv;
  }
};

export const setLocal = <S>(
  key: string,
  value: S | ((prev: S) => S),
  initialValue: (() => S) | S
) => {
  let newValue: S;
  const currentValue = getLocal<S>(key);
  if (value instanceof Function) {
    newValue =
      currentValue !== undefined
        ? value(currentValue)
        : value(getInitialValue(initialValue));
  } else {
    newValue = value;
  }

  if (newValue) {
    localStorage.setItem(key, JSON.stringify(newValue));
  } else {
    localStorage.removeItem(key);
  }
};
