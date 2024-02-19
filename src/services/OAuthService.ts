import { google } from 'googleapis';
import fs from 'fs';

const oAuthKeysFilePath = String(process.env.OAUTH_KEYS);

interface OAuthKeys {
    client_id: string,
    client_secret: string,
    redirect_uris: string[]
}

const readOAuthKeys = () => {
    try {
        const oAuthKeys = fs.readFileSync(oAuthKeysFilePath, 'utf8');
        const { web: keys } = JSON.parse(oAuthKeys);
        return keys;
    } catch (error) {
        throw new Error('Error reading oAuth.keys.json file:');
    }
};

const getOAuthClientParams = (oAuthKeys: OAuthKeys) => {
    try {
        const oAuthClientParams = {
            clientId: oAuthKeys.client_id,
            clientSecret: oAuthKeys.client_secret,
            redirectUri: oAuthKeys.redirect_uris[0]
        };
        return oAuthClientParams;
    } catch (error) {
        throw error;
    }
};

const getOAuthClient = () => {
    try {
        const oAuthKeys = readOAuthKeys();
        const oAuthClientParams = getOAuthClientParams(oAuthKeys);
        const oAuthClient = new google.auth.OAuth2(oAuthClientParams);
        return oAuthClient;
    } catch (error) {
        throw error;
    }
}

export class OAuthService {
    oAuthClient: any
    constructor() {
        this.oAuthClient = getOAuthClient();
    }
    async generateAuthURL(scopes: string[]) {
        try {
            return this.oAuthClient.generateAuthUrl({ access_type: 'offline', scope: scopes });
        } catch (error) {
            throw new Error('Error generating authenticaion URL for the given scopes.');
        }
    }

    async getTokenFromCode(code: string) {
        try {
            const { tokens } = await this.oAuthClient.getToken(code);
            this.oAuthClient.setCredentials(tokens);
            return tokens;
        } catch (error) {
            throw new Error('Error exchanging code for token');
        }
    }

    async verifyToken(token: any) {
        try {
            const ticket = await this.oAuthClient.verifyIdToken({
                idToken: token,
                audience: this.oAuthClient._clientId,
            });
            if (ticket) {
                return ticket.getPayload();
            }
        } catch (error) {
            throw new Error('Invalid token');
          }
    }
}