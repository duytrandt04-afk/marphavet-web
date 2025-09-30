import React, { useEffect, useState, useRef } from "react";
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
  FormControl,
  FormLabel,
  useToast,
  Flex,
  Badge,
  IconButton,
  Select,
} from "@chakra-ui/react";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useCustomer } from "../store/customer";
import { useProductStore } from "../store/product";
import { motion } from "framer-motion"; // AnimatePresence is no longer needed

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const ProductPage = () => {
  const { id } = useParams();
  const { fetchProductById, selectedProduct } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [newCustomer, setnewCustomer] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    product: id,
  });
  const toast = useToast();
  const { createCustomer } = useCustomer();
  const orderFormRef = useRef(null);

  // *** SIMPLIFIED SLIDER STATE & LOGIC ***
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      await fetchProductById(id);
      setLoading(false);
    };
    if (id) loadProduct();
  }, [id, fetchProductById]);

  // *** SIMPLIFIED SLIDER FUNCTION ***
  const goToNextImage = () => {
    if (!selectedProduct?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % selectedProduct.images.length
    );
  };

  // *** SIMPLIFIED SLIDER FUNCTION ***
  const goToPrevImage = () => {
    if (!selectedProduct?.images?.length) return;
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + selectedProduct.images.length) % selectedProduct.images.length
    );
  };
  
  // *** DOTS CLICK HANDLER ***
  const goToImage = (index) => {
    if (!selectedProduct?.images?.length) return;
    setCurrentImageIndex(index);
  }

  const handleAddCustomer = async () => {
    const { success, message } = await createCustomer(newCustomer);
    toast({
      title: success ? "Thành công" : "Lỗi",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });
    if (success) {
      setnewCustomer({ name: "", phoneNumber: "", address: "", product: id });
    }
  };

  const scrollToForm = () => {
    if (orderFormRef.current) {
      orderFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!selectedProduct) {
    return <Box p={8}>Product not found 😢</Box>;
  }

  const images = selectedProduct.images || [];

  // Helper to format the large price numbers
  const formatPrice = (price) => {
    const millionPrice = price / 1000000;
    if (millionPrice > 1) {
      return millionPrice.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + 'M' + 'đ';
    }
    return price.toLocaleString('vi-VN') + 'đ';
  };
  
  const formattedPrice = formatPrice(selectedProduct.price);
  const formattedRetailPrice = formatPrice(selectedProduct.price * 1.67);

  return (
    <Box maxW="md" mx="auto" bg="white" minH="100vh">
      {/* Top Image Slider - SIMPLIFIED SNAP EFFECT */}
      <Box 
        position="relative" 
        w="100%" 
        overflow="hidden" 
        h="400px" 
        bg="white"
      >
        <Box
          // Use a simple box to contain the images
          w="100%" 
          h="100%"
        >
          {/* Simple Image rendering with index - No AnimatePresence needed */}
          {images.map((image, index) => (
            <MotionBox
              key={index}
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              // Visibility controlled by opacity/zIndex for a snap effect
              initial={{ opacity: 0, zIndex: 0 }}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                zIndex: index === currentImageIndex ? 1 : 0
              }}
              // Simple and fast transition for 'snap'
              transition={{ duration: 0.3 }} 
            >
              <Image
                src={image}
                alt={`${selectedProduct.name}-${index}`}
                w="100%"
                h="100%"
                objectFit="contain"
                userSelect="none"
                draggable="false"
              />
            </MotionBox>
          ))}
        </Box>

        {/* Left Button */}
        {images.length > 1 && (
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon boxSize={8} />}
            onClick={goToPrevImage} // SIMPLIFIED HANDLER
            position="absolute"
            top="50%"
            left="4"
            transform="translateY(-50%)"
            bg="rgba(255, 255, 255, 0.9)"
            _hover={{ bg: "white", transform: "translateY(-50%) scale(1.1)" }}
            rounded="full"
            zIndex={2}
            size="lg"
            shadow="md"
          />
        )}

        {/* Right Button */}
        {images.length > 1 && (
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon boxSize={8} />}
            onClick={goToNextImage} // SIMPLIFIED HANDLER
            position="absolute"
            top="50%"
            right="4"
            transform="translateY(-50%)"
            bg="rgba(255, 255, 255, 0.9)"
            _hover={{ bg: "white", transform: "translateY(-50%) scale(1.1)" }}
            rounded="full"
            zIndex={2}
            size="lg"
            shadow="md"
          />
        )}
      </Box>

      {/* Dots */}
      <Flex justify="center" mt={4} gap={2} pb={3} bg="white">
        {images.map((_, idx) => (
          <Box
            key={idx}
            w={idx === currentImageIndex ? 6 : 2} // Use currentImageIndex
            h={2}
            rounded="full"
            bg={idx === currentImageIndex ? "red.500" : "gray.300"} // Use currentImageIndex
            cursor="pointer"
            onClick={() => goToImage(idx)} // Use goToImage
            transition="all 0.3s"
          />
        ))}
      </Flex>

      {/* Price Banner */}
      <Box
        bgGradient="linear(to-r, red.500, pink.500)"
        color="white"
        py={4}
        px={5}
      >
        <HStack spacing={3} align="center">
          <Text fontSize="xs" fontWeight="semibold" bg="white" color="red.500" px={2} py={1} rounded="md" minW="max-content">
            🏷️ Giá bán
          </Text>
          <Box minW="0"> 
            <Text fontSize="2xl" fontWeight="bold">
              {formattedPrice}
            </Text>
            <Text fontSize="sm" as="s" opacity={0.9}>
              Giá niêm yết: {formattedRetailPrice}
            </Text>
          </Box>
          <Badge 
            colorScheme="yellow" 
            fontSize={{ base: "xs", md: "md" }} 
            px={2} 
            py={1}
            whiteSpace="normal"
            textAlign="center"
          >
            Ưu đãi 40% dùy nhất hôm nay
          </Badge>
        </HStack>
      </Box>

      {/* Product Info */}
      <Box bg="white" p={5} mt={2}>
        <Heading size="lg" mb={3}>{selectedProduct.name}</Heading>
        <HStack spacing={4} flexWrap="wrap">
          <HStack spacing={1}>
            <StarIcon color="yellow.400" />
            <Text fontSize="sm" fontWeight="semibold">4.9/5</Text>
            <Text fontSize="sm" color="blue.500">(4.3k)</Text>
          </HStack>
          <Text fontSize="sm" color="gray.600">
            | Đã bán 7.2k
          </Text>
          <Badge colorScheme="cyan" fontSize="xs">🚚 Miễn phí vận chuyển</Badge>
        </HStack>

        {/* Product badges */}
        <HStack mt={4} spacing={2} flexWrap="wrap">
          <Badge colorScheme="orange" variant="subtle" px={3} py={1}>
            🏆 Sản phẩm hàng đầu
          </Badge>
          <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
            📦 Nhận hàng thanh toán
          </Badge>
          <Badge colorScheme="green" variant="subtle" px={3} py={1}>
            🔄 Đổi trả dễ dàng
          </Badge>
        </HStack>

        <Text mt={4} color="gray.700" lineHeight="tall">
          {selectedProduct.description}
        </Text>
      </Box>

      {/* Seller Info */}
      <Box bg="white" p={5} mt={2}>
        <HStack mb={3}>
          <Box
            w="50px"
            h="50px"
            bg="green.500"
            rounded="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="xl"
            color="white"
          >
            T3
          </Box>
          <Box>
            <Text fontWeight="bold">Thanhbinh.online</Text>
            <Badge colorScheme="green" fontSize="xs">4.9</Badge>
          </Box>
        </HStack>
        <Text fontSize="sm" color="gray.600" fontStyle="italic">
          Tự hào là công ty chuyên cung cấp các sản phẩm gia dụng chất lượng cao, giá cả hợp lí từ năm 2013.
          Thông tin chi tiết xin liên hệ hotline: 0365.681.196
        </Text>
      </Box>

      {/* Product Introduction Card */}
      <Box bg="gray.600" p={6} mt={2} textAlign="center" color="white">
        <Heading size="md" color="orange.300" mb={4}>
          {selectedProduct.name.toUpperCase()}
        </Heading>
        <Text fontSize="sm" mb={4}>
          Giá treo thế hệ mới, phong cách tối giản nhưng vẫn mang lại đầy đủ tiện ích khi sử dụng. 
          Giúp phòng ngủ luôn gọn gàng
        </Text>
        <Box position="relative" w="100%" h="250px">
          <Image
            src={images[0]}
            alt={selectedProduct.name}
            w="100%"
            h="100%"
            objectFit="contain"
          />
        </Box>
      </Box>

      {/* Customer Review Section */}
      <Box bg="white" p={5} mt={2}>
        <Heading size="md" mb={4}>
          Đánh giá của khách hàng (46.3k)
        </Heading>
        <HStack mb={3}>
          <Text fontSize="2xl" fontWeight="bold">4.9/5</Text>
          <HStack spacing={0}>
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} color="yellow.400" boxSize={4} />
            ))}
          </HStack>
        </HStack>
        
        <Box borderWidth={1} borderColor="gray.200" rounded="lg" p={4}>
          <HStack mb={2}>
            <Image
              boxSize="45px"
              rounded="full"
              src="https://via.placeholder.com/45"
              alt="Customer"
            />
            <Box>
              <Text fontWeight="bold">Phúc Đỗ</Text>
              <HStack spacing={0}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} color="yellow.400" boxSize={3} />
                ))}
              </HStack>
            </Box>
          </HStack>
          <Text fontSize="sm" color="gray.700">
            Sản phẩm rất tốt, chắc chắn. Đóng gói cẩn thận, giao hàng nhanh. Rất hài lòng!
          </Text>
        </Box>

        <Button mt={3} variant="outline" colorScheme="blue" size="sm" w="full">
          Xem thêm →
        </Button>
      </Box>

      {/* Order Form */}
      <Box bg="white" p={5} mt={2} ref={orderFormRef}> 
        <Heading size="md" mb={4}>
          Đặt hàng ngay 🚀
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="semibold">Họ và tên</FormLabel>
            <Input
              placeholder="Nhập họ và tên"
              value={newCustomer.name}
              onChange={(e) =>
                setnewCustomer({ ...newCustomer, name: e.target.value })
              }
              size="lg"
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="semibold">Số điện thoại nhận hàng</FormLabel>
            <Input
              type="tel"
              placeholder="Nhập số điện thoại"
              value={newCustomer.phoneNumber}
              onChange={(e) =>
                setnewCustomer({
                  ...newCustomer,
                  phoneNumber: e.target.value,
                })
              }
              size="lg"
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="semibold">Địa chỉ nhận hàng</FormLabel>
            <Input
              placeholder="Nhập địa chỉ"
              value={newCustomer.address}
              onChange={(e) =>
                setnewCustomer({ ...newCustomer, address: e.target.value })
              }
              size="lg"
              borderColor="gray.300"
            />
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="semibold">Chọn sản phẩm</FormLabel>
            <Select size="lg" borderColor="gray.300" defaultValue={id}>
              <option value={id}>{selectedProduct.name}</option>
            </Select>
          </FormControl>

          <Button
            colorScheme="green"
            size="lg"
            w="full"
            onClick={handleAddCustomer} 
            fontWeight="bold"
            py={7}
          >
            ĐẶT HÀNG
          </Button>
        </VStack>
      </Box>

      {/* Contact Info Footer */}
      <Box bg="white" p={5} mt={2}>
        <HStack mb={3}>
          <Box
            w="50px"
            h="50px"
            bg="green.500"
            rounded="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="xl"
            color="white"
          >
            T3
          </Box>
          <Text fontWeight="bold" fontSize="lg" color="green.600">
            Thanhbinh Store
          </Text>
        </HStack>

        <Text fontWeight="bold" mb={2}>LIÊN HỆ VỚI CHÚNG TÔI</Text>
        <VStack align="start" spacing={2} fontSize="sm" color="gray.700">
          <HStack>
            <Text>🏠</Text>
            <Text>TDP Vĩnh Thịnh, Lộp Thạch, Vĩnh Phúc</Text>
          </HStack>
          <HStack>
            <Text>📞</Text>
            <Text fontWeight="semibold">Hotline: 0365.681.196</Text>
          </HStack>
          <HStack>
            <Text>🌐</Text>
            <Text color="blue.500">Website: https://www.thanhbinh.asia/</Text>
          </HStack>
        </VStack>

        <Divider my={4} />

        <Text fontWeight="bold" mb={2}>DỊCH VỤ KHÁCH HÀNG</Text>
        <VStack align="start" spacing={2} fontSize="sm" color="gray.700">
          <HStack>
            <Text>🚚</Text>
            <Text>Chính sách vận chuyển</Text>
          </HStack>
          <HStack>
            <Text>🛡️</Text>
            <Text>Chính sách bảo mật</Text>
          </HStack>
          <HStack>
            <Text>💬</Text>
            <Text>Kết nối</Text>
          </HStack>
          <HStack>
            <Text>📋</Text>
            <Text>Chính sách bảo hành</Text>
          </HStack>
        </VStack>

        <HStack mt={4} spacing={3}>
          <Image src="https://via.placeholder.com/50x30?text=VISA" alt="Visa" />
          <Image src="https://via.placeholder.com/50x30?text=MC" alt="Mastercard" />
          <Image src="https://via.placeholder.com/50x30?text=ATM" alt="ATM" />
          <Image src="https://via.placeholder.com/50x30?text=COD" alt="COD" />
        </HStack>
      </Box>

      {/* Sticky Buy Button - With Pumping Effect and Scroll Function */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        // 👇 Change bg="gray.50" to bg="transparent"
        bg="transparent" 
        p={3}
        textAlign="center"
        maxW="md"
        mx="auto"
        shadow="none" 
        zIndex={10}
      >
        <MotionButton
          colorScheme="yellow"
          w="full"
          size="lg"
          onClick={scrollToForm}
          fontWeight="bold"
          fontSize="md"
          py={6}
          // Pumping Animation
          animate={{ 
            scale: [1, 1.1, 1], 
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: Infinity, 
            repeatType: "loop",
          }}
        >
          MUA NGAY HÔM NAY NHẬN ƯU ĐÃI 40%
        </MotionButton>
      </Box>
    </Box>
  );
};

export default ProductPage;