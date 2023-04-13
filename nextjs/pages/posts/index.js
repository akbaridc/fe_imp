//layout
import Layout from "../../component/layout";
import { useState } from 'react';
// import Modal from "../../component/Modal/form";

//import Link
import { useRouter } from 'next/router';
import getConfig from 'next/config';

//import axios
import axios from "axios";

import {
  Flex,
  Button,
  Container,
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  SimpleGrid,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage
} from '@chakra-ui/react'

//fetch with "getServerSideProps"
export async function getServerSideProps() {

  //http request
  const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts`)
  const res = await req.data.data.data

  return {
    props: {
      posts: res
    },
  }
}

function PostIndex(props) {

  //destruct
  const { posts } = props;

  //router
  const router = useRouter();


  // const { isOpen, onOpen, onClose } = useDisclosure()
  const [id, setId] = useState('');
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  //state validation
  const [validation, setValidation] = useState({});


  //refresh data
  const refreshData = () => {
    router.replace(router.asPath);
  }


  const ConditionalWrapper = ({ children }) => {
    return posts.length == 0 ? (
      <Alert status='error' w='100%' mt={3}>
        <AlertIcon />
        Data Post Not Available
      </Alert>
    ) : (
      children
    )
  }

  const handleFileChange = (e) => {

    //define variable for get value image data
    const imageData = e.target.files[0]

    //check validation file
    if (!imageData.type.match('image.*')) {

      //set state "image" to null
      setImage('');

      return
    }

    //assign file to state "image"
    setImage(imageData);
  }

  const storePost = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append('image', image);
    formData.append('title', title);
    formData.append('content', content);

    await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts`, formData)
      .then((response) => {
        alert(response.message)
        //redirect
        location.reload();

      })
      .catch((error) => {
        setValidation(error.response.data);
      })
  };

  //function "deletePost"
  const editPost = async (id) => {

    //sending
    const req = await axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${id}`)
    const response = await req

    if (response.status !== 200) {
      alert(response.data.message)
      return false;
    }

    setId(response.data.data.id)
    setTitle(response.data.data.title)
    setContent(response.data.data.content)
    setMode('edit')

    handleOpen()

  }

  const updatePost = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append('image', image);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('_method', 'PUT');

    //send data to server
    await axios.post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${id}`, formData)
      .then((response) => {
        if (response.status !== 200) alert('error, please try again')

        alert(response.data.message)
        //redirect
        handleClose()
        refreshData();

      })
      .catch((error) => {

        //assign validation on state
        setValidation(error.response.data);
      })

  };


  //function "deletePost"
  const deletePost = async (id) => {

    //sending
    await axios.delete(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/posts/${id}`);

    //refresh data
    refreshData();

  }


  return (
    <Layout>
      <Container maxW="1200px">
        <Button colorScheme="teal" mt='2' onClick={handleOpen} onChange={() => setMode('add')}>
          Add Data
        </Button>


        <ConditionalWrapper>
          <SimpleGrid spacing={4} mt='5' templateColumns='repeat(auto-fill, minmax(300px, 1fr))'>
            {posts.map((post, index) => {
              return (
                <Card maxW='sm' key={index}>
                  <CardBody>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BACKEND}/storage/posts/${post.image}`}
                      borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                      <Heading size='md'>{post.title}</Heading>
                      <Text>
                        {post.content}
                      </Text>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <ButtonGroup spacing='2'>
                      <Button variant='solid' colorScheme='blue' onClick={() => editPost(post.id)}>
                        Edit
                      </Button>
                      <Button variant='solid' colorScheme='red' onClick={() => deletePost(post.id)}>
                        Delete
                      </Button>
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              )
            })}
          </SimpleGrid>
        </ConditionalWrapper>

      </Container>


      <Modal isOpen={isOpen} onClose={handleClose} size='2xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
              {
                validation.title && <p style={{ color: 'red' }}>{validation.title[0]}</p>
              }
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea placeholder='content' value={content} onChange={(e) => setContent(e.target.value)} />
              {
                validation.content && <p style={{ color: 'red' }}>{validation.content[0]}</p>
              }
            </FormControl>

            <FormControl>
              <FormLabel>Image</FormLabel>
              <input type='file' onChange={handleFileChange}></input>
              {validation.image && (
                <p style={{ color: 'red' }}>{validation.image[0]}</p>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>Cancel</Button>
            <Button colorScheme="green" onClick={mode == 'add' ? storePost : updatePost}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout >
  )
}

export default PostIndex