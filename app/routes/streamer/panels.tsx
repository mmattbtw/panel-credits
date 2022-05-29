import { Avatar, Container, Group, Image, Text } from "@mantine/core";
import type { Panel } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import { getPanelsViaStreamerId } from "~/services/db/panel.server";
import type { sessionType } from "~/typings/typings";

type loaderData = {
    session: sessionType
    panels: Panel[]
}

export const loader: LoaderFunction = async ({ request }) => {
    const session: any = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    if (!session) return null;

    const panels = await getPanelsViaStreamerId(session.json.id);

    return {session, panels} as loaderData;
}

export default function AllPanelsPage() {
    const { session, panels } = useLoaderData() as loaderData

    return (
        <Container>
            <h1>Panels List</h1>
            <p>All panels for {session.json.display_name}</p>

            { (panels.length >= 1) ?
                panels.map(panel => (
                    <>
                        <br key={panel.id} />
                        <Container 
                            key={panel.id}
                            size={320}
                            py="xs"
                            px="xs"
                            style={{
                                backgroundColor: '#212326',
                                borderRadius: '1rem',
                            }}
                        >
                            <h2>{panel.title}</h2>
                            <p>{panel.markdown}</p>
                            <Image 
                                src={panel.image}
                                alt={panel.title}
                                width={'auto'}
                                height={100}
                            />

                            <br />

                            <Group>
                                <Text size="sm">Panel by:</Text>
                                <Avatar src={panel.chatter.profilePicture} alt={panel.chatter.displayName + "'s profile image."} radius="xl" />
                                <div>
                                <Text size="sm">{panel.chatter.displayName}</Text>
                                </div>
                            </Group>

                            <Text
                                size="sm"
                                color={panel.accepted ? 'green' : 'grey'}
                            >{panel.accepted ? 'ACCEPTED' : 'UNKNOWN'}</Text>
                        </Container>
                    </>
                ))
                : <p>No panels found</p>
            }
        </Container>
    )
}