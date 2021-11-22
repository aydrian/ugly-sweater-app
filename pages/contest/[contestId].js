import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Heading,
  Image,
  ListItem,
  UnorderedList
} from "@chakra-ui/react";

const Contest = () => {
  const router = useRouter();
  const { contestId } = router.query;
  const [contest, setContest] = useState({});

  useEffect(() => {
    fetch(`/api/contests/${contestId}`)
      .then((res) => res.json())
      .then((data) => {
        setContest(data);
      });
  }, []);

  return (
    <Container>
      <Heading>Contest: {contest.name}</Heading>
      <UnorderedList>
        {contest.entries?.map((entry) => {
          return (
            <ListItem key={entry.id}>
              <Image src={`/api/getImage?entryId=${entry.id}`} />
              {entry.name} {entry.votes.length}
            </ListItem>
          );
        })}
      </UnorderedList>
    </Container>
  );
};

export default Contest;
