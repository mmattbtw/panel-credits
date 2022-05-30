import { Avatar, Button, Container, Group } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import PanelComponent from "~/components/Panel";
import { authenticator } from "~/services/auth/auth.server";
import {
  createChatterCreditsProfile,
  getChatterPanelCreditsViaId,
} from "~/services/db/chatterpanelcredits.server";
import { getPanelsViaChatterId } from "~/services/db/panel.server";
import type {
  ChatterPanelCredits,
  Panel,
  sessionType,
} from "~/typings/typings";

type loaderData = {
  session: sessionType;
  creditProfile: ChatterPanelCredits;
  panels: Panel[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session: sessionType = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!session) return null;

  const streamerId = params.streamerId as string;

  let creditProfile = await getChatterPanelCreditsViaId(
    session.json.id,
    streamerId
  );
  if (!creditProfile) {
    // @ts-ignore (its literally the exact same type but typescript be like 🤓)
    creditProfile = await createChatterCreditsProfile({
      chatterId: session.json.id,
      streamerId: streamerId,
      credits: 0,
    });
    return redirect("/viewer/" + streamerId);
  }

  const panels = await getPanelsViaChatterId(session.json.id, streamerId);

  return { session, creditProfile, panels } as loaderData;
};

export default function StreamerPage() {
  const { creditProfile, panels } = useLoaderData() as loaderData;

  return (
    <Container>
      <Group>
        <Button
          component={Link}
          to="/viewer"
          prefetch="intent"
          color="gray"
          my={"1rem"}
        >
          Back to dashboard
        </Button>
      </Group>

      <Group>
        <Avatar
          src={creditProfile.streamer.profilePicture}
          alt={creditProfile.streamer.displayName + "'s profile image."}
          size="lg"
          radius="xl"
        />
        <h1>Manage your {creditProfile.streamer.displayName} account</h1>
      </Group>
      <p>See your credit balance and submit new panels!</p>

      <h2>Your credit balance:</h2>
      <p>{creditProfile.credits}</p>

      <Button
        component={Link}
        to={`/viewer/${creditProfile.streamerId}/submitpanel`}
        prefetch="intent"
      >
        Submit a new panel
      </Button>

      <Outlet />

      <h2>Submitted Panels:</h2>
      {panels.length >= 1 ? (
        panels.map((panel) => <PanelComponent key={panel.id} {...panel} />)
      ) : (
        <p>You have not submitted any panels yet!</p>
      )}
    </Container>
  );
}
