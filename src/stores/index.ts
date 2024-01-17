import { TodoFactory, UserFactory } from "../domain/entityFactories";
import { UserStore } from "./UserStore";
import { TodoStore } from "./TodoStore";

const userStore = new UserStore(new UserFactory())
const todoStore = new TodoStore(new TodoFactory())

export { userStore, todoStore };