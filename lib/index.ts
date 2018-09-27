/**
 * @file The main module for the project.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import Ajv from 'ajv';

import * as schema from '../recipe.schema.json';
import { Direction, DirectionGroup } from './direction';
import { Fraction } from './fraction';
import {
  Ingredient,
  IngredientGroup,
  parseIngredientOrGroup,
} from './ingredient';
import * as schemaTypes from './schema-types';

/**
 * A complete recipe.
 */
export class Recipe {
  /**
   * Determines whether the given JSON data represents a valid recipe according
   * to the schema.
   *
   * @param data the data to validate
   */
  public static isValid(data: any): data is schemaTypes.JsonRecipe {
    return Recipe.validate(data) as boolean;
  }

  private static ajv = new Ajv();
  private static validate = Recipe.ajv.compile(schema);

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
    if (!Recipe.isValid(data)) {
      throw new Error(
        `Given data does not validate according to the schema: ${JSON.stringify(
          Recipe.validate.errors,
        )}`,
      );
    }

    this.title = data.title;
    this.ingredients = data.ingredients.map(parseIngredientOrGroup);
    this.directions = data.directions;
  }
}
