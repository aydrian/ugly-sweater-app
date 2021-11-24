import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import NextLink from "next/link";
import Head from "next/head";
import {
  Box,
  Container,
  Heading,
  Flex,
  Link,
  Text,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import { PrismaClient } from "@prisma/client";

import Entry from "@components/Entry";

const prisma = new PrismaClient();

const Contest = ({ contest }) => {
  const [entries, setEntries] = useState(contest.entries);

  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
    });

    const channel = pusher.subscribe(contest.id);
    channel.bind("new-entry", function (data) {
      setEntries((prevState) => [...prevState, data]);
    });

    channel.bind("vote", function (data) {
      setEntries((prevState) =>
        prevState.map((entry) => (entry.id === data.id ? data : entry))
      );
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  return (
    <Container maxW="container.lg">
      <Head>
        <title>Ugly Sweater Contest: {contest.name}</title>
      </Head>
      <Flex my={4} justify="space-between">
        <Box>
          <Heading>Contest: {contest.name}</Heading>
          <Text>
            To enter, text a picture with {contest.name} and your name to{" "}
            {process.env.NEXT_PUBLIC_TWILIO_NUMBER}.
          </Text>
          <Text>
            To vote, text {contest.name} and the name of the entry to{" "}
            {process.env.NEXT_PUBLIC_TWILIO_NUMBER}.
          </Text>
        </Box>
        <NextLink href={`/`} passHref>
          <Link>Back to Contests</Link>
        </NextLink>
      </Flex>
      <Wrap spacing="30px" justify="center">
        {entries.map((entry) => {
          return (
            <WrapItem key={entry.id}>
              <Entry data={entry} />
            </WrapItem>
          );
        })}
      </Wrap>
    </Container>
  );
};

export async function getServerSideProps(context) {
  const { contestId } = context.query;
  const contest = await prisma.contests.findUnique({
    select: {
      id: true,
      name: true,
      // BigInt problems
      // max_votes: true,
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

  return { props: { contest } };
}

export default Contest;
