import User from "../../Domain/entities/User";

export class UserDTO {
  userId: string;
  name: string;
  userName: string;
  password: string;
  email: string;
  age: number;

  constructor(userId: string, name: string, userName: string, password: string, email: string, age: number) {
    this.userId = userId;
    this.name = name;
    this.userName = userName;
    this.password = password;
    this.email = email;
    this.age = age;
  }

  public static toDTO(user: User): Partial<UserDTO> {
    return {
      userId: user.userId,
      name: user.name,
      userName: user.credentials._username,
      email: user.email,
      age: user.age,
    }
  }

  public static toPersistence(user: User): UserDTO {
    return {
      userId: user.userId,
      name: user.name,
      userName: user.credentials._username,
      password: user.credentials._password,
      email: user.email,
      age: user.age,
    }
  }
}