import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(_req, res) {
  const findManyContests = await prisma.contests.findMany({
    select: {
      id: true,
      name: true
    }
  });
  res.status(200).json(findManyContests);
}
