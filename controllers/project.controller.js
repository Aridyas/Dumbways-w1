import * as projectService from "../services/project.service.js";
import * as authService from "../services/auth.service.js"

export async function listProjects(req, res) {
    const projects = await projectService.getAllProjects();
    res.render("home", { projects })
}

export async function getProject(req, res) {
    const project = await projectService.getProjectById(Number(req.params.id));
    res.render("projectDetail", { project })
}

export function renderAdd(req, res) {
    res.render("addProject");
}

export async function addProject (req, res) {
    await projectService.createProject({
        body: req.body,
        file: req.file,
        userId: req.userId
    })
    res.redirect('/home')
}

export async function getAccount(req, res) {
  const [user, {projects}] = await Promise.all([
    authService.getUserById(req.userId),
    projectService.getProjectsByUser(req.userId)
  ])
  res.render("account", {user, projects});
}

export async function editProject(req, res) {
  await projectService.updateProject(req.params.id, req.body, req.userId);
  res.redirect(`/account/${req.userName}`);
}

export async function deleteProject(req, res) {
  await projectService.deleteProject(Number(req.params.id));
  res.redirect(`/account/${req.userName}`);
}

export async function filter(req, res) {
    const projects = await projectService.filterProjects(incudeTechs, excludeTechs);
    res.render("home", { projects })
}