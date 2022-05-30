import { Button, TextInput } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth/auth.server';
import { getChatterViaLogin } from '~/services/db/chatter.server';
import { createChatterCreditsProfile, getChatterPanelCreditsViaLogin } from '~/services/db/chatterpanelcredits.server';
import type { sessionType } from '~/typings/typings';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: '/login',
    });
    const chatterLogin = formData.get('login') as string;
    const streamerId = session.json.id;
    const credits = parseInt(formData.get('credits') as string);

    let user = await getChatterPanelCreditsViaLogin(chatterLogin, session.json.id);
    console.log(user);
    if (!user) {
        if (!session) return null;

        const chatterProfile = await getChatterViaLogin(chatterLogin);
        const chatterId = chatterProfile?.id || '';

        await createChatterCreditsProfile({ chatterId, streamerId, credits });

        return redirect('/streamer/managecredits');
    } else {
        return redirect('/streamer/managecredits');
    }
};

export default function NewProfilePage() {
    return (
        <>
            <h2>Make a new credit profile for your viewer.</h2>
            <p
                style={{
                    fontWeight: 'bold',
                }}
            >
                ‼️ MAKE SURE THEY HAVE ALREADY LOGGED INTO THE SITE. ‼️
            </p>

            <Form method="post" reloadDocument>
                <p>
                    <label>
                        User Twitch Username: <TextInput type="text" name="login" />
                    </label>
                </p>
                <p>
                    <label>
                        User Credits: <TextInput type="text" name="credits" />
                    </label>
                </p>
                <p className="text-right">
                    <Button type="submit">Create User Profile</Button>
                </p>
            </Form>
            <hr />
        </>
    );
}
