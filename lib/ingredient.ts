/**
 * @file Everything related to ingredients.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
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
