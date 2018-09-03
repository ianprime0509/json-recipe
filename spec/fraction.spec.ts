import { Fraction } from '../lib/fraction';

describe('constructor', () => {
  it('constructs a fraction in lowest terms', () => {
    expect(new Fraction(2, 3)).toEqual(new Fraction(2, 3));
    expect(new Fraction(6, 8)).toEqual(new Fraction(3, 4));
    expect(new Fraction(2, 5)).not.toEqual(new Fraction(1, 4));
  });
});

describe('fromMixedNumber', () => {
  it('correctly constructs a fraction from a mixed number', () => {
    expect(Fraction.fromMixedNumber(1, new Fraction(1, 3))).toEqual(
      new Fraction(4, 3),
    );
    expect(Fraction.fromMixedNumber(0, new Fraction(5, 6))).toEqual(
      new Fraction(5, 6),
    );
    expect(Fraction.fromMixedNumber(4, new Fraction(2, 3))).toEqual(
      new Fraction(14, 3),
    );
  });
});

describe('toMixedNumber', () => {
  it('correctly converts an improper fraction into a mixed number', () => {
    expect(new Fraction(3, 4).toMixedNumber()).toEqual([0, new Fraction(3, 4)]);
    expect(new Fraction(3, 2).toMixedNumber()).toEqual([1, new Fraction(1, 2)]);
    expect(new Fraction(15, 4).toMixedNumber()).toEqual([
      3,
      new Fraction(3, 4),
    ]);
  });
});
