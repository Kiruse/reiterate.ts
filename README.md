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

# Documentation
***TODO***, sorry. The library is still in development.
