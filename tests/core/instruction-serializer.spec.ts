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
      message: "Disk almost full",
      args: ["drive-c", 92],
      scope: "Storage",
    });
  });

  it("should serialize an Error instance", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();
    const error = new Error("Something failed");
    error.name = "CustomError";
    error.stack = "stack trace";

    expect(serializer.serializeValue(error)).toEqual({
      kind: "error",
      name: "CustomError",
      message: "Something failed",
      stack: "stack trace",
    });
  });

  it("should serialize a Date instance", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();
    const value = new Date("2026-04-11T13:00:00.000Z");

    expect(serializer.serializeValue(value)).toEqual({
      kind: "special",
      type: "date",
      value: "2026-04-11T13:00:00.000Z",
    });
  });

  it("should serialize undefined", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeValue(undefined)).toEqual({
      kind: "special",
      type: "undefined",
      value: "undefined",
    });
  });

  it("should serialize symbol values", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(serializer.serializeValue(Symbol("token"))).toEqual({
      kind: "special",
      type: "symbol",
      value: "Symbol(token)",
    });
  });

  it("should serialize function values", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    function namedHandler(): void {
      return;
    }

    expect(serializer.serializeValue(namedHandler)).toEqual({
      kind: "special",
      type: "function",
      value: "namedHandler",
    });
  });

  it("should serialize arrays recursively", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(
      serializer.serializeValue([
        "value",
        new Date("2026-04-11T13:00:00.000Z"),
        undefined,
      ]),
    ).toEqual([
      "value",
      {
        kind: "special",
        type: "date",
        value: "2026-04-11T13:00:00.000Z",
      },
      {
        kind: "special",
        type: "undefined",
        value: "undefined",
      },
    ]);
  });

  it("should serialize plain objects recursively", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    expect(
      serializer.serializeValue({
        message: "ok",
        nested: {
          count: 2,
        },
      }),
    ).toEqual({
      message: "ok",
      nested: {
        count: 2,
      },
    });
  });

  it("should serialize circular object references", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    const value: Record<string, unknown> = {
      label: "root",
    };
    value.self = value;

    expect(serializer.serializeValue(value)).toEqual({
      label: "root",
      self: {
        value: {
          kind: "special",
          type: "circular",
          value: "[Circular Object]",
        },
      },
    });
  });

  it("should serialize circular array references", () => {
    const serializer = new DefaultSocketIoInstructionSerializer();

    const value: unknown[] = [];
    value.push(value);

    expect(serializer.serializeValue(value)).toEqual([
      [
        {
          kind: "special",
          type: "circular",
          value: "[Circular Array]",
        },
      ],
    ]);
  });
});
