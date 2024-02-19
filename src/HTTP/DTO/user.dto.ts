import User from "../../APP/Domain/entities/User";

export class UserDTO {
  userId: string;
  name: string;
  userName: string;
  email: string;
  age: number;

  constructor(userId: string, name: string, userName: string, email: string, age: number) {
    this.userId = userId;
    this.name = name;
    this.userName = userName;
    this.email = email;
    this.age = age;
  }

  public static toPresentation(user: User): UserDTO {
    return {
      userId: user.userId,
      name: user.name,
      userName: user._userName,
      email: user.email,
      age: user.age,
    }
  }

}