import { Command } from "../../Domain/commands/Command";

export abstract class Handler {
    abstract handle(command: Command): any;
}