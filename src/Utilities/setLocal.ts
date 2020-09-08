export const setLocal = <S>(key: string, value: S) => {
  localStorage.setItem(key, JSON.stringify(value));
};
