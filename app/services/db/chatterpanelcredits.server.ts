import type { ChatterPanelCredits } from '@prisma/client/edge';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

export async function getChatterPanelCreditsViaId(chatterId: string, streamerId: string) {
    return await prisma.chatterPanelCredits.findFirst({
        where: {
            streamerId,
            chatterId: chatterId,
        },
        include: {
            chatter: true,
            streamer: true,
        },
    });
}

export async function getChatterPanelCreditsViaLogin(chatterLogin: string, streamerId: string) {
    return await prisma.chatterPanelCredits.findFirst({
        where: {
            streamerId,
            chatter: {
                login: chatterLogin,
            },
        },
        include: {
            chatter: true,
            streamer: true,
        },
    });
}

export async function getAllChatterProfilesViaId(chatterId: string) {
    return await prisma.chatterPanelCredits.findMany({
        where: {
            chatterId: chatterId,
        },
        include: {
            chatter: true,
            streamer: true,
        },
    });
}

export async function getAllChatterProfilesViaLogin(chatterLogin: string) {
    return await prisma.chatterPanelCredits.findMany({
        where: {
            chatter: {
                login: chatterLogin,
            },
        },
        include: {
            chatter: true,
            streamer: true,
        },
    });
}

// I like being literal but this might be too much, if anyone has any better name ideas lmk (classic)
//                    vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
export async function getChattersPanelCreditsViaStreamerId(streamerId: string) {
    return await prisma.chatterPanelCredits.findMany({
        where: {
            streamerId,
        },
        include: {
            chatter: true,
        },
    });
}

export async function createChatterCreditsProfile(profile: Pick<ChatterPanelCredits, 'chatterId' | 'streamerId' | 'credits'>) {
    return prisma.chatterPanelCredits.create({
        data: {
            ...profile,
        },
        include: {
            chatter: true,
            streamer: true,
        },
    });
}

export async function updateChatterCreditsViaId(profile: Pick<ChatterPanelCredits, 'chatterId' | 'streamerId' | 'credits'>) {
    const user = await getChatterPanelCreditsViaId(profile.chatterId, profile.streamerId);

    if (user) {
        return prisma.chatterPanelCredits.update({
            where: {
                id: user.id,
            },
            data: {
                credits: profile.credits,
            },
        });
    } else {
        return null;
    }
}
