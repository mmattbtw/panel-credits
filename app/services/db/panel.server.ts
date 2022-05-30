import { PrismaClient } from "@prisma/client";
import type { Panel } from "~/typings/typings";
import {
  getChatterPanelCreditsViaId,
  updateChatterCreditsViaId,
} from "./chatterpanelcredits.server";

const prisma = new PrismaClient();

export async function getPanelViaId(id: string) {
  return await prisma.panel.findFirst({
    where: {
      id,
    },
  });
}

export async function getAllPanelsViaStreamerId(streamerId: string) {
  return await prisma.panel.findMany({
    where: {
      streamerId,
    },
    include: {
      chatter: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllPanelsViaChatterId(chatterId: string) {
  return await prisma.panel.findMany({
    where: {
      chatterId,
    },
    include: {
      streamer: true,
      chatter: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPanelsViaChatterId(
  chatterId: string,
  streamerId: string
) {
  return await prisma.panel.findMany({
    where: {
      chatterId,
      streamerId,
    },
    include: {
      streamer: true,
      chatter: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createPanel(
  panel: Pick<
    Panel,
    "chatterId" | "streamerId" | "title" | "markdown" | "image" | "link"
  >
) {
  const chatterProfile = await getChatterPanelCreditsViaId(
    panel.chatterId,
    panel.streamerId
  );

  if (chatterProfile) {
    if (chatterProfile.credits < 1) {
      throw new Error("You do not have enough credits to create a panel.");
    }

    let afterCredits = chatterProfile.credits - 1;

    const createdPanel = await prisma.panel.create({
      // @ts-ignore shut up

      data: {
        ...panel,
      },
    });

    await updateChatterCreditsViaId({
      chatterId: panel.chatterId,
      streamerId: panel.streamerId,
      credits: afterCredits,
    });

    return createdPanel;
  } else {
    throw new Error("You don't have a profile.");
  }
}
