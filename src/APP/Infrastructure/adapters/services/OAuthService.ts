import { Result } from '@carbonteq/fp';
import { google } from 'googleapis';
import fs from 'fs';
import { injectable } from 'tsyringe';
import { IOAuthService } from '../../../Application/ports/IOAuthService';
import { config } from '../../config';

const oAuthKeysFilePath = String(config.oauthKeysFilePath);

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
        throw new Error('Error reading oAuth2.keys.json file:');
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

@injectable()
export class OAuthService implements IOAuthService {
    private oAuthClient: any
    constructor() {
        this.oAuthClient = getOAuthClient();
    }
    async generateAuthURL(scopes: string[]): Promise<Result<string, Error>> {
        try {
            return Result.Ok(this.oAuthClient.generateAuthUrl({ access_type: 'offline', scope: scopes }));
        } catch (error) {
            return Result.Err(new Error('Error generating authenticaion URL for the given scopes.'));
        }
    }

    async genrateTokenFromParam(code: string): Promise<Result<any, Error>> {
        try {
            const { tokens } = await this.oAuthClient.getToken(code);
            // this.oAuthClient.setCredentials(tokens);
            return Result.Ok(tokens);
        } catch (error) {
            return Result.Err(new Error('Error exchanging code for token'));
        }
    }

    async verifyToken(token: any): Promise<Result<any, Error>> {
        try {
            const ticket = await this.oAuthClient.verifyIdToken({
                idToken: token,
                audience: this.oAuthClient._clientId,
            });
                return Result.Ok(ticket.getPayload());
        } catch (error) {
            return Result.Err(new Error('Invalid token'));
          }
    }
}
