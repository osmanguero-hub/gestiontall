// ===========================================
// GESTIONTALL - Type Definitions
// Taller de Joyería Real
// ===========================================

// --- CATÁLOGO Y STOCK ---

export type MetalType = 'Oro 10k' | 'Oro 14k' | 'Plata .925' | 'Chapa' | 'Otro';

export interface Product {
    id: string;
    name: string; // Ej: "Anillo Zafiro" o "Granalla 14k"
    sku: string;
    type: 'Materia Prima' | 'Producto Terminado' | 'Servicio';
    category: MetalType;
    salesPrice?: number; // Precio base de mano de obra (si aplica)

    // CONTROL DE INVENTARIO
    unit: 'gramos' | 'piezas';
    stockGrams: number; // EXISTENCIA REAL EN GRAMOS (Crítico)
    weightPerPiece?: number; // Ej: Un anillo pesa 3.5g
    minStockGrams: number; // Alerta de stock bajo
}

// --- CLIENTES Y COBRANZA DUAL ---

export interface Client {
    id: string;
    name: string;
    email?: string;
    phone?: string;

    // SALDOS DUALES (CORE DEL NEGOCIO)
    balanceMoney: number; // Deuda en Dinero (Mano de Obra)
    balanceGold10k: number; // Deuda en Gramos de Oro 10k
    balanceGold14k: number; // Deuda en Gramos de Oro 14k
    balanceSilver: number; // Deuda en Gramos de Plata
}

// --- PRODUCCIÓN (MRP) ---

export interface Recipe {
    id: string;
    productId: string; // Producto final (El Anillo)
    name: string;
    wastePercentage: number; // Merma teórica (Ej: 0.03 para 3%)
    steps: RecipeStepDefinition[]; // La ruta estándar (Plantilla)
    ingredients: RecipeIngredient[]; // Qué consume
}

export interface RecipeIngredient {
    productId: string; // ID de la Granalla/Liga
    gramsRequired: number; // Cuánto oro consume 1 pieza
}

export interface RecipeStepDefinition {
    id: string;
    name: string; // Ej: "Fundición"
    order: number; // 10, 20, 30
    estimatedMinutes?: number;
}

// --- ORDEN DE PRODUCCIÓN (WORKFLOW) ---

export type OrderStatus = 'Planeada' | 'En Proceso' | 'Terminada' | 'Cancelada';
export type StepStatus = 'Pendiente' | 'En Proceso' | 'Terminada';

export interface ProductionOrder {
    id: string;
    folio: string; // Ej: OP-2023-001
    productId: string;
    productName: string;
    clientId?: string;
    clientName?: string;
    quantityPlanned: number; // Cuántos anillos voy a hacer
    status: OrderStatus;
    createdAt: string;
    notes?: string;

    // CÁLCULOS DE PESO
    estimatedWeight: number; // (PesoPieza * Cantidad) + Merma
    realWeightFinished?: number; // Lo que pesó al final
    realWaste?: number; // Merma real registrada

    steps: ProductionStep[]; // Clonados de la receta
}

export interface ProductionStep {
    id: string;
    name: string; // Ej: "Fundición"
    status: StepStatus;
    order: number;

    // CRONÓMETRO ACUMULATIVO (STOPWATCH LOGIC)
    assignedOperators: string[]; // Lista de nombres (Juan, Pedro)
    accumulatedMinutes: number; // Tiempo histórico guardado
    tempStartTime: string | null; // ISO String si está corriendo, null si está pausado
}

// --- PAGOS Y TRANSACCIONES ---

export type PaymentType = 'Efectivo' | 'Material';
export type MaterialKarat = '10k' | '14k' | 'Plata';

export interface Payment {
    id: string;
    clientId: string;
    type: PaymentType;
    amount?: number; // Si es efectivo
    grams?: number; // Si es material
    karat?: MaterialKarat; // Tipo de material
    date: string;
    notes?: string;
}

// --- OPERADORES ---

export interface Operator {
    id: string;
    name: string;
    hourlyRate: number;
    active: boolean;
}
