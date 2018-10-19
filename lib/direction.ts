/**
 * @file Everything related to preparation directions.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import * as schema from 'jsonrecipe-schema';

/**
 * A single preparation direction.
 */
export class Direction {
  /**
   * Parses a direction from a schema object.
   */
  public static parseSchemaObject(direction: schema.Direction): Direction {
    return new Direction(direction);
  }

  /**
   * The text of the direction.
   */
  public text: string;

  constructor(text: string) {
    this.text = text;
  }
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
  directions: Direction[];
}

export function parseDirectionOrGroup(
  obj: schema.Direction | schema.DirectionGroup,
): Direction | DirectionGroup {
  if (typeof obj === 'object' && 'heading' in obj) {
    return {
      directions: obj.directions.map(Direction.parseSchemaObject),
      heading: obj.heading,
    };
  } else {
    return Direction.parseSchemaObject(obj);
  }
}
