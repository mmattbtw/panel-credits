import type { Chatter } from '@prisma/client/edge';
import { PrismaClient } from '@prisma/client/edge';

const prisma = new PrismaClient();

export async function getChatterViaId(id: string) {
    return await prisma.chatter.findFirst({
        where: {
            id,
        },
        include: {
            panelCredits: true,
            panels: true,
        },
    });
}

export async function getChatterViaLogin(login: string) {
    return await prisma.chatter.findFirst({
        where: {
            login,
        },
        include: {
            panelCredits: true,
            panels: true,
        },
    });
}

export async function createChatter(chatter: Pick<Chatter, 'id' | 'login' | 'displayName' | 'profilePicture'>) {
    return await prisma.chatter.create({
        data: {
            ...chatter,
        },
    });
}
