import { v4 as uuid } from "uuid";
import { UniqueIDGenerator } from "../../Application/contracts/UniqueIDGenerator";

export class UUIDGenerator implements UniqueIDGenerator {
    constructor() {
    }

    getUniqueID(): string {
        return uuid();
    }
}