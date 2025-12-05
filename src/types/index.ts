// ===========================================
// GESTIONTALL - Type Definitions
// Taller de Joyería Real
// ===========================================

// --- CATÁLOGO Y STOCK ---

export type MetalType = 'Oro 10k' | 'Oro 14k' | 'Plata .925' | 'Chapa' | 'Otro';
export type MetalColor = 'Amarillo' | 'Blanco' | 'Rosa' | 'N/A';
export type ProductType = 'Producto Terminado' | 'Subensamble' | 'Paquete';
export type UnitOfMeasure = 'gramos' | 'piezas';

export interface Product {
    id: string;
    sku: string;
    name: string; // Nombre_Producto
    type: ProductType; // Type
    category: MetalType; // Para filtros
    color: MetalColor; // Color del material
    size?: string; // Tamaño (opcional)

    // INVENTARIO Y MEDICIÓN
    unit: UnitOfMeasure; // UdM
    weightPerPiece: number; // Peso_por_Pieza (en gramos)
    stockGrams: number; // Stock actual en gramos
    minStockGrams: number; // Alerta de stock bajo

    // PRODUCCIÓN
    yieldPercentage: number; // Rendimiento (0-1, ej: 0.97 = 97%)
    leadTimeDays: number; // Plazo_de_entrega

    // COMERCIAL
    salesPrice?: number; // Precio de venta (mano de obra)
    visibleForSale: boolean; // Visible para venta

    // ESTADO
    active: boolean; // Activo
    comments?: string; // Comentarios
    imageUrl?: string; // Imagen (opcional)
}

// --- CALCULADORA DE ALEACIÓN ---
export interface AlloyCalculation {
    targetKarat: '10k' | '14k';
    targetWeightGrams: number;
    pureGoldGrams: number;
    alloyGrams: number;
    pureGoldPercentage: number; // 0.417 para 10k, 0.585 para 14k
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
    productId: string; // Producto final
    name: string;
    wastePercentage: number; // Merma teórica (Ej: 0.03 para 3%)
    steps: RecipeStepDefinition[]; // La ruta estándar (Plantilla)
    ingredients: RecipeIngredient[]; // Qué consume
}

export interface RecipeIngredient {
    productId: string; // ID de la Granalla/Liga
    gramsRequired: number; // Cuánto material consume 1 pieza
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
    quantityPlanned: number; // Cuántas piezas
    status: OrderStatus;
    createdAt: string;
    notes?: string;

    // CÁLCULOS DE PESO Y MATERIAL
    estimatedWeight: number; // Peso total con merma
    materialRequired: AlloyCalculation | null; // Si requiere aleación
    realWeightFinished?: number; // Lo que pesó al final
    realWaste?: number; // Merma real registrada

    steps: ProductionStep[]; // Clonados de la receta
}

export interface ProductionStep {
    id: string;
    name: string;
    status: StepStatus;
    order: number;

    // CRONÓMETRO ACUMULATIVO (STOPWATCH LOGIC)
    assignedOperators: string[];
    accumulatedMinutes: number;
    tempStartTime: string | null;
}

// --- PAGOS Y TRANSACCIONES ---

export type PaymentType = 'Efectivo' | 'Material';
export type MaterialKarat = '10k' | '14k' | 'Plata';

export interface Payment {
    id: string;
    clientId: string;
    type: PaymentType;
    amount?: number;
    grams?: number;
    karat?: MaterialKarat;
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
