export function createArrayofSize(size: number): number[] {
  const arr: number[] = [];
  for (let i = 1; i < size + 1; i++) {
    arr.push(i);
  }
  return arr;
}
