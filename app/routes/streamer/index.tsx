import { Button, Container, Group } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import type { sessionType } from "~/typings/typings";

export const loader: LoaderFunction = async ({ request }) => {
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    
    if (!session) return null;
    
    return session as sessionType;
}

export default function StreamerPage() {
    const session = useLoaderData() as sessionType

    return (
        <Container>
            <h1>Streamer Dashboard:</h1>
            <p>logged in as: {session.json.display_name}</p>

            <Group>
                <Button
                    component={Link}
                    to="/"
                    prefetch="intent"
                    color='gray'
                >
                    Go Home
                </Button>
                <Button
                    component={Link}
                    to="panels"
                    prefetch="intent"
                >
                    Go to All Panels
                </Button>
                <Button
                    component={Link}
                    to="managecredits"
                    prefetch="intent"
                >
                    Manage Credits
                </Button>
            </Group>

        </Container>
    )
}