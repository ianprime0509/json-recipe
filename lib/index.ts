/**
 * @file The main module for the project.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { validate } from 'jsonrecipe-schema';

import { Direction, DirectionGroup, parseDirectionOrGroup } from './direction';
import { Fraction } from './fraction';
import {
  Ingredient,
  IngredientGroup,
  parseIngredientOrGroup,
} from './ingredient';
import { Source, WebLocation } from './source';

export {
  Direction,
  DirectionGroup,
  Fraction,
  Ingredient,
  IngredientGroup,
  Source,
  WebLocation,
};

/**
 * A complete recipe.
 */
export class Recipe {
  /**
   * Constructs a new recipe from the given JSON data. The data must be valid
   * according to the recipe schema version corresponding to the version of
   * this module.
   *
   * @param data the JSON recipe data
   */
  public static parse(data: any): Recipe {
    const errors = validate(data);
    if (errors.length !== 0) {
      throw new Error(
        `Given data does not validate according to the schema: ${errors.join(
          ', ',
        )}`,
      );
    }

    return new Recipe(
      data.title,
      Source.parseSchemaObject(data.source),
      data.ingredients.map(parseIngredientOrGroup),
      data.directions.map(parseDirectionOrGroup),
    );
  }

  /**
   * The title of the recipe.
   */
  public title: string;
  /**
   * The origin of the recipe, including information about its author.
   */
  public source: Source;
  /**
   * The recipe's ingredients.
   */
  public ingredients: Array<Ingredient | IngredientGroup>;
  /**
   * The recipe's directions.
   */
  public directions: Array<Direction | DirectionGroup>;

  constructor(
    title: string,
    source: Source,
    ingredients: Array<Ingredient | IngredientGroup>,
    directions: Array<Direction | DirectionGroup>,
  ) {
    this.title = title;
    this.source = source;
    this.ingredients = ingredients;
    this.directions = directions;
  }
}
