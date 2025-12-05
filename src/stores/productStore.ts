// ===========================================
// Product Store - Zustand
// ===========================================

import { create } from 'zustand';
import type { Product, MetalType, ProductType } from '../types';
import { mockProducts } from '../data/mockData';

interface ProductState {
    products: Product[];

    // Actions
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    updateStock: (id: string, gramsChange: number) => void;

    // Getters
    getProductById: (id: string) => Product | undefined;
    getProductsByType: (type: ProductType) => Product[];
    getProductsByCategory: (category: MetalType) => Product[];
    getLowStockProducts: () => Product[];
    getActiveProducts: () => Product[];
    getVisibleProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: mockProducts,

    addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

    updateProduct: (id, updates) =>
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            ),
        })),

    deleteProduct: (id) =>
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? { ...p, active: false } : p
            ),
        })),

    updateStock: (id, gramsChange) =>
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? { ...p, stockGrams: p.stockGrams + gramsChange } : p
            ),
        })),

    getProductById: (id) => get().products.find((p) => p.id === id),

    getProductsByType: (type) => get().products.filter((p) => p.type === type && p.active),

    getProductsByCategory: (category) => get().products.filter((p) => p.category === category && p.active),

    getLowStockProducts: () =>
        get().products.filter((p) => p.stockGrams < p.minStockGrams && p.active),

    getActiveProducts: () => get().products.filter((p) => p.active),

    getVisibleProducts: () => get().products.filter((p) => p.visibleForSale && p.active),
}));
