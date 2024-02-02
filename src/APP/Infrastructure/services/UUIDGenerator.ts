import { v4 as uuid } from "uuid";
import { IUniqueIDGenerator } from "../../Application/contracts/IUniqueIDGenerator";

export class UUIDGenerator implements IUniqueIDGenerator {
    constructor() { }

    getUniqueID(): string {
        return uuid();
    }
}