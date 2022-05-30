import { TextInput, Button } from "@mantine/core";
import type { ActionFunction, LoaderFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth/auth.server";
import { getChatterPanelCreditsViaId, updateChatterCreditsViaId } from "~/services/db/chatterpanelcredits.server";
import type { ChatterPanelCredits, sessionType } from "~/typings/typings";

export const loader: LoaderFunction = async ({ params, request }) => {
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const chatterId = params.chatterId as string;

    return await getChatterPanelCreditsViaId(chatterId, session.json.id) as ChatterPanelCredits
}

export const action: ActionFunction = async ({ request, params }) => {
    const formData = await request.formData();
    const session: sessionType = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });

    const chatterId = params.chatterId as string;
    const streamerId = session.json.id;
    const credits = parseInt(formData.get("credits") as string);

    await updateChatterCreditsViaId({chatterId, streamerId, credits})

    return redirect("/streamer/managecredits");
}

export default function EditChatter() {
    const chatter = useLoaderData() as ChatterPanelCredits

    return (
        <>
            <h2>Edit Chatters with existing balances</h2>
            <Form method="post" reloadDocument>
                <p>
                    <label>
                        {chatter.chatter.displayName}'s Credits:{" "}
                        <TextInput
                            type="text"
                            name="credits"
                        />
                    </label>
                </p>
                <p className="text-right">
                    <Button
                    type="submit"
                    >
                        Edit {chatter.chatter.displayName}'s Profile
                    </Button>
                </p>
            </Form>
            <hr />
        </>
    )
}