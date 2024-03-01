import axios, { AxiosInstance } from "axios";
import { Result } from "@carbonteq/fp";
import { HTTPRequestService } from "../../APP/Application/interfaces/HTTPRequestService";
import { HTTPRequestServiceFailure } from "./exceptions/HTTPRequestService.exception";

export class RequestService implements HTTPRequestService {
    requestClient: AxiosInstance
    constructor() {
        this.requestClient = axios;
    }
    async makePostRequest(url: string, payload: any): Promise<Result<any, Error>> {
        try {
            return Result.Ok(await this.requestClient.post(url, payload));
        } catch (error: any) {
            return Result.Err(new HTTPRequestServiceFailure("makePostRequest"));
        }
    }
}