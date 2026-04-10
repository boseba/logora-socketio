import type { SerializedError } from "./serialized-error.interface";
import type { SerializedSpecialValue } from "./serialized-special-value.interface";

/**
 * Represents every value shape accepted by the Socket.IO serializer.
 */
export type SerializedValue =
  | string
  | number
  | boolean
  | null
  | SerializedError
  | SerializedSpecialValue
  | SerializedValue[]
  | { [key: string]: SerializedValue };
