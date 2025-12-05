// ===========================================
// GESTIONTALL - Type Definitions
// ERP para Taller de Joyería
// ===========================================

// ------------------------------------------
// PRODUCTOS E INVENTARIO
// ------------------------------------------
export type ProductType = 'Materia Prima' | 'Producto Terminado' | 'Servicio';
export type ProductColor = 'Amarillo' | 'Blanco' | 'Rosa' | 'N/A';

export interface Product {
    id: string;
    name: string;
    type: ProductType;
    color: ProductColor;
    stockGrams: number;
    sellable: boolean;
}

// ------------------------------------------
// CLIENTES Y SALDOS
// ------------------------------------------
export interface Client {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    balanceMoney: number;      // Saldo Mano de Obra (Deuda en $)
    balanceGold10k: number;    // Saldo Gramos 10k (Deuda en Material)
    balanceGold14k: number;    // Saldo Gramos 14k (Deuda en Material)
}

// ------------------------------------------
// PRODUCCIÓN Y RECETAS
// ------------------------------------------
export interface RecipeStep {
    id: string;
    name: string;
    order: number;             // 10, 20, 30...
    estimatedMinutes?: number; // Tiempo estimado opcional
}

export interface Recipe {
    id: string;
    name: string;
    productId: string;         // Producto final
    steps: RecipeStep[];       // Array de pasos estándar
}

// ------------------------------------------
// ÓRDENES DE PRODUCCIÓN
// ------------------------------------------
export type OrderStatus = 'Planeada' | 'En Proceso' | 'Terminada';
export type StepStatus = 'Pendiente' | 'En Proceso' | 'Terminada';

export interface ProductionStep {
    id: string;
    name: string;
    order: number;
    status: StepStatus;
    assignedOperators: string[];  // Lista de nombres
    // LÓGICA DE CRONÓMETRO:
    tempStartTime: Date | null;   // Null si está pausado
    accumulatedMinutes: number;   // Tiempo guardado histórico
}

export interface ProductionOrder {
    id: string;
    folio: string;               // Ej: "OP-231120-101"
    recipeId: string;
    recipeName: string;
    clientId?: string;
    clientName?: string;
    status: OrderStatus;
    quantityPlanned: number;
    steps: ProductionStep[];     // CLONADOS de la receta al crear la orden
    createdAt: Date;
    notes?: string;
}

// ------------------------------------------
// PAGOS Y TRANSACCIONES
// ------------------------------------------
export type PaymentType = 'Efectivo' | 'Material';
export type MaterialKarat = '10k' | '14k';

export interface Payment {
    id: string;
    clientId: string;
    type: PaymentType;
    amount?: number;            // Si es efectivo
    grams?: number;             // Si es material
    karat?: MaterialKarat;      // Tipo de oro
    date: Date;
    notes?: string;
}

// ------------------------------------------
// OPERADORES
// ------------------------------------------
export interface Operator {
    id: string;
    name: string;
    hourlyRate: number;
    active: boolean;
}
