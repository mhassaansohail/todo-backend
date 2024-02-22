import { IEntity } from "@carbonteq/hexapp";

export interface UserAttributes extends IEntity {
    name: string;
    email: string;
    userName: string;
    password: string;
    age: number;
};