import { create } from "zustand";

export const useProductStore = create((set) => ({
	products: [],
	selectedProduct: null,
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		if (
			!newProduct.name ||
			!newProduct.price ||
			!newProduct.description ||
			!newProduct.images || 
			!Array.isArray(newProduct.images) ||
			newProduct.images.length === 0 
		) {
			return { success: false, message: "Please fill in all fields." };
		}

		const res = await fetch("/api/products", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});

		const data = await res.json();

		if (!data.success) {
			return { success: false, message: data.message };
		}

		set((state) => ({ products: [...state.products, data.data] }));
		return { success: true, message: "Product created successfully" };
	},
	fetchProducts: async () => {
		const res = await fetch("/api/products");
		const data = await res.json();
		set({ products: data.data });
	},

	fetchProductById: async (pid) => {
		const res = await fetch(`/api/products/${pid}`);
		const data = await res.json();

		if (!data.success) {
			return { success: false, message: data.message };
		}

		set({ selectedProduct: data.data });
		return { success: true, data: data.data };
	},

	deleteProduct: async (pid) => {
		const res = await fetch(`/api/products/${pid}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
		return { success: true, message: data.message };
	},
	updateProduct: async (pid, updatedProduct) => {
		const res = await fetch(`/api/products/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedProduct),
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		set((state) => ({
			products: state.products.map((product) => (product._id === pid ? data.data : product)),
		}));

		return { success: true, message: data.message };
	},
}));
