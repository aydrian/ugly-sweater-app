import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { entryId } = req.query;
  console.log(entryId);

  const findEntry = await prisma.entries.findUnique({
    select: {
      picture: true,
      picture_type: true
    },
    where: {
      id: entryId
    }
  });
  if (!findEntry) {
    return res.status(404).send("Entry does not exist.");
  }

  res.setHeader("Content-Type", findEntry.picture_type);
  res.setHeader("Content-Length", findEntry.picture.length.toString());
  res.status(200).send(findEntry.picture);
}
