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
import { Ingredient, IngredientGroup } from './ingredient';
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

    // Parse the ingredients.
    const parseIngredient = (ingData: schemaTypes.Ingredient) => {
      if (typeof ingData === 'string') {
        return Ingredient.parse(ingData);
      } else {
        const quantity =
          typeof ingData.quantity === 'string'
            ? Fraction.parse(ingData.quantity)
            : new Fraction(ingData.quantity);
        const preparation =
          typeof ingData.preparation === 'string'
            ? [ingData.preparation]
            : ingData.preparation;
        return new Ingredient(
          quantity,
          ingData.unit,
          ingData.item,
          preparation,
        );
      }
    };
    const parseIngredientOrGroup = (
      ingData:
        | schemaTypes.Ingredient
        | { heading: string; ingredients: schemaTypes.Ingredient[] },
    ) => {
      if (typeof ingData === 'object' && 'heading' in ingData) {
        return {
          heading: ingData.heading,
          ingredients: ingData.ingredients.map(parseIngredient),
        };
      } else {
        return parseIngredient(ingData);
      }
    };
    this.ingredients = data.ingredients.map(parseIngredientOrGroup);

    this.directions = data.directions;
  }
}
