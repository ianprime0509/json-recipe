/**
 * @file A very simple implementation of rational numbers.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */

/**
 * Computes the GCD of two numbers.
 */
function gcd(m: number, n: number): number {
  return n === 0 ? m : gcd(n, m % n);
}

/**
 * A rational number. This type is immutable; its numerator and denominator
 * cannot be changed except by making a new instance.
 *
 * TODO: figure out what to do about negative numbers.
 */
export class Fraction {
  /**
   * Converts a mixed number to an improper fraction.
   *
   * @param whole the whole number part of the number
   * @param fractional the fractional part of the number
   */
  public static fromMixedNumber(whole: number, fractional: Fraction): Fraction {
    if (!Number.isInteger(whole)) {
      throw new Error('Whole number part must be an integer.');
    }
    return new Fraction(
      whole * fractional.denominator + fractional.numerator,
      fractional.denominator,
    );
  }

  public static parse(s: string): Fraction {
    // Find the whole number part (if any).
    const wholeNumberMatches = s.match(/^\s*([1-9][0-9]*)(?!\s*\/)/);
    let wholeNumber = 0;
    if (wholeNumberMatches) {
      wholeNumber = parseInt(wholeNumberMatches[1], 10);
      s = s.substring(wholeNumberMatches.index! + wholeNumberMatches[0].length);
    }
    // Find the fractional part (if any).
    const fractionalMatches = s.match(/^\s*([1-9][0-9]*)\s*\/\s*([1-9][0-9]*)/);
    let fractionalPart = new Fraction(0, 1);
    if (fractionalMatches) {
      fractionalPart = new Fraction(
        parseInt(fractionalMatches[1], 10),
        parseInt(fractionalMatches[2], 10),
      );
      s = s.substring(fractionalMatches.index! + fractionalMatches[0].length);
    }

    if (wholeNumber === 0 && fractionalPart.numerator === 0) {
      throw new Error('No fractional number specified.');
    }
    if (s.trim().length !== 0) {
      throw new Error(`Unexpected data at end of input: '${s}'`);
    }
    return Fraction.fromMixedNumber(wholeNumber, fractionalPart);
  }

  public readonly numerator: number;
  public readonly denominator: number;

  /**
   * Constructs a new fraction. The fraction will be internally reduced to
   * lowest terms.
   *
   * @param numerator the numerator of the fraction. Must be an integer.
   * @param denominator the denominator of the fraction. Must be a non-zero
   * integer.
   */
  constructor(numerator: number, denominator: number = 1) {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
      throw new Error('Numerator and denominator must be integers.');
    }
    if (denominator === 0) {
      throw new Error('Cannot create a fraction with a denominator of zero.');
    }
    const d = gcd(numerator, denominator);
    this.numerator = numerator / d;
    this.denominator = denominator / d;
    Object.freeze(this);
  }

  /**
   * Transforms this fraction into a mixed number, consisting of a whole number
   * and a proper fractional part.
   */
  public toMixedNumber(): [number, Fraction] {
    return [
      Math.floor(this.numerator / this.denominator),
      new Fraction(this.numerator % this.denominator, this.denominator),
    ];
  }
}
