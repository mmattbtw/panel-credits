import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/services/auth/session.server';
import { OAuth2Strategy } from '../auth/oauth.strategy';

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<any>(sessionStorage, {
    sessionKey: 'sessionKey',
    sessionErrorKey: 'sessionErrorKey',
});

// Twitch
authenticator.use(
    new OAuth2Strategy(
        {
            authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
            tokenURL: 'https://id.twitch.tv/oauth2/token',
            callbackURL: process.env.CALLBACK_URL || 'http://localhost:3000/auth/twitch/callback',
            clientID: process.env.CLIENT_ID || '',
            clientSecret: process.env.CLIENT_SECRET || '',
        },
        async ({ profile }) => {
            return await Promise.resolve({ ...profile });
        }
    )
);
