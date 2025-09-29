import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Image,
    Heading,
    Text,
    Input,
    VStack,
    HStack,
    Spinner,
    Divider,
    Button,
    useColorModeValue,
    FormControl,
    FormLabel,
    useToast,
    Container,
} from "@chakra-ui/react";
import { useCustomer } from "../store/customer";
import { useProductStore } from "../store/product";

const ProductPage = () => {
    const { id } = useParams();
    const { fetchProductById, selectedProduct } = useProductStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const loadProduct = async () => {
        setLoading(true);
        await fetchProductById(id);
        setLoading(false);
    };
    if (id) loadProduct();
    }, [id, fetchProductById]);

    const [newCustomer, setnewCustomer] = useState({
		name: "",
		phoneNumber: "",
		address: "",
        product: id,
	});
	const toast = useToast();

	const { createCustomer } = useCustomer();

    const handleAddCustomer = async () => {
		const { success, message } = await createCustomer(newCustomer);
		if (!success) {
			toast({
				title: "Error",
				description: message,
				status: "error",
				isClosable: true,
			});
		} else {
			toast({
				title: "Success",
				description: message,
				status: "success",
				isClosable: true,
			});
		}
		setnewCustomer({ name: "", phoneNumber: "", address: "", product: id });
	};

    return (
        <Box
            maxW="4xl"
            mx="auto"
            p={8}
            bg={useColorModeValue("white", "gray.800")}
            rounded="2xl"
            shadow="lg"
        >
            {loading ? (
            <HStack justify="center" minH="50vh">
                <Spinner size="xl" />
            </HStack>
            ) : !selectedProduct ? (
                <Box p={8}>Product not found 😢</Box>
            ) : (
                <Container>
                    <HStack spacing={8} align="flex-start" flexDir={{ base: "column", md: "row" }}>
                        <HStack spacing={4} flex="1" overflowX="auto">
                            {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                selectedProduct.images.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        src={img}
                                        alt={`${selectedProduct.name} ${idx + 1}`}
                                        maxH="300px"
                                        rounded="lg"
                                        objectFit="cover"
                                    />
                                ))
                            ) : (
                                <Text>No images available</Text>
                            )}
                        </HStack>

                        <VStack align="start" spacing={4} flex="2">
                            <Heading>{selectedProduct.name}</Heading>
                            <Text fontSize="2xl" color="blue.500" fontWeight="bold">
                                ${selectedProduct.price}
                            </Text>
                            <Text color="gray.600">{selectedProduct.description}</Text>
                        </VStack>
                    </HStack>
                    
                    <Divider my={8} />

                    <Box>
                        <Heading size="md" mb={4}>
                            Đặt hàng ngay 🚀
                        </Heading>
                        <VStack spacing={4} align="stretch">

                            <FormControl>
                                <FormLabel>Họ và tên</FormLabel>
                                <Input
                                    placeholder="Nhập họ và tên của bạn" 
                                    value={newCustomer.name}
                                    onChange={(e) => setnewCustomer({ ...newCustomer, name: e.target.value })}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Số điện thoại</FormLabel>
                                <Input 
                                    type="number" 
                                    placeholder="Nhập số điện thoại"
                                    value={newCustomer.phoneNumber}
                                    onChange={(e) => setnewCustomer({ ...newCustomer, phoneNumber: e.target.value })} 
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Địa chỉ</FormLabel>
                                <Input 
                                    placeholder="Nhập địa chỉ giao hàng"
                                    value={newCustomer.address}
                                    onChange={(e) => setnewCustomer({ ...newCustomer, address: e.target.value })} 
                                />
                            </FormControl>

                            <Button colorScheme="blue" size="lg" rounded="lg" onClick={handleAddCustomer}>
                                Xác nhận đặt hàng
                            </Button>
                        </VStack>
                    </Box>
                </Container>
            )}
        </Box>
    );
};

export default ProductPage;
