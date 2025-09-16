import { ErrorInterceptor } from "./ErrorInterceptor.middleware";

const errorHandler = new ErrorInterceptor();

export const addErrorInterceptor = async (app: any): Promise<void> => {
    app.use(errorHandler.handler);
}