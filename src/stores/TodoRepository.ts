import { BaseRepository } from "./BaseRepository";
import { Todo } from "types";

export interface TodoRepository extends BaseRepository<Todo> {
    search(title: string, description: string): Promise<Todo[]>;
}