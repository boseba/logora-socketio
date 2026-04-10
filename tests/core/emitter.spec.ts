import { describe, expect, it, vi } from "vitest";

import { createSocketIoEmitter } from "../../src/core/emitter";

describe("createSocketIoEmitter", () => {
  it("should forward emitted instructions to the target", () => {
    const target = {
      emit: vi.fn(),
    };

    const emitter = createSocketIoEmitter(target);
    const payload = {
      kind: "title" as const,
      title: "Server",
    };

    emitter.emit("logora", payload);

    expect(target.emit).toHaveBeenCalledTimes(1);
    expect(target.emit).toHaveBeenCalledWith("logora", payload);
  });
});
