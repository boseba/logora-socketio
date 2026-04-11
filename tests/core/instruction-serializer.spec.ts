import { LogType } from "logora";
import type { LogEntry } from "logora/module";
import { describe, expect, it } from "vitest";

import { DefaultSocketIoInstructionSerializer } from "../../src/core/instruction-serializer";

describe("DefaultSocketIoInstructionSerializer", () => {
  it("should serialize a log entry", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    const entry: LogEntry = {
      timestamp: new Date("2026-04-11T12:34:56.000Z"),
      type: LogType.Warning,
      message: "Disk almost full",
      args: ["drive-c", 92],
      scope: "Storage",
    };

    expect(serializer.serializeLogEntry(entry)).toEqual({
      timestamp: "2026-04-11T12:34:56.000Z",
      type: LogType.Warning,
      typeName: "Warning",
      message: "Disk almost full",
      args: ["drive-c", "92"],
      scope: "Storage",
    });
  });

  it("should serialize a string argument", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeArg("hello")).toBe("hello");
  });

  it("should serialize a number argument", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeArg(42)).toBe("42");
  });

  it("should serialize a boolean argument", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeArg(true)).toBe("true");
  });

  it("should serialize undefined", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeArg(undefined)).toBe("undefined");
  });

  it("should serialize null", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeArg(null)).toBe("null");
  });

  it("should serialize a Date instance", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeArg(new Date("2026-04-11T13:00:00.000Z"))).toBe(
      "2026-04-11T13:00:00.000Z",
    );
  });

  it("should serialize a function using its name", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    function namedHandler(): void {
      return;
    }

    expect(serializer.serializeArg(namedHandler)).toBe("namedHandler");
  });

  it("should serialize a symbol", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeArg(Symbol("token"))).toBe("Symbol(token)");
  });

  it("should serialize an error using its stack when available", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();
    const error = new Error("Something failed");
    error.stack = "stack trace";

    expect(serializer.serializeArg(error)).toBe("stack trace");
  });

  it("should serialize an error using its message when stack is missing", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();
    const error = new Error("Something failed");
    error.stack = "";

    expect(serializer.serializeArg(error)).toBe("Something failed");
  });

  it("should serialize plain objects using JSON", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(
      serializer.serializeArg({
        message: "ok",
        nested: {
          count: 2,
        },
      }),
    ).toBe('{"message":"ok","nested":{"count":2}}');
  });

  it("should return a fallback string when an object cannot be serialized", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    const value: Record<string, unknown> = {};
    value.self = value;

    expect(serializer.serializeArg(value)).toBe("[Unserializable Object]");
  });
});
