import { Button, Container, Group } from '@mantine/core';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import PanelComponent from '~/components/Panel';
import { authenticator } from '~/services/auth/auth.server';
import { acceptPanel, getPendingPanelsViaStreamerId, rejectPanel } from '~/services/db/panel.server';
import type { Panel, sessionType } from '~/typings/typings';

type loaderType = {
    session: sessionType;
    pendingPanels: Panel[];
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const panelId = formData.get('panelId') as string;

    switch (formData.get('verdict')) {
        case 'accept': {
            await acceptPanel(panelId);
            return null;
        }

        case 'reject': {
            await rejectPanel(panelId);
            return null;
        }
    }
};

export const loader: LoaderFunction = async ({ request }) => {
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: '/login',
    });

    if (!session) return redirect('/login');

    const pendingPanels = await getPendingPanelsViaStreamerId(session.json.id);

    return { session, pendingPanels } as loaderType;
};

export default function ApprovalQueuePage() {
    const { pendingPanels } = useLoaderData() as loaderType;

    return (
        <Container>
            <h1>Approval Queue</h1>
            <p>Accept or deny your viewer's panels.</p>

            <Button component={Link} to="/streamer" prefetch="intent">
                Back to dashboard
            </Button>

            {pendingPanels.length >= 1 ? (
                pendingPanels.map((panel: Panel) => {
                    return (
                        <div key={panel.id} style={{ marginBottom: '1rem' }}>
                            <PanelComponent {...panel} />
                            <Group mt="1rem" spacing="sm" position="center">
                                <Form method="post">
                                    <input type="hidden" name="verdict" id="verdict" />
                                    <input type="hidden" name="panelId" defaultValue={panel.id} />
                                    <Button
                                        color="green"
                                        onClick={() => {
                                            // @ts-ignore ratio
                                            document.getElementById('verdict').value = 'accept';
                                        }}
                                        // i should def not do this but i DONT CARE!
                                        mr="1rem"
                                        type="submit"
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        color="red"
                                        onClick={() => {
                                            // @ts-ignore ratio
                                            document.getElementById('verdict').value = 'reject';
                                        }}
                                        type="submit"
                                    >
                                        Reject
                                    </Button>
                                </Form>
                            </Group>
                        </div>
                    );
                })
            ) : (
                <p>No panels to approve.</p>
            )}
        </Container>
    );
}
