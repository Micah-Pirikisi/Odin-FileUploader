import prisma from "../lib/prisma.js";
import { v4 as uuidv4 } from "uuid";

// Create a share link
export const createShareLink = async (req, res) => {
  try {
    const { folderId, duration } = req.body; // duration like "1d", "10d"
    const days = parseInt(duration.replace("d", ""));
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const token = uuidv4(); // unique link

    const sharedFolder = await prisma.sharedFolder.create({
      data: {
        folderId,
        token,
        expiresAt,
      },
    });

    res.send(`Shareable link: ${req.protocol}://${req.get("host")}/share/${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating share link");
  }
};

// Access shared folder
export const accessSharedFolder = async (req, res) => {
  try {
    const { token } = req.params;

    const shared = await prisma.sharedFolder.findUnique({
      where: { token },
      include: { folder: { include: { files: true } } },
    });

    if (!shared || shared.expiresAt < new Date()) {
      return res.status(404).send("Link expired or invalid");
    }

    res.render("sharedFolder", { folder: shared.folder });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error accessing shared folder");
  }
};
