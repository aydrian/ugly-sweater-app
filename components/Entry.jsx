import {Box, Flex, Image, useColorModeValue} from "@chakra-ui/react";

export default function Entry({data}) {
  return (
    <Flex w="full" alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative">

        <Image
          src={`/api/getImage?entryId=${data.id}`}
          alt={`Picture of ${data.name}`}
          roundedTop="lg"
          boxSize="200px"
          objectFit="cover"
        />

        <Box p="6">
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated>
              {data.name}
            </Box>
          </Flex>
          <Flex justifyContent="space-between" alignContent="center">
            <Box d="flex" alignItems="center">
              <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {data.votes.length} vote{data.votes.length > 1 && 's'}
              </Box>
            </Box>
            
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}