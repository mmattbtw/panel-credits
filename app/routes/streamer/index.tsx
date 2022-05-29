import { Button, Container } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import type { sessionType } from "~/typings/typings";

export const loader: LoaderFunction = async ({ request }) => {
    const session: any = await authenticator.isAuthenticated(request, {
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


            <Button
                component={Link}
                to="panels"
            >
                Go to All Panels
            </Button>
        </Container>
    )
}