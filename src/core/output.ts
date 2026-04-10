import type { ILogoraOutput } from "logora";

import { SocketIoOutputOptions } from "../config/socket-io-output-options";
import { SocketIoWriter } from "./writer";

/**
 * Logora output implementation that emits structured instructions through
 * a Socket.IO-compatible emitter.
 */
export class SocketIoOutput implements ILogoraOutput {
  /**
   * The output name exposed to Logora.
   */
  public readonly name: string = "socketio";

  /**
   * The resolved output options.
   */
  public readonly options: SocketIoOutputOptions;

  /**
   * The writer used by Logora to dispatch output calls.
   */
  public readonly writer: SocketIoWriter;

  /**
   * Creates a new Socket.IO output instance.
   *
   * @param config Optional output configuration overrides.
   */
  public constructor(config?: Partial<SocketIoOutputOptions>) {
    this.options = new SocketIoOutputOptions(config);

    if (!this.options.emitter) {
      throw new Error("SocketIoOutput requires an emitter.");
    }

    this.writer = new SocketIoWriter(this.options);
  }
}
