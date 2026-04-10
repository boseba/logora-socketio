import type { LogEntry } from "logora/module";

import type { SerializedError } from "../models/serialized-error.interface";
import type { SerializedLogEntry } from "../models/serialized-log-entry.interface";
import type { SerializedSpecialValue } from "../models/serialized-special-value.interface";
import type { SerializedValue } from "../models/serialized-value.type";
import type { SocketIoInstructionSerializer } from "../models/socket-io-instruction-serializer.interface";

/**
 * Default serializer used by the Socket.IO output.
 *
 * It converts log entries and runtime values into transport-safe payloads
 * while preserving useful debugging information for special values.
 */
export class DefaultSocketIoInstructionSerializer implements SocketIoInstructionSerializer {
  /**
   * Serializes a Logora log entry into a transport-safe structure.
   *
   * @param entry The log entry to serialize.
   * @returns A serialized log entry.
   */
  public serializeLogEntry(entry: LogEntry): SerializedLogEntry {
    return {
      timestamp: entry.timestamp.toISOString(),
      type: entry.type,
      message: entry.message,
      args: entry.args.map(
        (arg: unknown): SerializedValue => this.serializeValue(arg),
      ),
      scope: entry.scope || undefined,
    };
  }

  /**
   * Serializes an arbitrary runtime value into a transport-safe payload.
   *
   * @param value The value to serialize.
   * @returns A serialized value.
   */
  public serializeValue(value: unknown): SerializedValue {
    return this._serializeValue(value, new WeakSet<object>());
  }

  /**
   * Serializes a runtime value while tracking visited objects to detect
   * circular references.
   *
   * @param value The value to serialize.
   * @param seen The visited object registry.
   * @returns A serialized value.
   */
  private _serializeValue(
    value: unknown,
    seen: WeakSet<object>,
  ): SerializedValue {
    if (value === null) {
      return null;
    }

    switch (typeof value) {
      case "string":
      case "number":
      case "boolean":
        return value;

      case "undefined":
        return this._serializeSpecialValue("undefined", "undefined");

      case "symbol":
        return this._serializeSpecialValue("symbol", value.toString());

      case "function":
        return this._serializeSpecialValue(
          "function",
          value.name || "[anonymous]",
        );

      case "object":
        break;
    }

    if (value instanceof Error) {
      return this._serializeError(value);
    }

    if (value instanceof Date) {
      return this._serializeSpecialValue("date", value.toISOString());
    }

    if (Array.isArray(value)) {
      return this._serializeArray(value, seen);
    }

    return this._serializeObject(value as Record<string, unknown>, seen);
  }

  /**
   * Serializes an array.
   *
   * @param values The array values to serialize.
   * @param seen The visited object registry.
   * @returns A serialized array.
   */
  private _serializeArray(
    values: unknown[],
    seen: WeakSet<object>,
  ): SerializedValue[] {
    if (seen.has(values)) {
      return [this._serializeSpecialValue("circular", "[Circular Array]")];
    }

    seen.add(values);

    return values.map(
      (value: unknown): SerializedValue => this._serializeValue(value, seen),
    );
  }

  /**
   * Serializes a plain object.
   *
   * @param value The object to serialize.
   * @param seen The visited object registry.
   * @returns A serialized object.
   */
  private _serializeObject(
    value: Record<string, unknown>,
    seen: WeakSet<object>,
  ): Record<string, SerializedValue> {
    if (seen.has(value)) {
      return {
        value: this._serializeSpecialValue("circular", "[Circular Object]"),
      };
    }

    seen.add(value);

    const result: Record<string, SerializedValue> = {};

    for (const [key, entryValue] of Object.entries(value)) {
      result[key] = this._serializeValue(entryValue, seen);
    }

    return result;
  }

  /**
   * Serializes an Error instance.
   *
   * @param error The error to serialize.
   * @returns A serialized error payload.
   */
  private _serializeError(error: Error): SerializedError {
    return {
      kind: "error",
      name: error.name,
      message: error.message,
      stack: error.stack || undefined,
    };
  }

  /**
   * Creates a serialized special value payload.
   *
   * @param type The special value type.
   * @param value The associated string representation.
   * @returns A serialized special value payload.
   */
  private _serializeSpecialValue(
    type: SerializedSpecialValue["type"],
    value: string,
  ): SerializedSpecialValue {
    return {
      kind: "special",
      type,
      value,
    };
  }
}
