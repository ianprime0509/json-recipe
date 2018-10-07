/**
 * @file The main module for the project.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { validate } from 'jsonrecipe-schema';

import { Direction, DirectionGroup } from './direction';
import {
  Ingredient,
  IngredientGroup,
  parseIngredientOrGroup,
} from './ingredient';

/**
 * A complete recipe.
 */
export class Recipe {
  /**
   * The title of the recipe.
   */
  public title: string;
  /**
   * The recipe's ingredients.
   */
  public ingredients: Array<Ingredient | IngredientGroup>;
  /**
   * The recipe's directions.
   */
  public directions: Array<Direction | DirectionGroup>;

  /**
   * Constructs a new recipe from the given JSON data. The data must be valid
   * according to the recipe schema version corresponding to the version of
   * this module.
   *
   * @param data the JSON recipe data
   */
  constructor(data: any) {
    const errors = validate(data);
    if (errors.length !== 0) {
      throw new Error(
        `Given data does not validate according to the schema: ${errors.join(
          ', ',
        )}`,
      );
    }

    this.title = data.title;
    this.ingredients = data.ingredients.map(parseIngredientOrGroup);
    this.directions = data.directions;
  }
}
