//import Link
import Link from 'next/link';

import { Box, Flex, Heading, Spacer, Container } from '@chakra-ui/react'

const Navbar = () => {
  return (

    <Box bg="gray.100" px={4}>
      <Container maxW="1200px">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Box>
            <Heading size="md">App Posts</Heading>
          </Box>
        </Flex>
      </Container>
    </Box >

  )
}

export default Navbar