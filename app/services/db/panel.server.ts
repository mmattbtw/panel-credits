import type { Panel } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function getPanelViaId(id: string) {
    return await prisma.panel.findFirst({
        where: {
            id,
        },
    });
}

export async function getPanelsViaStreamerId(streamerId: string) {
    return await prisma.panel.findMany({
        where: {
            streamerId,
        },
    });
}

export async function getPanelsViaChatterId(chatterId: string) {
    return await prisma.panel.findMany({
        where: {
            chatterId,
        },
    });
}

export async function createPanel(
    panel: Pick<
        Panel, 
        "chatterId" | "streamerId" | "title" | "markdown" | "image"
    >
) {
    return prisma.panel.create({
        data: {
            ...panel,
        },
    });
}