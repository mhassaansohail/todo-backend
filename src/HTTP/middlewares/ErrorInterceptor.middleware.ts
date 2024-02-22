import { AlreadyExistsError, DtoValidationError, ExternalServiceFailure, FieldValidationError, InvalidOperation, NotFoundError, UnauthorizedOperation, ValidationError } from '@carbonteq/hexapp';
import { Logger } from '../../APP/Infrastructure/logger/Logger';
import { Request, Response, NextFunction } from 'express';
import { autoInjectable, inject } from 'tsyringe';


@autoInjectable()
export class ErrorInterceptor {
    private logger?: Logger;
    constructor(logger?: Logger) {
        this.logger = logger;
        this.logger?.info("Logger initialized.")
    }

    public handler(error: Error, req: Request, res: Response, next: NextFunction): Response {
        this.logger?.error(error.message);

        if (error instanceof AlreadyExistsError) {
            return res.status(403).json({ error: error.message });
        } else if (error instanceof ExternalServiceFailure) {
            return res.status(503).json({ error: error.message });
        } else if (error instanceof InvalidOperation) {
            return res.status(400).json({ error: error.message });
        } else if (error instanceof NotFoundError) {
            return res.status(204).json({ error: error.message });
        } else if (error instanceof UnauthorizedOperation) {
            return res.status(401).json({ error: error.message });
        } else if (error instanceof ValidationError) {
            return res.status(422).json({ error: error.message });
        } else if (error instanceof FieldValidationError) {
            return res.status(422).json({ error: error.message });
        } else if (error instanceof DtoValidationError) {
            return res.status(422).json({ error: error.message });
        } else {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}