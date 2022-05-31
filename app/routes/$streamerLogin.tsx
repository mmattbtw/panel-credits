import { Avatar, Container, Group } from '@mantine/core';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PanelComponent from '~/components/Panel';
import { getAcceptedPanelsViaStreamerLogin } from '~/services/db/panel.server';
import type { Panel } from '~/typings/typings';

export type loaderType = {
    panels: Panel[];
    streamerLogin: string;
};

export const loader: LoaderFunction = async ({ params }) => {
    const streamerLogin = params.streamerLogin ?? '';
    const panels = await getAcceptedPanelsViaStreamerLogin(streamerLogin);

    return { panels, streamerLogin } as loaderType;
};

export default function StreamerPanelsPage() {
    const { panels, streamerLogin } = useLoaderData() as loaderType;

    if (panels.length >= 1) {
        return (
            <Container>
                <Group>
                    {/*                vvv TROLOLOLOLOLOL */}
                    <Avatar
                        src={panels[0].streamer.profilePicture}
                        alt={panels[0].streamer.displayName + "'s profile image."}
                        size="lg"
                        radius="xl"
                    />
                    <h1>{panels[0].streamer.displayName}'s Panels</h1>
                </Group>

                {panels.map((panel) => (
                    <PanelComponent key={panel.id} {...panel} />
                ))}
            </Container>
        );
    } else {
        return (
            <Container>
                <h1
                    style={{
                        textAlign: 'center',
                    }}
                >
                    {streamerLogin} information couldn't be fonud.
                </h1>
            </Container>
        );
    }
}
