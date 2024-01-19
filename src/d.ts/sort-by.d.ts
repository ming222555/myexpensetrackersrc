declare module 'sort-by' {
  export default function sortBy<T>(...names: string[]): (a: T, b: T) => number;
}
