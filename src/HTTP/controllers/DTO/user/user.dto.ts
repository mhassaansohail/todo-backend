import User from "../../../../APP/Domain/entities/User";

interface IUserDTO {
  Id: string;
  name: string;
  userName: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDTO {
  constructor() { };

  public static toPresentation(user: User): IUserDTO {
    return user.serialize();
  }
}