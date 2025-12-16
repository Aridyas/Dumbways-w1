import prisma from "../utils/client.js";

export function create(data) {
    return prisma.user.create({
        data
    });
}

export function findByEmail(email) {
    return prisma.user.findUnique({
        where: { email }
    })
}

export function findById(id) {
    return prisma.user.findUnique({
        where: { id }
    })
}