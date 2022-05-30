import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import { getAllPanelsViaStreamerId } from "~/services/db/panel.server";
import type { Panel, sessionType } from "~/typings/typings";
import { Container, Button } from "@mantine/core";
import PanelComponent from "~/components/Panel";

type loaderData = {
  session: sessionType;
  panels: Panel[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session: sessionType = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  if (!session) return null;

  const panels = await getAllPanelsViaStreamerId(session.json.id);

  return { session, panels } as loaderData;
};

export default function AllPanelsPage() {
  const { session, panels } = useLoaderData() as loaderData;

  return (
    <Container>
      <h1>Panels List</h1>
      <p>All panels for {session.json.display_name}</p>
      <Button component={Link} to="/streamer" prefetch="intent">
        Back to dashboard
      </Button>

      {panels.length >= 1 ? (
        panels.map((panel) => <PanelComponent key={panel.id} {...panel} />)
      ) : (
        <p>No panels found</p>
      )}
    </Container>
  );
}
