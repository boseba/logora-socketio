/**
 * Represents a serialized Error instance.
 */
export interface SerializedError {
  /**
   * The serialized value discriminator.
   */
  kind: "error";

  /**
   * The error name.
   */
  name: string;

  /**
   * The error message.
   */
  message: string;

  /**
   * The error stack, when available.
   */
  stack?: string;
}
