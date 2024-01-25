import { singleton } from "tsyringe";
import { Handler } from "./Handler";

@singleton()
export class CommandBus {
  private handlers: { [key: string]: Handler } = {}
  constructor() {
    this.handlers = {};
  }

  registerHandler(commandName: string, handler: Handler) {
    this.handlers[commandName] = handler;
  }

  dispatch(command: any) {
    const commandName = command.constructor.name;
    if (this.handlers[commandName]) {
      const handler = this.handlers[commandName];
      return handler.handle(command);
    } else {
      throw new Error(`Handler not found for command: ${commandName}`);
    }
  }
}