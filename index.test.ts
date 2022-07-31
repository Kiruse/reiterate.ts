import { expect } from 'chai';
import { iterate, iterable, collect } from './index';

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
