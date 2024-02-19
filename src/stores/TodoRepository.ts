import { BaseRepository } from "./BaseRepository";
import { Todo } from "types";

export interface TodoRepository extends BaseRepository<Todo>{
    add(todo: Todo): Promise<Todo>;
}