import { Fraction, Ingredient } from '../lib/index';

describe('parse', () => {
  it('parses ingredients with whole-number quantities', () => {
    expect(Ingredient.parse('1 cup flour')).toEqual(
      new Ingredient(1, 'cup', 'flour'),
    );
    expect(Ingredient.parse('4 cups baking soda')).toEqual(
      new Ingredient(4, 'cups', 'baking soda'),
    );
    expect(Ingredient.parse('3 teaspoons crushed red pepper')).toEqual(
      new Ingredient(3, 'teaspoons', 'crushed red pepper'),
    );
  });

  it('parses ingredients with fractional quantities', () => {
    expect(Ingredient.parse('1/2 cup oats')).toEqual(
      new Ingredient(new Fraction(1, 2), 'cup', 'oats'),
    );
    expect(Ingredient.parse('2 / 3 cup powdered sugar')).toEqual(
      new Ingredient(new Fraction(2, 3), 'cup', 'powdered sugar'),
    );
    expect(Ingredient.parse('5/6 teaspoons baking powder')).toEqual(
      new Ingredient(new Fraction(5, 6), 'teaspoons', 'baking powder'),
    );
  });

  it('parses ingredients with mixed number quantities', () => {
    expect(Ingredient.parse('1 1/2 cups oat bran')).toEqual(
      new Ingredient(new Fraction(3, 2), 'cups', 'oat bran'),
    );
    expect(Ingredient.parse('3 3 / 4 cups warm water')).toEqual(
      new Ingredient(new Fraction(15, 4), 'cups', 'warm water'),
    );
  });

  it('parses preparation instructions', () => {
    expect(Ingredient.parse('1 cup red onions, minced')).toEqual(
      new Ingredient(1, 'cup', 'red onions', ['minced']),
    );
    expect(
      Ingredient.parse('1 1/4 teaspoon red pepper, finely chopped'),
    ).toEqual(
      new Ingredient(new Fraction(5, 4), 'teaspoon', 'red pepper', [
        'finely chopped',
      ]),
    );
    expect(Ingredient.parse('1 2/3 cups potatoes, diced, peeled')).toEqual(
      new Ingredient(new Fraction(5, 3), 'cups', 'potatoes', [
        'diced',
        'peeled',
      ]),
    );
  });
});
