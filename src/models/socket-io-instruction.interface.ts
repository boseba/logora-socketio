import type { SerializedLogEntry } from "./serialized-log-entry.interface";
import type { SerializedValue } from "./serialized-value.type";

/**
 * Represents a structured log instruction.
 */
export interface SocketIoLogInstruction {
  /**
   * The instruction discriminator.
   */
  kind: "log";

  /**
   * The serialized log entry.
   */
  entry: SerializedLogEntry;
}

/**
 * Represents a structured print instruction.
 */
export interface SocketIoPrintInstruction {
  /**
   * The instruction discriminator.
   */
  kind: "print";

  /**
   * The raw message.
   */
  message: string;

  /**
   * The serialized print arguments.
   */
  args: SerializedValue[];
}

/**
 * Represents a structured title instruction.
 */
export interface SocketIoTitleInstruction {
  /**
   * The instruction discriminator.
   */
  kind: "title";

  /**
   * The title content.
   */
  title: string;
}

/**
 * Represents a structured empty-line instruction.
 */
export interface SocketIoEmptyInstruction {
  /**
   * The instruction discriminator.
   */
  kind: "empty";

  /**
   * The number of empty lines requested.
   */
  count: number;
}

/**
 * Represents every instruction that can be emitted by the Socket.IO output.
 */
export type SocketIoInstruction =
  | SocketIoLogInstruction
  | SocketIoPrintInstruction
  | SocketIoTitleInstruction
  | SocketIoEmptyInstruction;
