import Todo from "../../APP/Domain/entities/Todo";

export class TodoDTO {    
    public static toDTO (todo: Todo): TodoDTO {
      return {
        todoId: todo.todoId,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
      }
    }
  }