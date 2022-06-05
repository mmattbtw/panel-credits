import { Button, TextInput, Textarea, Tooltip } from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth/auth.server';
import { createPanel } from '~/services/db/panel.server';
import type { sessionType } from '~/typings/typings';

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: '/login',
    });

    const streamerId = params.streamerId as string;
    const chatterId = session.json.id;

    const title = formData.get('title') as string;
    const markdown = formData.get('markdown') as string;

    const image = formData.get('image')?.toString() || undefined;
    const link = formData.get('link')?.toString() || undefined;

    if (title.length > 100 || markdown.length > 5000) {
        return redirect('/viewer/' + streamerId);
    } else if (image) {
        if (image.length > 500) {
            return redirect('/viewer/' + streamerId);
        }
    } else if (link) {
        if (link.length > 500) {
            return redirect('/viewer/' + streamerId);
        }
    }

    await createPanel({
        chatterId,
        streamerId,
        title,
        markdown,
        image,
        link,
    });

    return redirect('/viewer/' + streamerId);
};

export default function SubmitPanel() {
    return (
        <Form method="post" reloadDocument>
            <p>
                <label>
                    Title: <TextInput type="text" name="title" />
                </label>
            </p>
            <Tooltip label="The only image links that will work on the Twitch Extension are the ones that start with https://i.imgur.com/ or https://cdn.7tv.app/.">
                <p>
                    <label>
                        Image Link (optional): <TextInput type="text" name="image" />
                    </label>
                </p>
            </Tooltip>
            <p>
                <label>
                    Link (optional): <TextInput type="text" name="link" />
                </label>
            </p>
            <p>
                <label htmlFor="markdown">Markdown:</label>
                <br />
                <Textarea id="markdown" rows={20} name="markdown" autosize />
            </p>
            <p>
                <Button type="submit">Submit Panel</Button>
            </p>
        </Form>
    );
}
