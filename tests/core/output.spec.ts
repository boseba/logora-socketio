import { describe, expect, it, vi } from "vitest";

import { SocketIoOutput } from "../../src/core/output";
import { SocketIoWriter } from "../../src/core/writer";
import type { SocketIoEmitter } from "../../src/models";

describe("SocketIoOutput", () => {
  it("should create an output with resolved options and writer", () => {
    const emitter: SocketIoEmitter = {
      emit: vi.fn(),
    };

    const output = new SocketIoOutput({
      emitter,
      eventName: "logs:event",
    });

    expect(output.name).toBe("socketio");
    expect(output.options.emitter).toBe(emitter);
    expect(output.options.eventName).toBe("logs:event");
    expect(output.writer).toBeInstanceOf(SocketIoWriter);
  });

  it("should use the default event name", () => {
    const output = new SocketIoOutput({
      emitter: {
        emit: vi.fn(),
      },
    });

    expect(output.options.eventName).toBe("logora");
  });

  it("should throw when emitter is missing", () => {
    expect(() => new SocketIoOutput()).toThrowError(
      "SocketIoOutput requires an emitter.",
    );
  });
});
