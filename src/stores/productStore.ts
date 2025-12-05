// ===========================================
// Product Store - Zustand
// ===========================================

import { create } from 'zustand';
import type { Product } from '../types';
import { mockProducts } from '../data/mockData';

interface ProductState {
    products: Product[];

    // Actions
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    updateStock: (id: string, gramsChange: number) => void;
    getProductById: (id: string) => Product | undefined;
    getProductsByType: (type: Product['type']) => Product[];
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

    updateStock: (id, gramsChange) =>
        set((state) => ({
            products: state.products.map((p) =>
                p.id === id ? { ...p, stockGrams: p.stockGrams + gramsChange } : p
            ),
        })),

    getProductById: (id) => get().products.find((p) => p.id === id),

    getProductsByType: (type) => get().products.filter((p) => p.type === type),
}));
