import * as authService from "../services/auth.service.js";

export function renderRegister(req, res) {
  res.render("register");
}

export function renderLogin(req, res) {
  res.render("login");
}

export async function register(req, res) {
  await authService.register(req.body);
  res.redirect("/login");
}

export async function login(req, res) {
  const token = await authService.login(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.redirect("/add");
}
