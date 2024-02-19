import { faker } from '@faker-js/faker';
import { TodoAttributes } from '../../Domain/types/todo';

export function createRandomTodo(): TodoAttributes {
  return {
    todoId: faker.string.uuid(),
    title: faker.lorem.word(),
    description: faker.lorem.sentence(),
    completed: faker.datatype.boolean(),
  };
}