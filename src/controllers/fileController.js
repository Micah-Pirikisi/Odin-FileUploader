import prisma from "../lib/prisma.js";
import path from "path";

export async function uploadFile(req, res) {
  const { folderId } = req.body;

  await prisma.file.create({
    data: {
      name: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      userId: req.user.id,
      folderId: folderId ? Number(folderId) : null,
    },
  });

  res.redirect(folderId ? `/folders/${folderId}` : "/folders");
}

export async function fileDetails(req, res) {
  const file = await prisma.file.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
  });

  if (!file) return res.sendStatus(404);

  res.render("file", { file });
}

export async function downloadFile(req, res) {
  const file = await prisma.file.findFirst({
    where: {
      id: Number(req.params.id),
      userId: req.user.id,
    },
  });

  if (!file) return res.sendStatus(404);

  res.download(path.resolve(file.path), file.name);
}
