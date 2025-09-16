import { createRandomTodo } from "../fakers/todo";
import { createInitialUser, createRandomUser } from "../fakers/user";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seedDatabase = async () => {
  for (let i = 0; i < 10; i++) {
    const randomTodo = createRandomTodo();
    await prisma.todo.create({
      data: randomTodo,
    });
  }
  const initailUser = createInitialUser();
  await prisma.user.create({
    data: initailUser,
  });
  
  for (let i = 0; i < 5; i++) {
    const randomUser = createRandomUser();
    await prisma.user.create({
      data: randomUser,
    });
  }
};

seedDatabase()
  .catch((error) => {
    console.error('Error seeding database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
