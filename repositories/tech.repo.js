import prisma from "../utils/client.js";

export function findByValues(value) {
    const list = Array.isArray(value) ? value : [value];
    return prisma.techs.findMany({
        where: { value: { in: list } }
    })
}