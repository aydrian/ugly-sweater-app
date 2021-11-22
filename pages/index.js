import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Container,
  Heading,
  Link,
  ListItem,
  UnorderedList
} from "@chakra-ui/react";

export default function Home() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    fetch("/api/contests")
      .then((res) => res.json())
      .then((data) => {
        setContests(data);
      });
  }, []);

  return (
    <Container>
      <Heading>Ugly Sweater Contest</Heading>
      <Heading as="h3">Contests</Heading>
      <UnorderedList>
        {contests.map((contest) => {
          return (
            <ListItem>
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
