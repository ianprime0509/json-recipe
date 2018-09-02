/**
 * A rational number. This type is immutable; its numerator and denominator
 * cannot be changed except by making a new instance.
 */
class Fraction {
  private static gcd(m: number, n: number): number {
    return m === 0 ? n : Fraction.gcd(n, m % n);
  }

  private readonly _numerator: number;
  private readonly _denominator: number;

  /**
   * Constructs a new fraction. The fraction will be internally reduced to
   * lowest terms.
   *
   * @param numerator the numerator of the fraction
   * @param denominator the denominator of the fraction. Must not be zero.
   */
  constructor(numerator: number, denominator: number) {
    if (denominator === 0) {
      throw new Error('Cannot create a fraction with a denominator of zero.');
    }
    const d = Fraction.gcd(numerator, denominator);
    this._numerator = numerator / d;
    this._denominator = denominator / d;
  }

  get numerator(): number {
    return this._numerator;
  }

  get denominator(): number {
    return this._denominator;
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
interface Ingredient {
  /**
   * The quantity of the ingredient, relative to the unit.
   */
  quantity: Fraction;
  /**
   * The unit in which the quantity is measured.
   */
  unit: string;
  /**
   * The item of which the ingredient consists (e.g. 'tomato').
   */
  item: string;
  /**
   * Any preparation instructions for the ingredient (e.g. 'chopped').
   */
  preparation?: string[];
}

/**
 * A group of ingredients under a single heading.
 */
interface IngredientGroup {
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
interface DirectionGroup {
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
class Recipe {
  /**
   * The recipe's ingredients.
   */
  public ingredients: Array<Ingredient | IngredientGroup>;

  /**
   * Constructs a new recipe from the given JSON data. The data must be valid
   * according to the recipe schema version corresponding to the version of
   * this module.
   *
   * @param data the pre-parsed JSON recipe data
   */
  constructor(data: {}) {
    // TODO: fill this implementation in.
    this.ingredients = [];
  }
}
