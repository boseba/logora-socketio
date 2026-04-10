import type { SocketIoOutputOptions } from "./config";
import { SocketIoOutput } from "./core/output";

export * from "./config";
export { createSocketIoEmitter } from "./core/emitter";
export * from "./models";

/**
 * Creates a Socket.IO output instance for Logora.
 *
 * @param config Optional output configuration overrides.
 * @returns A configured Socket.IO output instance.
 */
export function createSocketIoOutput(
  config?: Partial<SocketIoOutputOptions>,
): SocketIoOutput {
  return new SocketIoOutput(config);
}
