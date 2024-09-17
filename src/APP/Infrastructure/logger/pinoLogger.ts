import pino from 'pino';
import { config } from '../config';

export const pinoLogger = pino({
    level: config.logLevel || 'info',
    formatters: {
        bindings: (bindings: any) => {
            return { pid: bindings.pid, host: bindings.hostname };
        },
        level: (label: string) => {
            return { level: label.toUpperCase() };
        },
    },
    redact: {
        paths: [
            '*.password',
            'user.password',
            '*.user.password',
        ],
        remove: true,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});