/**
 * @file Everything related to preparation directions.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */

/**
 * A single preparation direction.
 */
export type Direction = string;

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
