import Todo from "../../Domain/entities/Todo";

export class TodoDTO {
  todoId: string;
  title: string;
  description: string;
  completed: boolean;

  constructor(todoId: string, title: string, description: string, completed: boolean) {
    this.todoId = todoId
    this.title = title
    this.description = description
    this.completed = completed
  }
  
  public static toDTO(todo: Todo): TodoDTO {
    return {
      todoId: todo.todoId,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
    }
  }

  public static toPersistence(todo: Todo): TodoDTO {
    return {
      todoId: todo.todoId,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
    }
  }
}