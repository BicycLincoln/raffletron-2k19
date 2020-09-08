export const getLocal = <S>(key: string) => {
  const fromStorage = localStorage.getItem(key);
  return fromStorage ? JSON.parse(fromStorage) as S : undefined;
};
