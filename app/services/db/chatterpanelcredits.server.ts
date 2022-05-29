import type { ChatterPanelCredits } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function getChatterPanelCredits(chatterId: string, streamerId: string) {
    return await prisma.chatterPanelCredits.findFirst({
        where: {
            streamerId,
            chatterId,
        }
    })
}

export async function createChatterCreditsProfile(
    profile: Pick<
        ChatterPanelCredits,
        "chatterId" | "streamerId" | "credits"
    >
) {
    return prisma.chatterPanelCredits.create({
        data: {
            ...profile
        },
    });
}