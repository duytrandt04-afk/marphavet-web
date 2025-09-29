import React from 'react'
import {
    Tr, 
    Flex, 
    useColorModeValue,
    Thead,
    Th
} from "@chakra-ui/react";
import { 
    FiPhone, 
    FiMapPin, 
    FiUser, 
    FiShoppingBag, 
    FiMousePointer ,
} from "react-icons/fi";

const TableHeader = () => {
    return (
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
                    
                >
                    <Flex align="center" gap={2}>
                        <FiShoppingBag />
                            Sản phẩm đã đặt
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
                        <FiMousePointer />
                        Thao tác
                    </Flex>
                </Th>
            </Tr>
        </Thead>
    )
}

export default TableHeader