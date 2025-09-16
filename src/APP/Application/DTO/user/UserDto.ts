// Should be in HTTP layer used for controllers -> user

import { DtoValidationResult, UUIDVo } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp"
import { UserAttributes } from '../../../Domain/entities/UserEntity';


type IToPresentationUserDto = Omit<UserAttributes, "Id" | "password"> & {
  userId: string,
}

export class UserDto {
  constructor() { };

  public static toPresentation(
    { Id, name, userName, email, age, createdAt, updatedAt }: UserAttributes
  ): DtoValidationResult<IToPresentationUserDto> {
    return Result.Ok({
      userId: Id.serialize(), name, userName, email, age, createdAt, updatedAt
    })
  }
}