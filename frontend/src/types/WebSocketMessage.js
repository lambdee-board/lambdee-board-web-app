export default class WebSocketMessage {
  static types = {
    consoleInput: 'console_input',
    consoleOutput: 'console_output',
  }

  type
  payload = null

  static encode(type, payload = null) {
    const newMessage = new this(type, payload)
    return newMessage.encode()
  }

  static decode(message) {
    const decoded = JSON.parse(message)
    return new this(decoded.type, decoded.payload)
  }

  constructor(type, payload = null) {
    this.type = type
    this.payload = payload
  }

  encode() {
    return JSON.stringify(this)
  }
}
