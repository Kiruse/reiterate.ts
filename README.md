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
    - [`each`](#each)
    - [`filter`](#filter)
    - [`map`](#map)
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

### `each`
**Signature:** `each<T>(it: Iterthing<T>, callback: (item: T) => void)`

Calls `callback` on each item yielded by `it`.

Unlike other functions in this library, it is not a generator and is executed wholly immediately. It is thus similar to simply calling `collect(it).forEach(callback)`, but without creating an intermediate array.

### `filter`
**Signature:** `filter<T>(it: Iterthing<T>, callback: (item: T) => boolean)`

Filters items yielded by `it` through `callback`. If `callback` returns `true` for an item, this item is yielded here.

### `map`
**Signature:** `map<I, O>(it: Iterthing<I>, callback: (item: I) => O)`

Maps items yielded by `it` through `callback`. Items yielded by this generator are of type `O`.

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
