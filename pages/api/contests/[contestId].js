import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default async function handler(req, res) {
  const { contestId } = req.query;

  const findContest = await prisma.contests.findUnique({
    select: {
      id: true,
      name: true,
      max_votes: true,
      entries: {
        select: {
          id: true,
          name: true,
          votes: true
        }
      }
    },
    where: {
      id: contestId
    }
  });
  if (!findContest) {
    return res.status(404).send("Contest does not exist.");
  }

  res.status(200).json(findContest);
}
