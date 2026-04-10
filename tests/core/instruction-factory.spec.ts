import { LogType } from "logora";
import type { LogEntry } from "logora/module";
import { describe, expect, it, vi } from "vitest";

import { SocketIoInstructionFactory } from "../../src/core/instruction-factory";
import type { SocketIoInstructionSerializer } from "../../src/models";

describe("SocketIoInstructionFactory", () => {
  it("should create a log instruction from a log entry", () => {
    const serializeLogEntryMock = vi.fn().mockReturnValue({
      timestamp: "2026-04-11T12:00:00.000Z",
      type: LogType.Info,
      message: "Application started",
      args: [],
      scope: "App",
    });

    const serializeValueMock = vi.fn();

    const serializer: SocketIoInstructionSerializer = {
      serializeLogEntry: serializeLogEntryMock,
      serializeValue: serializeValueMock,
    };

    const factory = new SocketIoInstructionFactory(serializer);

    const entry: LogEntry = {
      timestamp: new Date("2026-04-11T12:00:00.000Z"),
      type: LogType.Info,
      message: "Application started",
      args: [],
      scope: "App",
    };

    const instruction = factory.createLogInstruction(entry);

    expect(serializeLogEntryMock).toHaveBeenCalledTimes(1);
    expect(serializeLogEntryMock).toHaveBeenCalledWith(entry);
    expect(instruction).toEqual({
      kind: "log",
      entry: {
        timestamp: "2026-04-11T12:00:00.000Z",
        type: LogType.Info,
        message: "Application started",
        args: [],
        scope: "App",
      },
    });
  });

  it("should create a print instruction and serialize all arguments", () => {
    const serializeLogEntryMock = vi.fn();
    const serializeValueMock = vi
      .fn()
      .mockReturnValueOnce("first")
      .mockReturnValueOnce(42);

    const serializer: SocketIoInstructionSerializer = {
      serializeLogEntry: serializeLogEntryMock,
      serializeValue: serializeValueMock,
    };

    const factory = new SocketIoInstructionFactory(serializer);

    const instruction = factory.createPrintInstruction("Message", [
      "value",
      42,
    ]);

    expect(serializeValueMock).toHaveBeenCalledTimes(2);
    expect(serializeValueMock).toHaveBeenNthCalledWith(1, "value");
    expect(serializeValueMock).toHaveBeenNthCalledWith(2, 42);
    expect(instruction).toEqual({
      kind: "print",
      message: "Message",
      args: ["first", 42],
    });
  });

  it("should create a title instruction", () => {
    const serializeLogEntryMock = vi.fn();
    const serializeValueMock = vi.fn();

    const serializer: SocketIoInstructionSerializer = {
      serializeLogEntry: serializeLogEntryMock,
      serializeValue: serializeValueMock,
    };

    const factory = new SocketIoInstructionFactory(serializer);

    expect(factory.createTitleInstruction("System")).toEqual({
      kind: "title",
      title: "System",
    });
  });

  it("should create an empty instruction", () => {
    const serializeLogEntryMock = vi.fn();
    const serializeValueMock = vi.fn();

    const serializer: SocketIoInstructionSerializer = {
      serializeLogEntry: serializeLogEntryMock,
      serializeValue: serializeValueMock,
    };

    const factory = new SocketIoInstructionFactory(serializer);

    expect(factory.createEmptyInstruction(3)).toEqual({
      kind: "empty",
      count: 3,
    });
  });
});
