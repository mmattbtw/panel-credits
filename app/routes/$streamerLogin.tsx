import { Avatar, Container, Group } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PanelComponent from '~/components/Panel';
import { getAcceptedPanelsViaStreamerLogin } from '~/services/db/panel.server';
import type { Panel } from '~/typings/typings';

export const loader: LoaderFunction = async ({ params }) => {
    const streamerLogin = params.streamerLogin ?? '';

    return (await getAcceptedPanelsViaStreamerLogin(streamerLogin)) as Panel[];
};

export default function StreamerPanelsPage() {
    const panels = useLoaderData() as Panel[];

    return (
        <Container>
            <Group>
                {/*                vvv TROLOLOLOLOLOL */}
                <Avatar src={panels[0].streamer.profilePicture} alt={panels[0].streamer.displayName + "'s profile image."} size="lg" radius="xl" />
                <h1>{panels[0].streamer.displayName}'s Panels</h1>
            </Group>

            {panels.length >= 1 ? panels.map((panel) => <PanelComponent key={panel.id} {...panel} />) : <p>No panels available.</p>}
        </Container>
    );
}
