export const config = {
    databaseUrl: process.env.DATABASE_URL,
    host: process.env.HOST,
    httpPort: process.env.HTTP_PORT,
    jwtSecretKey: process.env.TOKEN_SECRET_KEY,
    saltRounds: process.env.SALT_ROUNDS,
    oauthKeysFilePath: process.env.OAUTH_KEYS_FILE,
    logLevel: process.env.LOG_LEVEL,
    swaggerDocFile: process.env.SWAGGER_DOC_FILE,
    smtpEmailUser: process.env.EMAIL_USER,
    smtpEmailPass: process.env.EMAIL_PASS,
    slackWebhookURL: process.env.SLACK_WEBHOOK_URL,
    dSN: process.env.SENTRY_DSN,
    newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    newRelicAppName: process.env.NEW_RELIC_APP_NAME
}