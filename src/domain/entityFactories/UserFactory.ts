import { User, NullUser } from "../entities";
import { EntityFactory } from "./EntityFactory";
import { v4 as uuid } from "uuid";

export class UserFactory extends EntityFactory<User> {
    public createEntity(user: User | null): User {
        if (!user) {
            return this.createNullEntity();
        }
        return new User(user.id || uuid(), user.name, user.userName, user.email, user.password, user.age);
    }
    protected createNullEntity(): User {
        return new NullUser();
    }
}
