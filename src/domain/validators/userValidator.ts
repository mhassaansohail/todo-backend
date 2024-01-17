import { User } from "../entities";

export const userValidator = (user: User) => {
    if (user.age < 0) {
        user.age = 0;
    }
}