import type { SocketIoInstruction } from "./socket-io-instruction.interface";

/**
 * Represents the minimal emitter contract required by the Socket.IO output.
 */
export interface SocketIoEmitter {
  /**
   * Emits a structured instruction using the provided event name.
   *
   * @param eventName The Socket.IO event name.
   * @param payload The instruction payload to emit.
   */
  emit(eventName: string, payload: SocketIoInstruction): void;
}
