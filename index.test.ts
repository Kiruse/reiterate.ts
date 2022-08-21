import { expect } from 'chai';
import { iterate, iterable, collect, zip, each, filter, map, pairs, repeat, reduce, first, last, steps, chain } from './index';

describe('core interface', () => {
  describe('iterate', () => {
    it('should iterate iterables', () => {
      const it = iterate([1, 2, 3]);
      expect(it.next().value).to.equal(1);
      expect(it.next().value).to.equal(2);
      expect(it.next().value).to.equal(3);
    });
    
    it('should iterate iterators', () => {
      function* genny() {
        yield 1; yield 2; yield 3;
      }
      const it = iterate(genny());
      expect(it.next().value).to.equal(1);
      expect(it.next().value).to.equal(2);
      expect(it.next().value).to.equal(3);
    });
  });

  describe('iterable', () => {
    it('should return iterables', () => {
      const ary = [1, 2, 3];
      expect(iterable(ary)).to.equal(ary);
      
      const set = new Set([1, 2, 3, 1]);
      expect(iterable(set)).to.equal(set);
    });
    
    it('should return one-time usable iterables', () => {
      function* genny() {
        yield 1; yield 2; yield 3;
      }
      const iter = genny();
      expect([...iterable(iter)]).to.deep.equal([1, 2, 3]);
      expect([...iterable(iter)]).to.deep.equal([]);
    });
  });
  
  describe('collect', () => {
    it('should collect all items', () => {
      function* genny() {
        yield 1; yield 2; yield 3;
      }
      expect(collect(genny())).to.deep.equal([1, 2, 3]);
    });
  });
});

describe('auxiliary interface', () => {
  describe('chain', () => {
    expect(collect(chain([1, 2, 3], [4, 5, 6], [7, 8, 9])))
      .to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  
  describe('each', () => {
    it('should invoke callback', () => {
      let counter = 0;
      function callback(item: number) {
        counter++;
      }
      
      each([1, 2, 3], callback);
      expect(counter).to.equal(3);
    });
  });
  
  describe('filter', () => {
    it('should filter even', () => {
      expect(collect(filter([1, 2, 3, 4], i => i % 2 === 0)))
        .to.deep.equal([2, 4]);
    });
    
    it('should filter odd', () => {
      expect(collect(filter([1, 2, 3, 4], i => i % 2 === 1)))
        .to.deep.equal([1, 3]);
    });
  });
  
  describe('first', () => {
    it('should support iterables', () => {
      const ary = [1, 2, 3];
      expect(first(ary)).to.equal(1);
      expect(first(ary)).to.equal(1);
    });
    
    it('should support iterators', () => {
      function* genny() {
        yield 1; yield 2; yield 3;
      }
      const iter = genny();
      expect(first(iter)).to.equal(1);
      expect(first(iter)).to.equal(2);
      expect(first(iter)).to.equal(3);
      expect(() => first(iter)).to.throw(/^empty iterthing$/i);
    });
  });
  
  describe('map', () => {
    it('should map', () => {
      expect(collect(map([1, 2, 3], i => i + 2)))
        .to.deep.equal([3, 4, 5]);
    });
  });
  
  describe('last', () => {
    it('should support arrays', () => {
      expect(last([1, 2, 3])).to.equal(3);
      expect(last([1, 2, 3])).to.equal(3);
    });
    
    it('should support sets', () => {
      expect(last(new Set([1, 2, 3]))).to.be.a('number');
    });
    
    it('should support iterators', () => {
      function* genny() {
        yield 1; yield 2; yield 3;
      }
      const iter = genny();
      expect(last(iter)).to.equal(3);
      expect(() => last(iter)).to.throw(/^empty iterthing$/);
    });
  });
  
  describe('pairs', () => {
    it('should terminate immediately', () => {
      expect(collect(pairs([1]))).to.deep.equal([]);
    });
    
    it('should yield one pair', () => {
      expect(collect(pairs([1, 2]))).to.deep.equal([[1, 2]]);
    });
    
    it('should yield pairs', () => {
      expect(collect(pairs([1, 2, 3, 4])))
        .to.deep.equal([[1, 2], [2, 3], [3, 4]]);
    });
  });
  
  describe('reduce', () => {
    it('should support iterators', () => {
      function* genny() {
        yield 1; yield 2; yield 3;
      }
      expect(reduce(genny(), (prev, curr) => prev + curr, 0)).to.equal(6);
    });
    
    it('should support iterables', () => {
      expect(reduce([1, 2, 3], (prev, curr) => prev + curr, 0)).to.equal(6);
    });
  });
  
  describe('repeat', () => {
    it('should repeat values', () => {
      expect(collect(repeat(42, 3)))
        .to.deep.equal([42, 42, 42]);
      
      expect(collect(repeat(0, 40)).join(''))
        .to.equal('0000000000000000000000000000000000000000');
    });
    
    it('should repeat return values', () => {
      const callback = () => 42;
      expect(collect(repeat(callback, 3)))
        .to.deep.equal([42, 42, 42]);
    });
  });
  
  describe('steps', () => {
    it('should work', () => {
      function* genny() {
        yield 1; yield 2; yield 3;
      }
      const iter = steps(genny(), (prev, curr) => prev + curr, 0);
      expect(iter.next().value).to.equal(1);
      expect(iter.next().value).to.equal(3);
      expect(iter.next().value).to.equal(6);
    });
  });
  
  describe('zip', () => {
    function* genny() {
      yield 1; yield 2; yield 3;
    }
    expect(collect(zip(genny(), ['a', 'b', 'c']))).to.deep.equal([
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ]);
  });
});
