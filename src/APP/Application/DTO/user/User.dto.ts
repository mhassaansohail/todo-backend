import { DtoValidationResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp"

interface IFromAppUserDTO {
  Id: UUIDVo;
  name: string;
  userName: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IToPresentationUserDto {
  userId: string,
  name: string;
  userName: string;
  email: string;
  age: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDto {
  constructor() { };

  public static toPresentation(
    { Id, name, userName, email, age, createdAt, updatedAt }: IFromAppUserDTO
  ): DtoValidationResult<IToPresentationUserDto> {
    return Result.Ok({
      userId: Id.serialize(), name, userName, email, age, createdAt, updatedAt
    })
  }
}