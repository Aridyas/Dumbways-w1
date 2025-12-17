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

export function updateProfile(data) {
    const updateData = {};

    if (data.body?.name !== undefined) {
        updateData.name = data.body.name;
    }

    if (data.body?.email !== undefined) {
        updateData.email = data.body.email;
    }

    if (data.file) {
        updateData.profile = "/profiles/" + data.file.filename;
    }

    return prisma.user.update({
        where: { id: data.id },
        data: updateData
    });
}