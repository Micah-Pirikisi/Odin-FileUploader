import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

export function loginPage(req, res) {
  res.render("login");
}

export function registerPage(req, res) {
  res.render("register");
}

export async function register(req, res) {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });

  res.redirect("/login");
}

export function logout(req, res) {
  req.logout(() => {
    res.redirect("/login");
  });
}
