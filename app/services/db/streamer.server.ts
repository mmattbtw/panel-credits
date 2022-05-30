import type { Streamer } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getStreamerViaId(id: string) {
    return await prisma.streamer.findFirst({
        where: {
            id,
        },
    });
}

export async function getStreamerViaLogin(login: string) {
    return await prisma.streamer.findFirst({
        where: {
            login,
        },
    });
}

export async function getAllStreamers() {
    return await prisma.streamer.findMany({
        orderBy: {
            displayName: 'desc',
        },
    });
}

export async function createStreamer(streamer: Pick<Streamer, 'id' | 'login' | 'displayName' | 'profilePicture'>) {
    return prisma.streamer.create({
        data: {
            ...streamer,
        },
    });
}
