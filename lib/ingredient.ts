/**
 * @file Everything related to ingredients.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import {
  Ingredient as SchemaIngredient,
  IngredientGroup as SchemaIngredientGroup,
} from 'jsonrecipe-schema';

import { Fraction } from './fraction';

/**
 * A single ingredient in a recipe.
 */
export class Ingredient {
  /**
   * Parses an ingredient from a human-readable description.
   *
   * The description format consists of four parts, one of which is optional:
   *
   * 1. The quantity, as a fractional string. The quantity must have a
   *    whole-number part, a fractional part or both.
   * 2. The unit. This must be specified; use 'each' to indicate that the
   *    natural "counting" unit should be used.
   * 3. The item (e.g. flour). The item name must not contain a comma, since
   *    this is used to denote the start of the preparation instructions.
   * 4. Preparation instructions (optional). These are given as a
   *    comma-separated list, beginning with a comma after the material.
   *
   * @param description the human-readable string form of this ingredient
   */
  public static parse(description: string): Ingredient {
    // Find the whole number part (if any).
    const wholeNumberMatches = description.match(/^\s*([1-9][0-9]*)(?!\s*\/)/);
    let wholeNumber = 0;
    if (wholeNumberMatches) {
      wholeNumber = parseInt(wholeNumberMatches[1], 10);
      description = description.substring(
        wholeNumberMatches.index! + wholeNumberMatches[0].length,
      );
    }
    // Find the fractional part (if any).
    const fractionalMatches = description.match(
      /^\s*([1-9][0-9]*)\s*\/\s*([1-9][0-9]*)/,
    );
    let fractionalPart = new Fraction(0, 1);
    if (fractionalMatches) {
      fractionalPart = new Fraction(
        parseInt(fractionalMatches[1], 10),
        parseInt(fractionalMatches[2], 10),
      );
      description = description.substring(
        fractionalMatches.index! + fractionalMatches[0].length,
      );
    }

    if (wholeNumber === 0 && fractionalPart.numerator === 0) {
      throw new Error('Quantity not specified.');
    }
    const quantity = Fraction.fromMixedNumber(wholeNumber, fractionalPart);

    // Find the unit.
    const unitMatches = description.match(/^\s*(\S+)/);
    if (!unitMatches) {
      throw new Error('Unit not specified.');
    }
    const unit = unitMatches[1].trim();
    description = description.substring(
      unitMatches.index! + unitMatches[0].length,
    );

    // Find the item.
    const itemMatches = description.match(/^\s*([^,]+)/);
    if (!itemMatches) {
      throw new Error('Item not specified.');
    }
    const item = itemMatches[1].trim();
    description = description.substring(
      itemMatches.index! + itemMatches[0].length,
    );

    // Find the preparation instructions, if any.
    const preparation: string[] = [];
    let preparationMatches: RegExpMatchArray | null;
    while ((preparationMatches = description.match(/^\s*,\s*([^,]+)/))) {
      preparation.push(preparationMatches[1].trim());
      description = description.substring(
        preparationMatches.index! + preparationMatches[0].length,
      );
    }

    return new Ingredient(quantity, unit, item, preparation);
  }

  /**
   * Parses an ingredient from a schema object, which may either be a string in
   * the human-readable format described in {@link Ingredient#parse} or an
   * object with the keys `quantity` and `item` (and optionally `unit` and
   * `preparation`).
   *
   * If the object does not contain the `unit` property, the default unit is
   * 'each'.
   *
   * @param obj the schema object to parse
   */
  public static parseSchemaObject(obj: SchemaIngredient): Ingredient {
    if (typeof obj === 'string') {
      return Ingredient.parse(obj);
    } else {
      const quantity =
        typeof obj.quantity === 'string'
          ? Fraction.parse(obj.quantity)
          : new Fraction(obj.quantity);
      const unit = obj.unit || 'each';
      const preparation =
        typeof obj.preparation === 'string'
          ? [obj.preparation]
          : obj.preparation;
      return new Ingredient(quantity, unit, obj.item, preparation);
    }
  }

  /**
   * The quantity of the ingredient, relative to the unit.
   */
  public quantity: Fraction;
  /**
   * The unit in which the quantity is measured.
   */
  public unit: string;
  /**
   * The item of which the ingredient consists (e.g. 'tomato').
   */
  public item: string;
  /**
   * Any preparation instructions for the ingredient (e.g. 'chopped').
   */
  public preparation: string[];

  constructor(
    quantity: Fraction | number,
    unit: string,
    item: string,
    preparation: string[] = [],
  ) {
    if (typeof quantity === 'number') {
      quantity = new Fraction(quantity);
    }
    this.quantity = quantity;
    this.unit = unit;
    this.item = item;
    this.preparation = preparation;
  }
}

/**
 * A group of ingredients under a single heading.
 */
export interface IngredientGroup {
  /**
   * The heading describing the group.
   */
  heading: string;
  /**
   * The ingredients contained in the group.
   */
  ingredients: Ingredient[];
}

/**
 * Parses a schema object which may be either a single ingredient or an
 * ingredient group.
 *
 * @param obj the object to parse
 */
export function parseIngredientOrGroup(
  obj: SchemaIngredient | SchemaIngredientGroup,
): Ingredient | IngredientGroup {
  if (typeof obj === 'object' && 'heading' in obj) {
    return {
      heading: obj.heading,
      ingredients: obj.ingredients.map(Ingredient.parseSchemaObject),
    };
  } else {
    return Ingredient.parseSchemaObject(obj);
  }
}
