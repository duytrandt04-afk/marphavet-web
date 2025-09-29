import {
	Box,
	Button,
	Container,
	Heading,
	Input,
	useColorModeValue,
	useToast,
	VStack,
	HStack,
	IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useProductStore } from "../store/product";

const CreatePage = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		price: "",
		description: "",
		images: [""],
	});

	const toast = useToast();
	const { createProduct } = useProductStore();

	const handleAddProduct = async () => {
		const { success, message } = await createProduct(newProduct);
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
		setNewProduct({ name: "", price: "", description: "", images: [""] });
	};

	const handleImageChange = (index, value) => {
		const updatedImages = [...newProduct.images];
		updatedImages[index] = value;
		setNewProduct({ ...newProduct, images: updatedImages });
	};

	const handleAddImageField = () => {
		setNewProduct({ ...newProduct, images: [...newProduct.images, ""] });
	};

	const handleRemoveImageField = (index) => {
		const updatedImages = newProduct.images.filter((_, i) => i !== index);
		setNewProduct({ ...newProduct, images: updatedImages });
	};

	return (
		<Container maxW={"container.sm"}>
			<VStack spacing={8}>
				<Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
					Tạo sản phẩm mới
				</Heading>

				<Box
					w={"full"}
					bg={useColorModeValue("white", "gray.800")}
					p={6}
					rounded={"lg"}
					shadow={"md"}
				>
					<VStack spacing={4}>
						<Input
							placeholder="Tên sản phẩm"
							name="name"
							value={newProduct.name}
							onChange={(e) =>
								setNewProduct({ ...newProduct, name: e.target.value })
							}
						/>
						<Input
							placeholder="Giá sản phẩm"
							name="price"
							type="number"
							value={newProduct.price}
							onChange={(e) =>
								setNewProduct({ ...newProduct, price: e.target.value })
							}
						/>

						{/* Dynamic Images Input */}
						{newProduct.images.map((img, index) => (
							<HStack key={index} w="full">
								<Input
									placeholder={`Link ảnh #${index + 1}`}
									value={img}
									onChange={(e) => handleImageChange(index, e.target.value)}
								/>
								{newProduct.images.length > 1 && (
									<IconButton
										aria-label="Remove image"
										icon={<DeleteIcon />}
										colorScheme="red"
										onClick={() => handleRemoveImageField(index)}
									/>
								)}
							</HStack>
						))}
						<Button
							leftIcon={<AddIcon />}
							onClick={handleAddImageField}
							variant="outline"
							w="full"
						>
							Thêm ảnh
						</Button>

						<Input
							placeholder="Mô tả sản phẩm"
							name="description"
							value={newProduct.description}
							onChange={(e) =>
								setNewProduct({ ...newProduct, description: e.target.value })
							}
						/>
						<Button colorScheme="blue" onClick={handleAddProduct} w="full">
							Thêm sản phẩm
						</Button>
					</VStack>
				</Box>
			</VStack>
		</Container>
	);
};
export default CreatePage;
