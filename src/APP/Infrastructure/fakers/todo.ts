import { faker } from '@faker-js/faker';

interface ITodo {
  todoId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createRandomTodo(): ITodo {
  return {
    todoId: faker.string.uuid(),
    title: faker.lorem.word(),
    description: faker.lorem.sentence(),
    completed: faker.datatype.boolean(),
    createdAt: faker.datatype.datetime(),
    updatedAt: faker.datatype.datetime()
  };
}