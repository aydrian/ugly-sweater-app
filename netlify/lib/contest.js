import { createHash } from "crypto";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const prisma = new PrismaClient();

const hashPhoneNumber = (phoneNumber) => {
  const hash = createHash("sha256");
  hash.update(phoneNumber);
  return hash.digest("hex");
};

const fetchMedia = async (media_url) => {
  const getMedia = await fetch(media_url).then((res) => res.arrayBuffer());
  return Buffer.from(getMedia);
};

export const createEntry = async (
  contest,
  entry,
  media_url,
  media_content_type
) => {
  const findContest = await prisma.contests.findFirst({
    select: {
      id: true
    },
    where: {
      name: contest
    }
  });
  if (!findContest) {
    return "Contest does not exist.";
  }
  const media_buffer = await fetchMedia(media_url);
  await prisma.entries.create({
    data: {
      name: entry,
      picture: media_buffer,
      picture_type: media_content_type,
      contest: {
        connect: { id: findContest.id }
      }
    }
  });

  return "Thank you for your entry. Good luck!";
};

export const vote = async (contest, entry, phoneNumber) => {
  const findContest = await prisma.contests.findFirst({
    select: {
      id: true,
      max_votes: true
    },
    where: {
      name: contest
    }
  });
  if (!findContest) {
    return "Contest does not exist.";
  }
  const findEntry = await prisma.entries.findFirst({
    select: {
      id: true
    },
    where: {
      contest_id: findContest.id,
      AND: {
        name: entry
      }
    }
  });
  if (!findEntry) {
    return "Entry for contest does not exist.";
  }

  const voter_id = hashPhoneNumber(phoneNumber);

  const voteCount =
    (await prisma.votes.count({
      where: { voter_id, AND: { contest_id: findContest.id } }
    })) || 0;

  if (voteCount >= findContest.max_votes) {
    return "Sorry, you don't have anymore votes left for this contest.";
  }

  await prisma.votes.create({
    data: {
      voter_id,
      contest_id: findContest.id,
      entry_id: findEntry.id
    }
  });

  const remainingVotes = findContest.max_votes - BigInt(voteCount) - BigInt(1);
  return `Thank you for your vote. Remaining votes for this contest: ${remainingVotes}`;
};
