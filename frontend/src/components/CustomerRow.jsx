import React from 'react'
import {
    Tr, Td,
    Text, HStack, Box, Badge, Avatar, Flex, IconButton,
    Tooltip, useToast, MenuItem, Portal, useColorModeValue,
    Menu, MenuButton, MenuList
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FiEye, FiTrash2, FiPhone, FiMapPin, FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCustomer } from "../store/customer";

const CustomerRow = ({ customer, index, onView }) => {
    const toast = useToast();
    const avatarColors = ["blue", "green", "purple", "orange", "pink", "teal"];
    const colorScheme = avatarColors[index % avatarColors.length];
    const hoverBg = useColorModeValue("gray.50", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { deleteCustomer, updateCustomerStatus } = useCustomer();
    
    const getInitials = (name) => {
        return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const getLabel = (value) => {
        switch (value) {
            case "pending":
                return "Pending";
            case "processing":
                return "Processing";
            case "done":
                return "Done";
            default:
                return "";
            }
    };

    const getColor = (value) => {
        switch (value) {
            case "pending":
                return "red";
            case "processing":
                return "yellow";
            case "done":
                return "green";
            default:
                return "gray";
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        const { success, message } = await deleteCustomer(customerId);
        toast({
            title: success ? "Success" : "Error",
            description: message,
            status: success ? "success" : "error",
            duration: 3000,
            isClosable: true,
            colorScheme: success ? "green" : "red",
        });
    };

    return (
        <Tr 
            _hover={{ bg: hoverBg, transform: "translateY(-1px)" }}
            transition="all 0.2s"
            borderBottom="1px"
            borderColor={borderColor}
        >
            <Td py={4} px={6}>
                <Flex align="center" gap={3}>
                    <Avatar
                        size="md"
                        name={customer.name}
                        bg={`${colorScheme}.500`}
                        color="white"
                        fontWeight="bold"
                        getInitials={(name) => getInitials(name)}
                    />
                    <Box>
                        <Text
                            fontWeight="bold"
                            fontSize="md"
                            mb={1}
                            overflow={"hidden"}
                            textOverflow="ellipsis"
                            maxW="180px"
                        >
                            {customer.name}
                        </Text>

                        {/* Status Selector */}
                        <Menu>
                            <MenuButton
                                as={Badge}
                                px={3}
                                py={1}
                                rounded="full"
                                cursor="pointer"
                                colorScheme={getColor(customer.status)}
                                w="115px"
                                textAlign="center"
                            >
                                <Flex align="center" justify="center" gap={1}>
                                    <Text fontSize="xs" fontWeight="semibold">
                                        {getLabel(customer.status)}
                                    </Text>
                                    <ChevronDownIcon boxSize={3} />
                                </Flex>
                            </MenuButton>

                            <Portal>
                                <MenuList>
                                    <MenuItem
                                        bg={customer.status === "pending" ? "gray.100" : ""}
                                        _hover={{ bg: "gray.100" }}
                                        onClick={() => updateCustomerStatus(customer._id, "pending")}
                                    >
                                        Pending
                                    </MenuItem>
                                    <MenuItem
                                        bg={customer.status === "processing" ? "gray.100" : ""}
                                        _hover={{ bg: "gray.100" }}
                                        onClick={() => updateCustomerStatus(customer._id, "processing")}
                                    >
                                        Processing
                                    </MenuItem>
                                    <MenuItem
                                        bg={customer.status === "done" ? "gray.100" : ""}
                                        _hover={{ bg: "gray.100" }}
                                        onClick={() => updateCustomerStatus(customer._id, "done")}
                                    >
                                        Done
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Td>
            <Td py={4} px={6}>
                <Flex align="center" gap={2}>
                <Box 
                    p={1} 
                    bg={`${colorScheme}.100`} 
                    rounded="md"
                    color={`${colorScheme}.600`}
                >
                    <FiPhone size={14} />
                </Box>
                <Text fontFamily="mono" fontWeight="medium" overflow={"hidden"} textOverflow="ellipsis" maxW="180px">
                    {customer.phoneNumber}
                </Text>
                </Flex>
            </Td>
            <Td py={4} px={6}>
                <Flex align="center" gap={2}>
                <Box 
                    p={1} 
                    bg="orange.100" 
                    rounded="md"
                    color="orange.600"
                >
                    <FiMapPin size={14} />
                </Box>
                <Text color="gray.600" fontSize="sm" noOfLines={2} overflow={"hidden"} textOverflow="ellipsis" maxW="180px">
                    {customer.address}
                </Text>
                </Flex>
            </Td>
            
            <Td py={4} px={6}>
                <HStack spacing={2}>
                    <Tooltip>
                        <Link to={"/product/" + customer.product} target="_blank" rel="noopener noreferrer">
                            <Text color="gray.600" fontSize="sm" noOfLines={2} overflow={"hidden"} textOverflow="ellipsis" maxW="180px">
                                {customer.product}
                            </Text>
                        </Link>
                    </Tooltip>
                </HStack>
            </Td>
            <Td>
                <HStack spacing={2}>
                    <Tooltip label="Xem chi tiết">
                        <IconButton
                            size="sm"
                            icon={<FiEye />}
                            colorScheme="blue"
                            variant="ghost"
                            rounded="full"
                            _hover={{ bg: "blue.100", transform: "scale(1.1)" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onView?.(customer)
                            }}
                        />
                    </Tooltip>
                    <Tooltip label="Ghi chú">
                        <IconButton
                            size="sm"
                            icon={<FiEdit3 />}
                            colorScheme="white"
                            variant="ghost"
                            rounded="full"
                            _hover={{ bg: "green.100", transform: "scale(1.1)" }}
                        />
                    </Tooltip>
                    <Tooltip label="Xóa khách hàng">
                        <IconButton
                            size="sm"
                            icon={<FiTrash2 />}
                            colorScheme="red"
                            variant="ghost"
                            rounded="full"
                            _hover={{ bg: "red.100", transform: "scale(1.1)" }}
                            onClick={() => {handleDeleteCustomer?.(customer._id)}}
                        />
                    </Tooltip>
                </HStack>
            </Td>
        </Tr>

        
    )
}

export default CustomerRow