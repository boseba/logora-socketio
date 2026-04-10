# logora-socketio 

[![NPM version](https://img.shields.io/npm/v/logora-socketio?style=flat-square)](https://www.npmjs.com/package/logora-socketio) 
[![Coverage Status](https://coveralls.io/repos/github/boseba/logora-socketio/badge.svg?branch=main)](https://coveralls.io/github/boseba/logora-socketio?branch=main)

**logora-socketio** is the official Socket.IO output module for the [Logora](https://www.npmjs.com/package/logora) logging framework.

It emits structured Logora instructions through a Socket.IO-compatible emitter, making it easy to forward logs from a Node.js server to connected clients in real time.

---

## Features

- Structured Socket.IO transport for Logora
- Output architecture aligned with the Logora ecosystem
- Supports `log`, `print`, `title`, and `empty`
- Keeps transport concerns separated from application logic
- Uses a lightweight emitter abstraction instead of coupling directly to Socket.IO server types
- Ships with a default serializer for transport-safe payloads
- Supports custom event names
- Non-blocking design compatible with scoped loggers

---

## Installation

```bash
npm install logora logora-socketio
```

---

## Basic Usage

```ts
import { createLogger, LogLevel } from "logora";
import { createSocketIoEmitter, createSocketIoOutput } from "logora-socketio";

const io = {
    emit(eventName: string, payload: unknown): void {
        console.log(eventName, payload);
    },
};

const logger = createLogger({ level: LogLevel.Info });

logger.addLogOutput(
    createSocketIoOutput({
        emitter: createSocketIoEmitter(io),
    }),
);

logger.info("Server started on port {0}", 3000);
```

---

## With Socket.IO Server

```ts
import { createServer } from "node:http";
import { Server } from "socket.io";
import { createLogger, LogLevel } from "logora";
import { createSocketIoEmitter, createSocketIoOutput } from "logora-socketio";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

const logger = createLogger({ level: LogLevel.Info });

logger.addLogOutput(
    createSocketIoOutput({
        emitter: createSocketIoEmitter(io),
        eventName: "logora",
    }),
);

logger.info("Socket.IO server is ready");
logger.print("Listening on port {0}", 3000);

httpServer.listen(3000);
```

---

## Emitted Payload Format

The package emits structured instructions through the configured Socket.IO event.

### Log instruction

```ts
{
    kind: "log",
    entry: {
        timestamp: "2026-04-11T12:34:56.000Z",
        type: "info",
        message: "Server started on port {0}",
        args: [3000],
        scope: "http"
    }
}
```

### Print instruction

```ts
{
    kind: "print",
    message: "Connected to room {0}",
    args: ["general"]
}
```

### Title instruction

```ts
{
    kind: "title",
    title: "Bootstrap"
}
```

### Empty instruction

```ts
{
    kind: "empty",
    count: 1
}
```

---

## Scoped Logging

You can use scoped loggers as usual:

```ts
const httpLogger = logger.getScoped("HTTP");
const dbLogger = logger.getScoped("Database");

httpLogger.info("Incoming request: {0}", "/api/users");
dbLogger.error("Query failed: {0}", "Connection timeout");
```

If a scope is defined, it is included in the serialized log instruction payload.

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `emitter` | `SocketIoEmitter` | — | The emitter used to dispatch structured instructions |
| `eventName` | `string` | `"logora"` | The Socket.IO event name used to emit instructions |
| `serializer` | `SocketIoInstructionSerializer` | `DefaultSocketIoInstructionSerializer` | Serializer used to convert log entries and values into transport-safe payloads |
| `level` | `LogLevel` | inherited from Logora | Minimum log level accepted by this output |

---

## Helper API

### `createSocketIoOutput(config?)`

Creates a Logora output instance configured for Socket.IO transport.

```ts
import { createSocketIoOutput } from "logora-socketio";

const output = createSocketIoOutput({
    emitter,
    eventName: "logora",
});
```

### `createSocketIoEmitter(target)`

Creates a Logora-compatible emitter adapter from any minimal target exposing:

```ts
emit(eventName: string, payload: unknown): void;
```

Example:

```ts
import { createSocketIoEmitter } from "logora-socketio";

const emitter = createSocketIoEmitter(io);
```

This keeps the package lightweight and avoids coupling the public API to specific Socket.IO runtime types.

---

## Notes

- `clear()` is intentionally ignored by this output.
- This package does not create or manage a Socket.IO server.
- This package does not handle rooms, namespaces, authentication, reconnection, or any application-specific logic.
- Its responsibility is limited to converting Logora output calls into structured Socket.IO instructions.

---

## License

MIT © Sébastien Bosmans
