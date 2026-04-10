import type { LogType } from "logora";

import type { SerializedValue } from "./serialized-value.type";

/**
 * Represents a transport-safe serialized Logora entry.
 */
export interface SerializedLogEntry {
  /**
   * The entry timestamp as an ISO string.
   */
  timestamp: string;

  /**
   * The original log type.
   */
  type: LogType;

  /**
   * The log message.
   */
  message: string;

  /**
   * The serialized arguments attached to the log entry.
   */
  args: SerializedValue[];

  /**
   * The optional log scope.
   */
  scope?: string;
}
