export default class WebSocketMessage {
  static types = {
    consoleInput: 'console_input',
    consoleOutput: 'console_output',
    consoleOutputEnd: 'console_output_end',
    auth: 'auth',
    info: 'info',
  }

  type: string
  payload: unknown = null

  static encode(type: string, payload: unknown = null): string {
    const newMessage = new this(type, payload)
    return newMessage.encode()
  }

  static decode(message: string): WebSocketMessage {
    const decoded = JSON.parse(message) as { type: string; payload: unknown }
    return new this(decoded.type, decoded.payload)
  }

  constructor(type: string, payload: unknown = null) {
    this.type = type
    this.payload = payload
  }

  encode(): string {
    return JSON.stringify(this)
  }
}
