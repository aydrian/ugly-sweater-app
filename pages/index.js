import NextLink from "next/link";
import Head from "next/head";
import {
  Container,
  Heading,
  Link,
  ListItem,
  UnorderedList
} from "@chakra-ui/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default function Home({ contests }) {
  return (
    <Container maxW="container.lg">
      <Head>
        <title>Ugly Sweater Contest</title>
      </Head>
      <Heading my={4}>Ugly Sweater Contest</Heading>
      <Heading as="h3" size="lg">
        Contests
      </Heading>
      <UnorderedList>
        {contests.map((contest) => {
          return (
            <ListItem key={contest.id}>
              <NextLink href={`/contests/${contest.id}`} passHref>
                <Link>
                  {contest.name} - {contest.entries.length}{" "}
                  {contest.entries.length === 1 ? "entry" : "entries"}
                </Link>
              </NextLink>
            </ListItem>
          );
        })}
      </UnorderedList>
    </Container>
  );
}

export async function getServerSideProps() {
  const contests = await prisma.contests.findMany({
    select: {
      id: true,
      name: true,
      entries: {
        select: {
          id: true
        }
      }
    }
  });

  return { props: { contests } };
}
