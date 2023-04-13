import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Lorem
} from '@chakra-ui/react'


function ManualClose() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Edit Modal
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>Cancel</Button>
            <Button colorScheme="red" onClick={() => { deleteAddress(address.id) }}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ManualClose