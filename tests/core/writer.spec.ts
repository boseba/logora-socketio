import { LogType } from "logora";
import type { LogEntry } from "logora/module";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SocketIoOutputOptions } from "../../src/config";
import { SocketIoWriter } from "../../src/core/writer";
import type { SocketIoEmitter } from "../../src/models";

describe("SocketIoWriter", () => {
  let emitMock: ReturnType<typeof vi.fn>;
  let emitter: SocketIoEmitter;
  let options: SocketIoOutputOptions;
  let writer: SocketIoWriter;

  beforeEach(() => {
    emitMock = vi.fn();

    emitter = {
      emit: emitMock,
    };

    options = new SocketIoOutputOptions({
      emitter,
      eventName: "socket:logs",
    });

    writer = new SocketIoWriter(options);
  });

  it("should emit a serialized log instruction", () => {
    const entry: LogEntry = {
      timestamp: new Date("2026-04-11T10:00:00.000Z"),
      type: LogType.Info,
      message: "Server started",
      args: [3000],
      scope: "HTTP",
    };

    writer.log(entry);

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith("socket:logs", {
      kind: "log",
      entry: {
        timestamp: "2026-04-11T10:00:00.000Z",
        type: LogType.Info,
        typeName: "Info",
        message: "Server started",
        args: ["3000"],
        scope: "HTTP",
      },
    });
  });

  it("should emit a title instruction", () => {
    writer.title("Boot");

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith("socket:logs", {
      kind: "title",
      title: "Boot",
    });
  });

  it("should emit an empty instruction with the provided count", () => {
    writer.empty(2);

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith("socket:logs", {
      kind: "empty",
      count: 2,
    });
  });

  it("should emit an empty instruction with a default count of 1", () => {
    writer.empty();

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith("socket:logs", {
      kind: "empty",
      count: 1,
    });
  });

  it("should emit a print instruction", () => {
    writer.print("Connected to room", "alpha", 3);

    expect(emitMock).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith("socket:logs", {
      kind: "print",
      message: "Connected to room",
      args: ["alpha", "3"],
    });
  });

  it("should ignore clear calls", () => {
    writer.clear();

    expect(emitMock).not.toHaveBeenCalled();
  });
});
