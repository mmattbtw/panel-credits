import { Avatar, Button, Container, Group, Text } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import { getAllChatterProfilesViaId } from "~/services/db/chatterpanelcredits.server";
import type { ChatterPanelCredits, sessionType } from "~/typings/typings";

type loaderData = {
    session: sessionType,
    chatterAccounts: ChatterPanelCredits[]
}

export const loader: LoaderFunction = async ({ request }) => {
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    if (!session) return null;
    const chatterAccounts = await getAllChatterProfilesViaId(session.json.id);

    return { session, chatterAccounts } as loaderData
}

export default function ViewerPage() {
    const { chatterAccounts } = useLoaderData() as loaderData;

    return (
        <Container>
            <h1>Viewer Dashboard</h1>
            <p>Manage your accounts and submit new panels!</p>

            <Group>
                <Button
                    component={Link}
                    to="/"
                    prefetch="intent"
                    color='gray'
                >
                    Go Home
                </Button>
            </Group>

            <h2>Accounts</h2>
            <p>You have accounts with the following streamers:</p>
            { (chatterAccounts.length >= 1) ?
                chatterAccounts.map(chatterAccount => (
                    <Link
                        to={`/viewer/${chatterAccount.streamerId}`}
                        prefetch="intent"
                        key={chatterAccount.id}
                    >
                        <Group mt='md'>
                                <Avatar src={chatterAccount.streamer.profilePicture} alt={chatterAccount.streamer.displayName + "'s profile image."} size='lg' radius="xl" />
                                <div>
                                    <Text size="lg">{chatterAccount.streamer.displayName}</Text>
                                </div>
                        </Group>
                    </Link>
                ))
                : <p>No profiles found</p> }
        </Container>
    )
}
