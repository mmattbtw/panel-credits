import { Button, Container, Group } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import { getChattersPanelCreditsViaStreamerId } from "~/services/db/chatterpanelcredits.server";
import type { ChatterPanelCredits, sessionType } from "~/typings/typings";

type loaderData = {
    session: sessionType
    creditProfiles: ChatterPanelCredits[]
}

export const loader: LoaderFunction = async ({ request }) => {
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    // LMFAO THIS FUNCTION NAME IS INSANE
    const creditProfiles = await getChattersPanelCreditsViaStreamerId(session.json.id);

    if (!session) return null;

    return { session, creditProfiles } as loaderData;
}

export default function ManageCreditsPage() {
    const { creditProfiles } = useLoaderData() as loaderData

    return (
        <Container>
            <h1>Manage Credits Page</h1>
            <p>Manage your viewer's credit balances here.</p>
            <Group>
                <Button
                    component={Link}
                    to="/streamer"
                    prefetch="intent"
                >Back to dashboard</Button>
                <Button
                    component={Link}
                    to="newprofile"
                    prefetch="intent"
                    color='green'
                >
                    Add New Viewer Profile
                </Button>
            </Group>

            <Outlet />

            <h2>Edit chatters with existing balances</h2>
            { (creditProfiles.length >= 1) ?
                    creditProfiles.map(creditProfile => (
                        <div key={creditProfile.id}>
                            <Link to={`${creditProfile.chatterId}`} prefetch='intent'><p>{creditProfile.chatter.displayName} has {creditProfile.credits} credits</p></Link>
                        </div>
                    ))
                    : <p>No chatters found</p> }
        </Container>
    )
}