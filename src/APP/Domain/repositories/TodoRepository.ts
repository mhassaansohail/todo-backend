import { BaseRepository, RepositoryResult, UUIDVo } from "@carbonteq/hexapp";
import Todo, { ITodoAttributes } from "../entities/TodoEntity";
import { Result } from "@carbonteq/fp";
import { InvalidOperationOnTodo } from "../exceptions/todo/InvalidOperationOnTodoException";

export abstract class TodoRepository extends BaseRepository<Todo> {
    async fetchAll(): Promise<RepositoryResult<Todo[]>> {
        return Result.Err(new InvalidOperationOnTodo());
    }
    abstract fetchById(id: UUIDVo): Promise<RepositoryResult<Todo>>;

    abstract existsById(todoId: UUIDVo): Promise<RepositoryResult<boolean>>;

    abstract fetchAllPaginated(
        offset: number, limit: number, conditionParams: Partial<ITodoAttributes>
    ): Promise<RepositoryResult<Todo[]>>;

    abstract countTotalRows(conditionParams: Partial<ITodoAttributes>): Promise<RepositoryResult<number>>;
}