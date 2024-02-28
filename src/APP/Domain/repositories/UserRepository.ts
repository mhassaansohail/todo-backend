import { BaseRepository, RepositoryResult } from "@carbonteq/hexapp";
import { Result } from "@carbonteq/fp";
import { InvalidOperationOnUser } from "../exceptions/user/InvalidOperationOnUserException";
import User from "../entities/UserEntity";
import { UserAttributes } from "../attributes/UserAttributes";

export abstract class UserRepository extends BaseRepository<User> {

    async fetchAll(): Promise<RepositoryResult<User[]>> {
        return Result.Err(new InvalidOperationOnUser());
    }

    abstract fetchAllPaginated(
        offset: number, limit: number, conditionParams: Partial<UserAttributes>)
        : Promise<RepositoryResult<User[]>>;

    abstract existsBy(prop: keyof User, value: User[keyof User]): Promise<RepositoryResult<boolean>>

    abstract fetchByUserNameOrEmail(userName?: string, email?: string): Promise<RepositoryResult<User>>;

    abstract countTotalRows(conditionParams: Partial<UserAttributes>): Promise<RepositoryResult<number>>;
}