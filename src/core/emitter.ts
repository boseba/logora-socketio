import type { SocketIoEmitter } from "../models/socket-io-emitter.interface";

/**
 * Represents a minimal Socket.IO-compatible target exposing an `emit` method.
 */
export interface SocketIoLikeEmitterTarget {
  /**
   * Emits an event with a payload.
   *
   * @param eventName The event name to emit.
   * @param payload The payload to emit.
   */
  emit(eventName: string, payload: unknown): void;
}

/**
 * Creates a Logora-compatible Socket.IO emitter adapter from a minimal target.
 *
 * This helper intentionally depends only on the shape required by the output,
 * not on concrete Socket.IO runtime types.
 *
 * @param target The Socket.IO-compatible target.
 * @returns A Logora-compatible emitter adapter.
 */
export function createSocketIoEmitter(
  target: SocketIoLikeEmitterTarget,
): SocketIoEmitter {
  return {
    emit(eventName, payload) {
      target.emit(eventName, payload);
    },
  };
}
