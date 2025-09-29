import { create } from "zustand";

export const useCustomer = create((set) => ({
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,

  setCustomers: (customers) => set({ customers }),

  createCustomer: async (newCustomer) => {
    if (!newCustomer.name || !newCustomer.phoneNumber || !newCustomer.address || !newCustomer.product) {
      return { success: false, message: "Please fill in all fields." };
    }
    try {
      set({ loading: true, error: null });
      
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        set((state) => ({ 
          customers: [...state.customers, data.data],
          loading: false 
        }));
        return { success: true, message: "Đặt hàng thành công" };
      } else {
        throw new Error(data.message || "Failed to create customer");
      }
    } catch (error) {
      set({ loading: false, error: error.message });
      return { success: false, message: error.message };
    }
  },

  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      
      const res = await fetch("/api/customers");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        set({ customers: data.data || [], loading: false });
      } else {
        throw new Error(data.message || "Failed to fetch customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      set({ loading: false, error: error.message, customers: [] });
    }
  },

  deleteCustomer: async (customerId) => {
    const res = await fetch(`/api/customers/${customerId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: "Xoá khách hàng thành công" };

    set((state) => ({ customers: state.customers.filter((customer) => customer._id !== customerId) }));
    return { success: true, message: data.message };
  },

  updateCustomerStatus: async (customerId, status) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer._id === customerId ? { ...customer, status } : customer
          ),
        }));
        return { success: true, message: "Customer status updated successfully" };
      } else {
        throw new Error(data.message || "Failed to update customer status");
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      return { success: false, message: error.message };
    }
  },
}));