import type { Chatter } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export async function getChatterViaId(id: string) {
    return await prisma.chatter.findFirst({
        where: {
            id
        }
    })
}

export async function getChatterViaLogin(login: string) {
    return await prisma.chatter.findFirst({
        where: {
            login
        }
    })
}

export async function createChatter(
    chatter: Pick<
        Chatter,
        "id" | "login" | "displayName" | "profilePicture"
    >
) {
    return prisma.chatter.create({
        data: {
            ...chatter,
        },
    });
}