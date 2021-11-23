import NextLink from "next/link";
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
    <Container>
      <Heading>Ugly Sweater Contest</Heading>
      <Heading as="h3">Contests</Heading>
      <UnorderedList>
        {contests.map((contest) => {
          return (
            <ListItem key={contest.id}>
              <NextLink href={`/contests/${contest.id}`} passHref>
                <Link>{contest.name}</Link>
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
      name: true
    }
  });

  return { props: { contests } };
}
