import { PrismaClient } from "@prisma/client";
import { pusher } from "../lib/pusher";

const prisma = new PrismaClient();

export const handler = async function (event, _context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method Not Allowed"
    };
  }

  const { payload } = JSON.parse(event.body);

  for (const item of payload) {
    console.log(item);
    if (item.topic === "votes") {
      const entry = await prisma.entries.findUnique({
        where: {
          id: item.after.entry_id
        },
        select: {
          id: true,
          name: true,
          votes: true
        }
      });

      await pusher.trigger(item.after.contest_id, "vote", entry);
    } else if (item.topic === "entries") {
      const entry = await prisma.entries.findUnique({
        where: { id: item.after.id },
        select: {
          id: true,
          name: true,
          votes: true
        }
      });
      await pusher.trigger(item.after.contest_id, "new-entry", entry);
    }
  }

  return {
    statusCode: 200
  };
};
