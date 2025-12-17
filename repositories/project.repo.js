import prisma from "../utils/client.js";

export function findAll() {
    return prisma.userProject.findMany({
        where: { private: false },
        include: {
            user: { select: { name: true } },
            projectTechs: { include: { techs: true } }
        }
    });
}

export function findById(id) {
    return prisma.userProject.findUnique({
        where: { id },
        include: {
            projectTechs: { include: { techs: true } }
        }
    });
}

export function findByUser(userId) {
    return prisma.userProject.findMany({
        where: { userId },
        include: {
            user: true,
            projectTechs: { include: { techs: true } }
        }
    });
}

export function create(data) {
    if (!data?.userId) {
        throw new Error('Missing userId for project creation');
    }
    return prisma.userProject.create({
        data: {
            name: data.body.name,
            dateStart: new Date(data.body.dateStart),
            dateEnd: new Date(data.body.dateEnd),
            image: data.file ? "/uploads/" + data.file.filename : null,
            desc: data.body.desc,
            user: {
                connect: { id: data.userId }
            }
        }
    });
}

export function attachTechs(projectId, techs) {
    return prisma.projectTechs.createMany({
        data: techs.map(t => ({
            projectId,
            techId: t.id
        }))
    });
}

export function updateProject(id, data) {
    return prisma.userProject.update({
        where: { id },
        data: {
            name: data.name,
            desc: data.desc,
            dateStart: new Date(data.dateStart),
            dateEnd: new Date(data.dateEnd)
        }
    });
}

export async function deleteProject(id) {
    await prisma.projectTechs.deleteMany({
        where: { projectId: id }
    });

    return prisma.userProject.delete({
        where: { id }
    });
}

export async function filterTechs(includeTechs, excludeTechs) {
    return prisma.userProject.findMany({
        where: {
            AND: [
                includeTechs.length
                    ? {
                        projectTechs: {
                            some: {
                                tech: {
                                value: { in: includeTechs }
                                }
                            }
                        }
                    }   
                    : {},
                decludeTechs.length
                    ? {
                        projectTechs: {
                            none: {
                                tech: {
                                value: { in: excludeTechs }
                                }
                            }
                        }
                    }
                    : {}
            ]
        }
    });
}