import { Result } from "@carbonteq/fp";

export interface HTTPRequestService {
    makePostRequest(url: string, payload: any): Promise<Result<any, Error>>;
}