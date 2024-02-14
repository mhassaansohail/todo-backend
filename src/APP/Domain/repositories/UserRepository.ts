import { BaseRepository } from "./BaseRepository";
import User from "../entities/User";

export interface UserRepository extends BaseRepository<User> {
    create(user: User): Promise<User>;
    fetchByUserNameOrEmail(userName?: string, email?: string): Promise<User>;
}