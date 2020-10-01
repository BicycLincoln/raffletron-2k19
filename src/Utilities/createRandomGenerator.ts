import RiggedDie from "gamblers-dice";

export const createRandomGenerator = <T>(items: T[]): (() => T) => {
  const die = new RiggedDie(items.length);
  return () => {
    return items[die.roll() - 1];
  };
};
