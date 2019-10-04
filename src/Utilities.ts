export const getLocal = (key: string) => {
  const fromStorage = localStorage.getItem(key);
  return fromStorage ? JSON.parse(fromStorage) : null;
};

export const setLocal = (key: string, value: any) => {
  const toStorage = value;
  localStorage.setItem(key, JSON.stringify(toStorage));
};

export const shuffle = (a: any[]) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const random = (items: any[]) => {
  return items[Math.floor(Math.random()*items.length)];
}
