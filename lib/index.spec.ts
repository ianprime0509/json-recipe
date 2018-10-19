/**
 * @file tests for the Recipe class
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { expect } from 'chai';
import 'mocha';

import { Direction, Fraction, Ingredient, Recipe, Source } from './index';

import germanPotatoSalad from 'jsonrecipe-schema/examples/valid/german-potato-salad.json';

describe('Recipe', () => {
  describe('constructor', () => {
    it('constructs a Recipe object from valid recipe data', () => {
      const expected = new Recipe(
        'Authentic German potato salad',
        new Source('Angela Louise Miller', {
          retrievalDate: '2018-08-11',
          url:
            'https://www.allrecipes.com/recipe/83097/authentic-german-potato-salad/',
        }),
        [
          new Ingredient(3, 'cups', 'potatoes', ['diced', 'peeled']),
          new Ingredient(4, 'slices', 'bacon'),
          new Ingredient(1, 'each', 'small onion', ['diced']),
          new Ingredient(new Fraction(1, 4), 'cup', 'white vinegar'),
          new Ingredient(2, 'tablespoons', 'water'),
          new Ingredient(3, 'tablespoons', 'white sugar'),
          new Ingredient(1, 'teaspoon', 'salt'),
          new Ingredient(new Fraction(1, 8), 'teaspoon', 'black pepper', [
            'ground',
          ]),
          new Ingredient(1, 'tablespoon', 'fresh parsley', ['chopped']),
        ],
        [
          new Direction(
            'Place the potatoes into a pot, and fill with enough water to cover. Bring to a boil, and cook for about 10 minutes, or until easily pierced with a fork. Drain, and set aside to cool.',
          ),
          new Direction(
            'Place the bacon in a large deep skillet over medium-high heat. Fry until browned and crisp, turning as needed. Remove from the pan and set aside.',
          ),
          new Direction(
            'Add onion to the bacon grease, and cook over medium heat until browned. Add the vinegar, water, sugar, salt and pepper to the pan. Bring to a boil, then add the potatoes and parsley. Crumble in half of the bacon. Heat through, then transfer to a serving dish. Crumble the remaining bacon over the top, and serve warm.',
          ),
        ],
      );

      expect(Recipe.parse(germanPotatoSalad)).to.deep.equal(expected);
    });
  });
});
