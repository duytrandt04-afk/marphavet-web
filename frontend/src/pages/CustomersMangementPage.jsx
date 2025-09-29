import { useEffect } from "react";
import { useCustomer } from "../store/customer";
import CustomersTable from "../components/CustomersTable";

const CustomersManagementPage = () => {
    const { customers, fetchCustomers } = useCustomer();

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return (
        <div>
            <CustomersTable 
                customers={customers} 
            />
        </div>
    );
};

export default CustomersManagementPage;