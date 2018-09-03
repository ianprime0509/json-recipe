import Ajv from 'ajv';
import * as recipeSchema from '../recipe.schema.json';
import { Ingredient as JsonIngredient, JsonRecipe } from './json-recipe';

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

/**
 * A group of directions under a single heading.
 */
export interface DirectionGroup {
  /**
   * The heading describing the group.
   */
  heading: string;
  /**
   * The directions contained in the group.
   */
  directions: string[];
}

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
  public static isValid(data: any): data is JsonRecipe {
    return Recipe.validate(data) as boolean;
  }

  private static ajv = new Ajv();
  private static validate = Recipe.ajv.compile(recipeSchema);

  /**
   * The recipe's ingredients.
   */
  public ingredients: Array<Ingredient | IngredientGroup>;

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
    const parseIngredient = (ingData: JsonIngredient) => {
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
        | JsonIngredient
        | { heading: string; ingredients: JsonIngredient[] },
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
  }
}
