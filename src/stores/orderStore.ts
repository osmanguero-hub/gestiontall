// ===========================================
// Order Store - Zustand
// Con lógica de Cronómetro Acumulativo
// ===========================================

import { create } from 'zustand';
import type { ProductionOrder, ProductionStep, StepStatus, OrderStatus } from '../types';
import { mockOrders } from '../data/mockData';
import { useRecipeStore } from './recipeStore';
import { useProductStore } from './productStore';

// Generar ID único
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Generar folio de orden
const generateFolio = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const seq = Math.floor(Math.random() * 900) + 100;
    return `OP-${year}${month}-${seq}`;
};

interface OrderState {
    orders: ProductionOrder[];
    selectedOrderId: string | null;

    // Actions
    createOrder: (productId: string, quantity: number, clientId?: string, clientName?: string, notes?: string) => ProductionOrder | null;
    updateOrder: (id: string, updates: Partial<ProductionOrder>) => void;
    deleteOrder: (id: string) => void;
    setSelectedOrder: (id: string | null) => void;

    // =============================================
    // LÓGICA DE CRONÓMETRO (CRÍTICA)
    // =============================================
    playStep: (orderId: string, stepId: string) => void;
    pauseStep: (orderId: string, stepId: string) => void;
    completeStep: (orderId: string, stepId: string) => void;
    assignOperator: (orderId: string, stepId: string, operator: string) => void;
    removeOperator: (orderId: string, stepId: string, operator: string) => void;

    // Getters
    getOrderById: (id: string) => ProductionOrder | undefined;
    getOrdersByStatus: (status: OrderStatus) => ProductionOrder[];
    getStepCurrentTime: (step: ProductionStep) => number;
    calculateStepCost: (step: ProductionStep, hourlyRate: number) => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: mockOrders,
    selectedOrderId: null,

    // =============================================
    // CLONADO DE RECETA AL CREAR ORDEN
    // =============================================
    createOrder: (productId, quantity, clientId, clientName, notes) => {
        const recipeStore = useRecipeStore.getState();
        const productStore = useProductStore.getState();

        const recipe = recipeStore.getRecipeByProductId(productId);
        const product = productStore.getProductById(productId);

        if (!recipe || !product) {
            return null;
        }

        // Calcular peso estimado con merma
        const baseWeight = (product.weightPerPiece || 0) * quantity;
        const estimatedWeight = baseWeight * (1 + recipe.wastePercentage);

        // Clonar los pasos de la receta
        const clonedSteps: ProductionStep[] = recipe.steps.map((step) => ({
            id: generateId(),
            name: step.name,
            order: step.order,
            status: 'Pendiente' as StepStatus,
            assignedOperators: [],
            accumulatedMinutes: 0,
            tempStartTime: null,
        }));

        const newOrder: ProductionOrder = {
            id: generateId(),
            folio: generateFolio(),
            productId,
            productName: product.name,
            clientId,
            clientName,
            quantityPlanned: quantity,
            status: 'Planeada',
            createdAt: new Date().toISOString(),
            estimatedWeight,
            notes,
            steps: clonedSteps,
        };

        set((state) => ({ orders: [...state.orders, newOrder] }));
        return newOrder;
    },

    updateOrder: (id, updates) =>
        set((state) => ({
            orders: state.orders.map((o) =>
                o.id === id ? { ...o, ...updates } : o
            ),
        })),

    deleteOrder: (id) =>
        set((state) => ({
            orders: state.orders.filter((o) => o.id !== id),
        })),

    setSelectedOrder: (id) => set({ selectedOrderId: id }),

    // =============================================
    // LÓGICA DE CRONÓMETRO ACUMULATIVO
    // =============================================

    /**
     * PLAY: Inicia el conteo de tiempo
     * - Guarda el timestamp actual en tempStartTime (ISO String)
     * - Cambia el status a 'En Proceso'
     */
    playStep: (orderId, stepId) =>
        set((state) => ({
            orders: state.orders.map((order) => {
                if (order.id !== orderId) return order;

                const updatedSteps = order.steps.map((step) => {
                    if (step.id !== stepId) return step;

                    return {
                        ...step,
                        tempStartTime: new Date().toISOString(),
                        status: 'En Proceso' as StepStatus,
                    };
                });

                // Si la orden estaba planeada, cambiarla a En Proceso
                const newOrderStatus: OrderStatus =
                    order.status === 'Planeada' ? 'En Proceso' : order.status;

                return {
                    ...order,
                    status: newOrderStatus,
                    steps: updatedSteps,
                };
            }),
        })),

    /**
     * PAUSE: Detiene el conteo y acumula el tiempo
     * - Calcula la diferencia entre ahora y tempStartTime
     * - Suma esa diferencia a accumulatedMinutes
     * - Limpia tempStartTime (null) - EL CRONÓMETRO ESTÁ PAUSADO
     */
    pauseStep: (orderId, stepId) =>
        set((state) => ({
            orders: state.orders.map((order) => {
                if (order.id !== orderId) return order;

                const updatedSteps = order.steps.map((step) => {
                    if (step.id !== stepId || !step.tempStartTime) return step;

                    // Calcular tiempo transcurrido en minutos
                    const now = new Date();
                    const startTime = new Date(step.tempStartTime);
                    const diffMinutes = (now.getTime() - startTime.getTime()) / 60000;

                    return {
                        ...step,
                        accumulatedMinutes: step.accumulatedMinutes + diffMinutes,
                        tempStartTime: null, // Pausado
                    };
                });

                return { ...order, steps: updatedSteps };
            }),
        })),

    /**
     * COMPLETE: Marca el paso como terminado
     * - Si estaba corriendo, acumula el tiempo primero
     * - Cambia el status a 'Terminada'
     * - Verifica si todos los pasos están terminados para cerrar la orden
     */
    completeStep: (orderId, stepId) =>
        set((state) => ({
            orders: state.orders.map((order) => {
                if (order.id !== orderId) return order;

                const updatedSteps = order.steps.map((step) => {
                    if (step.id !== stepId) return step;

                    let finalAccumulated = step.accumulatedMinutes;

                    // Si estaba corriendo, acumular primero
                    if (step.tempStartTime) {
                        const now = new Date();
                        const startTime = new Date(step.tempStartTime);
                        const diffMinutes = (now.getTime() - startTime.getTime()) / 60000;
                        finalAccumulated += diffMinutes;
                    }

                    return {
                        ...step,
                        accumulatedMinutes: finalAccumulated,
                        tempStartTime: null,
                        status: 'Terminada' as StepStatus,
                    };
                });

                // Verificar si todos los pasos están terminados
                const allComplete = updatedSteps.every((s) => s.status === 'Terminada');
                const newOrderStatus: OrderStatus = allComplete ? 'Terminada' : order.status;

                return {
                    ...order,
                    status: newOrderStatus,
                    steps: updatedSteps,
                };
            }),
        })),

    assignOperator: (orderId, stepId, operator) =>
        set((state) => ({
            orders: state.orders.map((order) => {
                if (order.id !== orderId) return order;

                const updatedSteps = order.steps.map((step) => {
                    if (step.id !== stepId) return step;
                    if (step.assignedOperators.includes(operator)) return step;

                    return {
                        ...step,
                        assignedOperators: [...step.assignedOperators, operator],
                    };
                });

                return { ...order, steps: updatedSteps };
            }),
        })),

    removeOperator: (orderId, stepId, operator) =>
        set((state) => ({
            orders: state.orders.map((order) => {
                if (order.id !== orderId) return order;

                const updatedSteps = order.steps.map((step) => {
                    if (step.id !== stepId) return step;

                    return {
                        ...step,
                        assignedOperators: step.assignedOperators.filter((o) => o !== operator),
                    };
                });

                return { ...order, steps: updatedSteps };
            }),
        })),

    // Getters
    getOrderById: (id) => get().orders.find((o) => o.id === id),

    getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),

    /**
     * Calcula el tiempo actual de un paso
     * - Si está pausado: solo accumulatedMinutes
     * - Si está corriendo: accumulatedMinutes + tiempo desde tempStartTime
     */
    getStepCurrentTime: (step) => {
        let total = step.accumulatedMinutes;

        if (step.tempStartTime) {
            const now = new Date();
            const startTime = new Date(step.tempStartTime);
            total += (now.getTime() - startTime.getTime()) / 60000;
        }

        return total;
    },

    /**
     * Calcula el costo de un paso
     * Costo = (minutos / 60) * operadores * tarifa por hora
     */
    calculateStepCost: (step, hourlyRate) => {
        const hours = get().getStepCurrentTime(step) / 60;
        const operators = step.assignedOperators.length || 1;
        return hours * operators * hourlyRate;
    },
}));
