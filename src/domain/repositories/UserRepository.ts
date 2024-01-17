import { BaseRepository } from "./BaseRepository";
import { User } from "../entities";

export interface UserRepository extends BaseRepository<User> {
    create(user: User): Promise<User>;
    fetchByEmail(email: string): Promise<User | null>;
    fetchByUsername(userName: string): Promise<User | null>;
}