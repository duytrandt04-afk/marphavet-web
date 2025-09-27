import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    HStack,
    Box,
    Badge,
    Avatar,
    Flex,
    IconButton,
    useColorModeValue,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { FiEye, FiTrash2, FiPhone, FiMapPin, FiUser, FiCheck } from "react-icons/fi";
import { useCustomer } from "../store/customer";

const CustomersTable = ({ customers = [] }) => {
    const bg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const hoverBg = useColorModeValue("gray.50", "gray.700");
    
    const { deleteCustomer } = useCustomer();
    const toast = useToast();
    const handleDeleteCustomer = async (customerId) => {
        const { success, message } = await deleteCustomer(customerId);
		toast({
			title: success ? "Success" : "Error",
			description: message,
			status: success ? "success" : "error",
			duration: 3000,
			isClosable: true,
            colorScheme: success? "green" : "red"
		});
    };

    const TableHeader = () => (
    <Thead>
        <Tr>
        <Th 
            py={4} 
            px={6} 
            bg={useColorModeValue("blue.50", "blue.900")} 
            color={useColorModeValue("blue.800", "blue.200")}
            fontWeight="bold"
            textTransform="none"
            fontSize="sm"
            letterSpacing="wide"
        >
            <Flex align="center" gap={2}>
            <FiUser />
                Khách hàng
            </Flex>
        </Th>
        <Th 
            py={4} 
            px={6} 
            bg={useColorModeValue("blue.50", "blue.900")} 
            color={useColorModeValue("blue.800", "blue.200")}
            fontWeight="bold"
            textTransform="none"
            fontSize="sm"
        >
            <Flex align="center" gap={2}>
            <FiPhone />
            Liên hệ
            </Flex>
        </Th>
        <Th 
            py={4} 
            px={6} 
            bg={useColorModeValue("blue.50", "blue.900")} 
            color={useColorModeValue("blue.800", "blue.200")}
            fontWeight="bold"
            textTransform="none"
            fontSize="sm"
        >
            <Flex align="center" gap={2}>
            <FiMapPin />
            Địa chỉ
            </Flex>
        </Th>
        <Th 
            py={4} 
            px={6} 
            bg={useColorModeValue("blue.50", "blue.900")} 
            color={useColorModeValue("blue.800", "blue.200")}
            fontWeight="bold"
            textTransform="none"
            fontSize="sm"
            textAlign="center"
        >
            Sản phẩm đã đặt
        </Th>
        <Th 
            py={4} 
            px={6} 
            bg={useColorModeValue("blue.50", "blue.900")} 
            color={useColorModeValue("blue.800", "blue.200")}
            fontWeight="bold"
            textTransform="none"
            fontSize="sm"
            textAlign="center"
        >
            Thao tác
        </Th>
        </Tr>
    </Thead>
    );

    const EmptyState = () => (
    <Tbody>
        <Tr>
            <Td colSpan={4} py={16} textAlign="center">
                <Box>
                    <Text fontSize="6xl" mb={4} opacity={0.3}>📋</Text>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.600" mb={2}>
                        {customers === null ? "Đang tải..." : "Chưa có khách hàng nào"}
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        {customers === null 
                            ? "Vui lòng đợi trong giây lát..." 
                            : "Hãy thêm khách hàng đầu tiên của bạn"
                        }
                    </Text>
                </Box>
            </Td>
        </Tr>
    </Tbody>
    );

    const CustomerRow = ({ customer, index }) => {
        const getInitials = (name) => {
            return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
        };

        const avatarColors = ["blue", "green", "purple", "orange", "pink", "teal"];
        const colorScheme = avatarColors[index % avatarColors.length];

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
                    <Text fontWeight="bold" fontSize="md" mb={1}>
                    {customer.name}
                    </Text>
                    <Badge 
                    colorScheme="green" 
                    variant="subtle" 
                    fontSize="xs"
                    rounded="full"
                    px={2}
                    >
                        Khách hàng
                    </Badge>
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
                <Text fontFamily="mono" fontWeight="medium">
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
                <Text color="gray.600" fontSize="sm" noOfLines={2}>
                    {customer.address}
                </Text>
                </Flex>
            </Td>
            
            <Td py={4} px={6}>
                <HStack spacing={2} justify="center">
                <Tooltip>
                    <Text color="gray.600" fontSize="sm" noOfLines={2}>
                        {customer.product}
                    </Text>
                </Tooltip>
                </HStack>
                
                
            </Td>
            <Td>
                <HStack spacing={2} justify="center">
                    <Tooltip label="Xem chi tiết">
                        <IconButton
                            size="sm"
                            icon={<FiEye />}
                            colorScheme="blue"
                            variant="ghost"
                            rounded="full"
                            _hover={{ bg: "blue.100", transform: "scale(1.1)" }}
                            onClick={() => onView?.(customer)}
                        />
                    </Tooltip>
                    <Tooltip label="Đã xử lý">
                        <IconButton
                            size="sm"
                            icon={<FiCheck />}
                            colorScheme="green"
                            variant="ghost"
                            rounded="full"
                            _hover={{ bg: "green.100", transform: "scale(1.1)" }}
                            onClick={() => onView?.(customer)}
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
        );
    };

    const hasCustomers = customers && customers.length > 0;

    return (
        <Flex justify="center" align="center" w="100%">

            <Box 
                w="fit-content" 
                bg={bg} 
                rounded="xl" 
                shadow="lg" 
                overflow="hidden" 
                border="1px" 
                borderColor={borderColor} 
            >
            {/* Header */}
            <Box 
                px={6} 
                py={4} 
            >
                <Flex justify="space-between" align="center">
                <Box>
                    <Text fontSize="lg" fontWeight="bold">
                        Danh sách khách hàng
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                    {hasCustomers ? `${customers.length} khách hàng` : "Chưa có dữ liệu"}
                    </Text>
                </Box>
                </Flex>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table variant="simple">
                <TableHeader />
                {hasCustomers ? (
                    <Tbody>
                    {customers.map((customer, index) => (
                        <CustomerRow 
                        key={customer._id} 
                        customer={customer} 
                        index={index}
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
    );
};

export default CustomersTable;