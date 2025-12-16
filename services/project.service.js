import * as projectRepo from "../repositories/project.repo.js"
import * as techRepo from "../repositories/tech.repo.js"
import format from "../utils/format.js"

export async function getAllProjects() {
    const projects = await projectRepo.findAll();
    return projects.map(format)
}

export async function getProjectById(id) {
    const project = await projectRepo.findById(id);
    if (!project) throw new Error('project not found');
    return format(project)
}

export async function getProjectsByUser(userId) {
    const projects = await projectRepo.findByUser(userId)
    if (!projects) throw new Error('Project not found');
    return {
        projects: projects.map(format)
    }
}

export async function createProject({ body, file, userId }) {
    const project = await projectRepo.create({
        body,
        file,
        userId
    });

    if (body?.techs) {
        const techs = await techRepo.findByValues(body.techs);
        if (!techs) throw new Error('Tech category not found');
        await projectRepo.attachTechs(project.id, techs);
    }

    return project;
}

export async function updateProject(id, body, userId) {
    await projectRepo.updateProject(Number(id), body, userId)
}

export async function deleteProject(id) {
    await projectRepo.deleteProject(id)
}

export async function filterProjects(incudeTechs, excludeTechs) {
    await projectRepo.filterTechs(incudeTechs, excludeTechs)
}