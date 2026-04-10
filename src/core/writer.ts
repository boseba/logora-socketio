import type { ILogoraWriter, LogEntry } from "logora/module";

import type { SocketIoOutputOptions } from "../config/socket-io-output-options";
import type { SocketIoInstruction } from "../models/socket-io-instruction.interface";
import { SocketIoInstructionFactory } from "./instruction-factory";

/**
 * Implements the Logora writer contract for Socket.IO transport.
 */
export class SocketIoWriter implements ILogoraWriter {
  private readonly _options: SocketIoOutputOptions;
  private readonly _factory: SocketIoInstructionFactory;

  /**
   * Creates a new writer instance.
   *
   * @param options The resolved output options.
   */
  public constructor(options: SocketIoOutputOptions) {
    this._options = options;
    this._factory = new SocketIoInstructionFactory(options.serializer);
  }

  /**
   * Emits a structured log instruction.
   *
   * @param entry The Logora entry to emit.
   */
  public log(entry: LogEntry): void {
    this._emit(this._factory.createLogInstruction(entry));
  }

  /**
   * Emits a structured title instruction.
   *
   * @param title The title to emit.
   */
  public title(title: string): void {
    this._emit(this._factory.createTitleInstruction(title));
  }

  /**
   * Emits a structured empty-line instruction.
   *
   * @param count The requested number of empty lines.
   */
  public empty(count: number = 1): void {
    this._emit(this._factory.createEmptyInstruction(count));
  }

  /**
   * Intentionally does nothing for Socket.IO output.
   *
   * The Logora writer contract currently requires this method, but clearing
   * output is console-specific and has no transport meaning here.
   */
  public clear(): void {
    // Intentionally a no-op.
  }

  /**
   * Emits a structured print instruction.
   *
   * @param message The raw print message.
   * @param args Additional runtime values to serialize and emit.
   */
  public print(message: string, ...args: unknown[]): void {
    this._emit(this._factory.createPrintInstruction(message, args));
  }

  /**
   * Emits an instruction through the configured emitter.
   *
   * @param instruction The instruction to dispatch.
   */
  private _emit(instruction: SocketIoInstruction): void {
    this._options.emitter.emit(this._options.eventName, instruction);
  }
}
