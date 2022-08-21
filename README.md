# Reiterate Microlibrary
*Reiterate* is a small TypeScript-native library designed to unify both iterables & iterators, and to provide an experience already built into other programming languages such as Python.

## Example
```typescript
import { collect, zip } from 'reiterate';

const a = new Set([1, 2, 3]);
const b = ['a', 'b', 'c'];
console.log(collect(zip(a, b)))
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

**Note** that this microlibrary is still in heavy development and many of its features still in design phase. For instance, I'd like to add iterators as callbacks, and async variants at some point.

## Usage
* Most if not all functions supplied by *reiterate* allow passing both regular iterables (such as arrays or sets) as well as iterators (such as `Map.keys()` or generators).
* *Reiterate* uses a functional approach much like underscore.
* Taking after Python, almost all functions' results will be iterators, applying their operation step by step rather than in batch.
* Use `collect` to collect these results into an array.

# Table of Contents
- [Reiterate Microlibrary](#reiterate-microlibrary)
  - [Example](#example)
  - [Usage](#usage)
- [Table of Contents](#table-of-contents)
- [Documentation](#documentation)
  - [Core Interface](#core-interface)
    - [`Iterthing`](#iterthing)
    - [`iterate`](#iterate)
    - [`iterable`](#iterable)
    - [`collect`](#collect)
  - [Auxiliary Interface](#auxiliary-interface)
    - [`chain`](#chain)
    - [`each`](#each)
    - [`filter`](#filter)
    - [`first`](#first)
    - [`map`](#map)
    - [`last`](#last)
    - [`pairs`](#pairs)
    - [`reduce`](#reduce)
    - [`repeat`](#repeat)
    - [`steps`](#steps)
    - [`zip`](#zip)

# Documentation

## Core Interface
Following are the most important and commonly used functions and/or types of this library. They serve to interface between iterators & iterables, allowing conversion from and to each. The remainder of the library builds on these.

### `Iterthing`
**Signature:** `type Iterthing<T> = Iterable<T> | Iterator<T>`

The standard convenience type alias used throughout the library.

### `iterate`
**Signature:** `iterate<T>(x: Iterthing<T>): Iterator<T>`

Extract an `Iterator<T>` from an `Iterable<T>`. When given another `Iterator<T>`, directly returns this iterator.

This method is primarily used internally to normalize `Iterable`/`Iterator` use across the API.

### `iterable`
**Signature:** `iterable<T>(x: Iterthing<T>): Iterable<T>`

Extract an `Iterable<T>` from an `Iterator<T>`. When given another `Iterable<T>`, directly returns this iterable.

**Note** that, due to the nature of iterators, this iterable may be usable only once. This includes future iterables derived from the same iterator - all iterables will share one collective use.

One may use this method to integrate iterators with simpler & more standard language features, such as for loops & spread syntax (`[...iterable]`).

### `collect`
**Signature:** `collect(it: Iterthing<T>): T[]`

Collects all items returned by `it` into a standard array.

One may use this in lieu of `iterable` to produce a reusable `Iterable<T>` instead (an `Array<T>`, specifically). In fact, it is simply defined as:

```typescript
export const collect = <T>(it: Iterthing<T>) => [...iterable(it)];
```

## Auxiliary Interface
These are utility functions for more convenient use. Some are direct ports of other array functions, such as `filter`, `map`, and `forEach`. Others are useful functions which may have found their inspiration in other languages, such as Python's `zip`.

### `chain`
**Signature:** `chain<T>(...iters: Iterthing<T>[]): Generator<T>`

Chain multiple Iterthings together, yielding their individual items as though from one continuous iterator.

### `each`
**Signature:** `each<T>(it: Iterthing<T>, callback: (item: T) => void)`

Calls `callback` on each item yielded by `it`.

Unlike other functions in this library, it is not a generator and is executed wholly immediately. It is thus similar to simply calling `collect(it).forEach(callback)`, but without creating an intermediate array.

### `filter`
**Signature:** `filter<T>(it: Iterthing<T>, callback: (item: T) => boolean): Iterator<T>`

Filters items yielded by `it` through `callback`. If `callback` returns `true` for an item, this item is yielded here.

### `first`
**Signature:** `first<T>(it: Iterthing<T>): T`

Retrieves the first item yielded by the given Iterthing.

If Iterthing resembles an Iterator, `first` may be used repetitively to read the next element. If it is an Iterable, however, it will always return the first item from the collection. Specifically, applied to arrays, this is always equivalent to `array[0]`. Applied to sets, it yields an element from the set in indeterminate order. It is a convenient way to get *any* element from a set when it does not quite matter which element.

### `map`
**Signature:** `map<I, O>(it: Iterthing<I>, callback: (item: I) => O)`

Maps items yielded by `it` through `callback`. Items yielded by this generator are of type `O`.

### `last`
**Signature:** `last<T>(it: Iterthing<T>): T`

Complement of [`first`](#first), this function retrieves the last item yielded from the given Iterthing.

**Note** that when the Iterthing resembles an Iterator, the Iterator will be fully consumed and, thus, henceforth unusable/empty. Applied to an array, it is equivalent to `array[array.length-1]` - tho it performs less efficient due to its underlying use of iterators rather than random access. Thus, it has a rather niche usage.

### `pairs`
**Signature:** `pairs<T>(it: Iterthing<T>): Generator<[T, T]>`

Yields pairs of items from `it`.

**Example:**
```typescript
import { collect, pairs } from 'reiterate';

console.log(collect(pairs([1, 2, 3, 4])));
// [[1, 2], [2, 3], [3, 4]]
```

### `reduce`
**Signature:** `reduce<I, O>(it: Iterthing<T>, callback: (previous: O, current: I) => O, initial: O): O`

Like `Array.prototype.reduce`, except it takes any `Iterable<I>` or `Iterator<I>`.

Iterates over items yielded by `it` and feeds them, together with the "result" (aka. "state"), to `callback`, which then may apply arbitrary operations to compute a new "result". Its "result" is then assumed as new state for the next iteration.

**Note** that this is a function which is executed wholly immediately, not a generator or iterator which can be computed gradually.

### `repeat`
**Signature:** `repeat<T>(x: T | (() => T), n: number): Generator<T>`

Yields `x` `n` times repeatedly. If `x` is a function, invokes it each time and yields its return value instead.

**Note:** One may pass `Infinity` for `n` to create an infinite repetition generator. However, beware of infinite loops.

### `steps`
**Signature:** `steps<I, O>(it: Iterthing<I>, callback: (previous: O, current: I) => O, initial: O): Generator<O>`

Variant of [`reduce`](#reduce) yielding every intermittent state between each iteration.

In fact, `reduce` simply calls `last(steps(...))` to compute the full chain and only capture the final result.

### `zip`
**Signature:** `zip<T1, T2>(lhs: Iterthing<T1>, rhs: Iterthing<T2>): Generator<[T1, T2]>`

"Zips" two iterthings together, yielding pairs of `[T1, T2]`. If either `lhs` or `rhs` terminate early, their respective value within future pairs will simply be `undefined`.

**Example:**
```typescript
import { collect, zip } from 'reiterate';

function* genny1() {
  yield 1;
  yield 2;
  yield 3;
}

function* genny2() {
  yield 'a';
  yield 'b';
  yield 'c';
}

console.log(collect(zip(genny1(), genny2())));
// [[1, 'a'], [2, 'b'], [3, 'c']]
```
