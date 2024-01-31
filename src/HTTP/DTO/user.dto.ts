import User from "../../APP/Domain/entities/User";

export class UserDTO {    
    public static toDTO (user: User): UserDTO {
      return {
        userId: user.userId,
        name: user.name,
        userName: user.credentials._username,
        email: user.email,
        age: user.age,
      }
    }
  }