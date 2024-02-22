import { AppErrStatus, AppError, } from '@carbonteq/hexapp';
import { Logger } from '../../APP/Infrastructure/logger/Logger';
import { Request, Response, NextFunction } from 'express';
import { autoInjectable, inject, injectable, singleton } from 'tsyringe';

@autoInjectable()
export class ErrorInterceptor {
    private logger?: Logger;
    constructor(@inject("Logger") logger?: Logger) {
        this.logger = logger;
    }

    public handler(error: AppError, req: Request, res: Response, next: NextFunction): Response {
        this.logger?.error(error.message);

        if (error.status === AppErrStatus.AlreadyExists) {
            return res.status(403).json({ error: error.message });
        } else if (error.status === AppErrStatus.ExternalServiceFailure) {
            return res.status(503).json({ error: error.message });
        } else if (error.status === AppErrStatus.InvalidOperation) {
            return res.status(400).json({ error: error.message });
        } else if (error.status === AppErrStatus.NotFound) {
            return res.status(404).json({ error: error.message });
        } else if (error.status === AppErrStatus.Unauthorized) {
            return res.status(401).json({ error: error.message });
        } else if (error.status === AppErrStatus.InvalidData) {
            return res.status(422).json({ error: error.message });
        } else if (error.status === AppErrStatus.Generic) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(500).json({ error: "Insternal Server Error." });
        }
    }
}