import { IEntity } from "@carbonteq/hexapp";

export interface TodoAttributes extends IEntity {
    title: string;
    description: string;
    completed: boolean;
};