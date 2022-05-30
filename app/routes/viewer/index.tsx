import {
  Avatar,
  Button,
  Container,
  Group,
  ListStylesParams,
  Text,
} from "@mantine/core";
import type { Streamer } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import {
  getAllChatterProfilesViaId,
  getChatterPanelCreditsViaId,
} from "~/services/db/chatterpanelcredits.server";
import { getAllStreamers } from "~/services/db/streamer.server";
import type { ChatterPanelCredits, sessionType } from "~/typings/typings";

type loaderData = {
  session: sessionType;
  chatterAccounts: ChatterPanelCredits[];
  streamersAvailable: Streamer[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session: sessionType = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!session) return null;
  const chatterAccounts = await getAllChatterProfilesViaId(session.json.id);
  const streamers = await getAllStreamers();
  let streamersAvailable: Streamer[] = [];

  await Promise.all(
    streamers.map(async (streamer) => {
      if (await creditProfileNotExists(session.json.id, streamer.id)) {
        streamersAvailable.push(streamer);
      }
    })
  );

  return { session, chatterAccounts, streamersAvailable } as loaderData;
};

async function creditProfileNotExists(
  chatterId: string,
  streamerId: string
): Promise<boolean> {
  return (await getChatterPanelCreditsViaId(chatterId, streamerId))
    ? false
    : true;
}

export default function ViewerPage() {
  const { chatterAccounts, streamersAvailable } = useLoaderData() as loaderData;

  return (
    <Container>
      <h1>Viewer Dashboard</h1>
      <p>Manage your accounts and submit new panels!</p>

      <Group>
        <Button component={Link} to="/" prefetch="intent" color="gray">
          Go Home
        </Button>
      </Group>

      <h2>Accounts</h2>
      <p>You have existing accounts with the following streamers:</p>
      {chatterAccounts.length >= 1 ? (
        chatterAccounts.map((chatterAccount) => (
          <Link
            to={`/viewer/${chatterAccount.streamerId}`}
            prefetch="intent"
            key={chatterAccount.id}
          >
            <Group mt="md">
              <Avatar
                src={chatterAccount.streamer.profilePicture}
                alt={chatterAccount.streamer.displayName + "'s profile image."}
                size="lg"
                radius="xl"
              />
              <div>
                <Text size="lg">{chatterAccount.streamer.displayName}</Text>
              </div>
            </Group>
          </Link>
        ))
      ) : (
        <p>No profiles found</p>
      )}

      {streamersAvailable.length >= 1 ? (
        <>
          <h3>Create an account</h3>
          <p>Create an account with an existing streamer:</p>
          {streamersAvailable.map((streamer) => (
            <div key={streamer.id}>
              <Link to={`/viewer/${streamer.id}`} prefetch="intent">
                <Group mt="md">
                  <Avatar
                    src={streamer.profilePicture}
                    alt={streamer.displayName + "'s profile image."}
                    size="lg"
                    radius="xl"
                  />
                  <div>
                    <Text size="lg">{streamer.displayName}</Text>
                  </div>
                </Group>
              </Link>
            </div>
          ))}
        </>
      ) : (
        ""
      )}
    </Container>
  );
}
