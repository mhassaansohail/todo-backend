import { Result } from "@carbonteq/fp";

export interface IRequestService {
    makePostRequest(url: string, payload: any): Promise<Result<any, Error>>;
}