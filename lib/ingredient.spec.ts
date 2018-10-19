/**
 * @file tests for the Ingredient class
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { expect } from 'chai';
import 'mocha';

import { Fraction } from './fraction';
import { Ingredient } from './ingredient';

describe('parse', () => {
  it('parses ingredients with whole-number quantities', () => {
    expect(Ingredient.parse('1 cup flour')).to.deep.equal(
      new Ingredient(1, 'cup', 'flour'),
    );

    expect(Ingredient.parse('4 cups baking soda')).to.deep.equal(
      new Ingredient(4, 'cups', 'baking soda'),
    );

    expect(Ingredient.parse('3 teaspoons crushed red pepper')).to.deep.equal(
      new Ingredient(3, 'teaspoons', 'crushed red pepper'),
    );
  });

  it('parses ingredients with fractional quantities', () => {
    expect(Ingredient.parse('1/2 cup oats')).to.deep.equal(
      new Ingredient(new Fraction(1, 2), 'cup', 'oats'),
    );

    expect(Ingredient.parse('2 / 3 cup powdered sugar')).to.deep.equal(
      new Ingredient(new Fraction(2, 3), 'cup', 'powdered sugar'),
    );

    expect(Ingredient.parse('5/6 teaspoons baking powder')).to.deep.equal(
      new Ingredient(new Fraction(5, 6), 'teaspoons', 'baking powder'),
    );
  });

  it('parses ingredients with mixed number quantities', () => {
    expect(Ingredient.parse('1 1/2 cups oat bran')).to.deep.equal(
      new Ingredient(new Fraction(3, 2), 'cups', 'oat bran'),
    );

    expect(Ingredient.parse('3 3 / 4 cups warm water')).to.deep.equal(
      new Ingredient(new Fraction(15, 4), 'cups', 'warm water'),
    );
  });

  it('parses ingredients with a single preparation instruction', () => {
    expect(Ingredient.parse('1 cup red onions, minced')).to.deep.equal(
      new Ingredient(1, 'cup', 'red onions', ['minced']),
    );

    expect(
      Ingredient.parse('1 1/4 teaspoon red pepper, finely chopped'),
    ).to.deep.equal(
      new Ingredient(new Fraction(5, 4), 'teaspoon', 'red pepper', [
        'finely chopped',
      ]),
    );
  });

  it('parses ingredients with multiple preparation instructions', () => {
    expect(
      Ingredient.parse('1 2/3 cups potatoes, diced, peeled'),
    ).to.deep.equal(
      new Ingredient(new Fraction(5, 3), 'cups', 'potatoes', [
        'diced',
        'peeled',
      ]),
    );
  });
});
