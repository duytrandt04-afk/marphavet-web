import {
    Table, Tbody, Tr, Td, TableContainer, Text, Box,
    useColorModeValue, useToast, useDisclosure, Divider,
    Modal, ModalOverlay, ModalContent, ModalHeader, Flex,
    ModalBody, ModalCloseButton, ModalFooter, Button, Image,
    Menu, MenuButton, MenuList, MenuItem, IconButton
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import { useProductStore } from "../store/product";
import { useState } from "react";
import TableHeader from "./TableHeader";
import CustomerRow from "./CustomerRow";

const CustomersTable = ({ customers = [] }) => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const { fetchProductById } = useProductStore();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [filter, setFilter] = useState("all");

    const onView = async (customer) => {
        setSelectedCustomer(customer);

        if (!customer?.product) {
            setSelectedProduct(null);
            onOpen();
        return;
    }

    const { success, data, message } = await fetchProductById(customer.product);
        if (!success) {
            toast({
                title: "Error",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setSelectedProduct(data);
        onOpen();
    };
    
    const filteredCustomers = customers.filter((c) => {
        if (filter === "all") return true;
        return c.status === filter;
    });

    const EmptyState = () => (
        <Tbody>
        <Tr>
            <Td colSpan={5} py={16}>
            <Box textAlign="center">
                <Text fontSize="6xl" mb={4} opacity={0.3} paddingBottom={3}>📋</Text>
                <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
                {customers === null ? "Đang tải..." : "Chưa có khách hàng nào"}
                </Text>
                <Text color="gray.500" fontSize="sm">
                {customers === null
                    ? "Vui lòng đợi trong giây lát..."
                    : "Hãy đi tìm khách hàng đầu tiên của bạn"}
                </Text>
            </Box>
            </Td>
        </Tr>
        </Tbody>
    );

    return (
        <>
            <Flex w="100%" justify="center">
                <Box
                    w="100%"
                    maxW="1100px"
                    bg={bg}
                    rounded="xl"
                    shadow="lg"
                    overflow="hidden"
                    border="1px"
                    borderColor={borderColor}
                >
                    <Box px={6} py={4}>
                        <Flex justify="space-between" align="center">
                            <Box>
                                <Text fontSize="lg" fontWeight="bold">Danh sách khách hàng</Text>
                                <Text fontSize="sm" opacity={0.9}>
                                    {customers?.length > 0 ? `${customers.length} khách hàng` : "Chưa có dữ liệu"}
                                </Text>
                            </Box>

                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    icon={<FiFilter />}
                                    variant="outline"
                                    aria-label="Filter customers"
                                />
                                <MenuList>
                                    <MenuItem onClick={() => setFilter("all")}>Tất cả</MenuItem>
                                    <MenuItem onClick={() => setFilter("pending")}>Pending</MenuItem>
                                    <MenuItem onClick={() => setFilter("processing")}>Processing</MenuItem>
                                    <MenuItem onClick={() => setFilter("done")}>Done</MenuItem>
                                </MenuList>
                            </Menu>
                        </Flex>
                    </Box>

                    <TableContainer>
                        <Table variant="simple">
                            <TableHeader />
                                {filteredCustomers?.length > 0 ? (
                                    <Tbody>
                                        {filteredCustomers.map((customer, index) => (
                                            <CustomerRow
                                                key={customer._id}
                                                customer={customer}
                                                index={index}
                                                onView={onView}
                                            />
                                        ))}
                                    </Tbody>
                                ) : (
                                    <EmptyState />
                                )}
                        </Table>
                    </TableContainer>
                </Box>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Thông tin khách hàng</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {selectedCustomer && (
                                <Box mb={6}>
                                    <Text><b>Khách hàng:</b> {selectedCustomer.name}</Text>
                                    <Text><b>SĐT:</b> {selectedCustomer.phoneNumber}</Text>
                                    <Text><b>Địa chỉ:</b> {selectedCustomer.address}</Text>
                                </Box>
                            )}

                            <Divider my={8} />

                            {selectedProduct ? (
                                <Box>
                                    {selectedProduct.images?.length > 0 && (
                                    <Image
                                        src={selectedProduct.images[0]}
                                        alt={selectedProduct.name}
                                        borderRadius="md"
                                        mb={4}
                                    />
                                    )}
                                    <Text><b>Tên sản phẩm:</b> {selectedProduct.name}</Text>
                                    <Text><b>Giá:</b> ${selectedProduct.price}</Text>
                                    <Text><b>Mô tả:</b> {selectedProduct.description}</Text>
                                </Box>
                                ) : (
                                    <Text>Chưa có sản phẩm đặt</Text>
                                )}
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose} colorScheme="blue">
                                Đóng
                            </Button>
                        </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CustomersTable;
