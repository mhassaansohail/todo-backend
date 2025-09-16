// Should be in HTTP layer used for controllers -> user


import { DtoValidationResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp"
import { TodoAttributes } from '../../../Domain/entities/TodoEntity';

type IToPresentationTodoDto = Omit<TodoAttributes, "Id"> & {
  todoId: string,
}

export class TodoDto {
  constructor() { };

  public static toPresentation(
    { Id, title, description, completed, createdAt, updatedAt }: TodoAttributes
  ): DtoValidationResult<IToPresentationTodoDto> {
    return Result.Ok({
      todoId: Id.serialize(),
      title,
      description,
      completed,
      createdAt,
      updatedAt
    })
  }
}