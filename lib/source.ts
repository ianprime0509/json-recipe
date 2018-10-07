/**
 * @file Everything related to a recipe's source.
 * @author Ian Johnson
 * @copyright 2018 Ian Johnson
 * @license MIT
 */
import { Source as SchemaSource } from 'jsonrecipe-schema';

/**
 * The location of a resource accessible on the web.
 */
export interface WebLocation {
  /**
   * The URL of the resource.
   */
  url: string;
  /**
   * The date on which information was most recently retrieved from the URL.
   */
  retrievalDate?: Date;
}

/**
 * The source of a recipe.
 */
export class Source {
  /**
   * Parses a source from a schema object, which consists of an author and an
   * optional location.
   *
   * @param obj the schema object to parse
   */
  public static parseSchemaObject(obj: SchemaSource): Source {
    const location: WebLocation | undefined = obj.location
      ? {
          retrievalDate: obj.location.retrievalDate
            ? new Date(Date.parse(obj.location.retrievalDate))
            : undefined,
          url: obj.location.url,
        }
      : undefined;
    return new Source(obj.author, location);
  }

  /**
   * The full name of the author of the recipe.
   */
  public author: string;
  /**
   * The location where the recipe can be found.
   */
  public location?: WebLocation;

  constructor(author: string, location?: WebLocation) {
    this.author = author;
    this.location = location;
  }
}
