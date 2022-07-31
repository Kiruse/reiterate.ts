
export type Iterthing<T, R = unknown> = Iterable<T> | Iterator<T, R>;

//@ts-ignore
export const iterate = <T>(x: Iterthing<T>): Iterator<T> => Symbol.iterator in x ? x[Symbol.iterator]() : x;

//@ts-ignore
export const iterable = <T>(x: Iterthing<T>): Iterable<T> => Symbol.iterator in x ? x : {[Symbol.iterator]: () => x};

export function* zip<T1, T2, R1 = unknown, R2 = unknown>(lhs: Iterthing<T1, R1>, rhs: Iterthing<T2, R2>) {
  const lit = iterate(lhs);
  const rit = iterate(rhs);
  let lres = lit.next();
  let rres = rit.next();
  while (!lres.done || rres.done) {
    yield [lres.value, rres.value] as [T1, T2];
    lres = lres.done ? lres : lit.next();
    rres = rres.done ? rres : rit.next();
  }
  return [lit.return, rit.return];
}
