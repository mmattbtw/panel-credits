import { Button, Container, Group } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { authenticator } from '~/services/auth/auth.server';
import type { sessionType } from '~/typings/typings';

export let loader: LoaderFunction = async ({ request }) => {
    const session: sessionType = await authenticator.isAuthenticated(request, {});

    if (!session) return null;

    return session as sessionType;
};

export default function MyApp() {
    const session = useLoaderData() as sessionType;
    return (
        <Container>
            <h1>Panel Credits</h1>
            <h2>Give your viewers 'credits', and allow them to submit a panel for your Twitch channel!</h2>
            <h3>{session ? `logged in as: ${session?.json.display_name}` : ''}</h3>

            {!session ? (
                <Button component={Link} to="/login" prefetch="intent">
                    Login
                </Button>
            ) : (
                <Group>
                    <Button component={Link} to="streamer" prefetch="intent" color="grape">
                        Go to Streamer Dashboard
                    </Button>
                    <Button component={Link} to="viewer" prefetch="intent">
                        Go to Viewer Dashboard
                    </Button>
                </Group>
            )}
        </Container>
    );
}
