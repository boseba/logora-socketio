import type { ILogoraOutputOptions, LogLevel } from "logora";

import { DefaultSocketIoInstructionSerializer } from "../core/instruction-serializer";
import type { SocketIoEmitter } from "../models/socket-io-emitter.interface";
import type { SocketIoInstructionSerializer } from "../models/socket-io-instruction-serializer.interface";

/**
 * Defines the configuration options for the Socket.IO Logora output.
 */
export class SocketIoOutputOptions implements ILogoraOutputOptions {
  /**
   * The minimum log level accepted by this output.
   */
  public level?: LogLevel;

  /**
   * The Socket.IO event name used to emit instructions.
   */
  public eventName: string = "logora";

  /**
   * The emitter used to dispatch structured instructions.
   */
  public emitter!: SocketIoEmitter;

  /**
   * The serializer responsible for converting log entries and values
   * into transport-safe payloads.
   */
  public serializer: SocketIoInstructionSerializer =
    new DefaultSocketIoInstructionSerializer();

  /**
   * Creates a new options instance.
   *
   * @param overrides Optional configuration overrides.
   */
  public constructor(overrides?: Partial<SocketIoOutputOptions>) {
    Object.assign(this, overrides);
  }
}
