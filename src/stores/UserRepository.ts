import { BaseRepository } from "./BaseRepository";
import { User } from "types";

export interface UserRepository extends BaseRepository<User> {
    fetchByEmail(email: string): Promise<User | null>;
    fetchByUsername(userName: string): Promise<User | null>;
}