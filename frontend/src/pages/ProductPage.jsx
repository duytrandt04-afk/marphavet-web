import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Image, Heading, Text, Spinner } from "@chakra-ui/react";
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

    if (loading) return null;

    if (!selectedProduct) return <Box p={8}>Product not found 😢</Box>;

    return (
    <Box p={8}>
        <Image src={selectedProduct.image} alt={selectedProduct.name} maxH="300px" objectFit="cover" />
        <Heading mt={4}>{selectedProduct.name}</Heading>
        <Text fontSize="xl" mt={2} color="gray.600">
        ${selectedProduct.price}
        </Text>
    </Box>
    );
};

export default ProductPage;
