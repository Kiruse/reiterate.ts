
export type Iterthing<T> = Iterable<T> | Iterator<T>;

/** Create an iterator from the given `Iterthing`. */
//@ts-ignore
export const iterate = <T>(x: Iterthing<T>): Iterator<T> => Symbol.iterator in x ? x[Symbol.iterator]() : x;

/** Create a one-time use iterable from the given `Iterthing`. */
//@ts-ignore
export const iterable = <T>(x: Iterthing<T>): Iterable<T> => Symbol.iterator in x ? x : {[Symbol.iterator]: () => x};

/** Collect all items yielded by `it` into a reusable array. */
export const collect = <T>(it: Iterthing<T>) => [...iterable(it)];

/** Call `callback` for every item yielded by `it`. */
export function each<T>(it: Iterthing<T>, callback: (item: T) => void) {
  for (const item of iterable(it))
    callback(item);
}

/** Filter items yielded by `it` by `callback`. If `callback` returns
 * `true` for an item, this item will be yielded, otherwise skipped.
 */
export function* filter<T>(it: Iterthing<T>, callback: (item: T) => boolean) {
  for (const item of iterable(it)) {
    if (callback(item))
      yield item;
  }
}

/** Map items yielded by `it` using `callback`. The transformed items are yielded. */
export function* map<I, O>(it: Iterthing<I>, callback: (item: I) => O) {
  for (const item of iterable(it)) {
    yield callback(item);
  }
}

/** Yields pairs in the pattern of `[[a, b], [b, c], [c, d], ...]`. */
export function* pairs<T>(it: Iterthing<T>) {
  const iter = iterate(it);
  let res = iter.next();
  let a = res.value;
  while (!res.done) {
    res = iter.next();
    if (!res.done) {
      const b = res.value;
      yield [a, b] as [T, T];
      a = b;
    }
  }
}

/** "Zip" two `Iterthing`s together, yielding pairs of `[T1, T2]`. If
 * either `lhs` or `rhs` terminate early, their respective value within
 * future pairs will simply be `undefined`.
 */
export function* zip<T1, T2>(lhs: Iterthing<T1>, rhs: Iterthing<T2>) {
  const lit = iterate(lhs);
  const rit = iterate(rhs);
  let lres = lit.next();
  let rres = rit.next();
  while (!lres.done || !rres.done) {
    yield [lres.value, rres.value] as [T1, T2];
    lres = lres.done ? lres : lit.next();
    rres = rres.done ? rres : rit.next();
  }
}
