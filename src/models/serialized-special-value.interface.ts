/**
 * Represents a serialized special runtime value that cannot be transported
 * safely as-is through a plain structured payload.
 */
export interface SerializedSpecialValue {
  /**
   * The serialized value discriminator.
   */
  kind: "special";

  /**
   * The special value type.
   */
  type: "bigint" | "symbol" | "function" | "undefined" | "circular" | "date";

  /**
   * The string representation associated with the special value.
   */
  value: string;
}
