import prisma from "../lib/prisma.js";

export async function listFolders(req, res) {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  res.render("folders", { folders });
}

export async function createFolder(req, res) {
  await prisma.folder.create({
    data: {
      name: req.body.name,
      userId: req.user.id,
    },
  });

  res.redirect("/folders");
}

export async function viewFolder(req, res) {
  const folderId = Number(req.params.id);

  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
      userId: req.user.id,
    },
    include: { files: true },
  });

  if (!folder) return res.sendStatus(404);

  res.render("folder", { folder });
}

export async function renameFolder(req, res) {
  await prisma.folder.updateMany({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
    data: { name: req.body.name },
  });

  res.redirect("/folders");
}

export async function deleteFolder(req, res) {
  await prisma.folder.deleteMany({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
  });

  res.redirect("/folders");
}
