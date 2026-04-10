import type { LogEntry } from "logora/module";

import type { SerializedLogEntry } from "./serialized-log-entry.interface";
import type { SerializedValue } from "./serialized-value.type";

/**
 * Defines the contract used to serialize Logora entries and values
 * into transport-safe Socket.IO payloads.
 */
export interface SocketIoInstructionSerializer {
  /**
   * Serializes a Logora log entry.
   *
   * @param entry The log entry to serialize.
   * @returns A transport-safe serialized log entry.
   */
  serializeLogEntry(entry: LogEntry): SerializedLogEntry;

  /**
   * Serializes an arbitrary runtime value.
   *
   * @param value The value to serialize.
   * @returns A transport-safe serialized value.
   */
  serializeValue(value: unknown): SerializedValue;
}
