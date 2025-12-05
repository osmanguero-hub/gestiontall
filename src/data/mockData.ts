// ===========================================
// GESTIONTALL - Mock Data
// Datos de Taller de Joyería Real
// ===========================================

import type { Product, Client, ProductionOrder, Recipe, Operator } from '../types';

// ------------------------------------------
// OPERADORES
// ------------------------------------------
export const mockOperators: Operator[] = [
    { id: 'op1', name: 'Maestro Luis', hourlyRate: 200, active: true },
    { id: 'op2', name: 'Oficial Carlos', hourlyRate: 150, active: true },
    { id: 'op3', name: 'Aprendiz Pedro', hourlyRate: 80, active: true },
    { id: 'op4', name: 'Pulidora María', hourlyRate: 120, active: true },
];

// ------------------------------------------
// PRODUCTOS E INVENTARIO (EN GRAMOS)
// ------------------------------------------
export const mockProducts: Product[] = [
    // === MATERIAS PRIMAS ===
    {
        id: 'p1',
        name: 'Granalla Oro 14k',
        sku: 'MP-Au14-001',
        type: 'Materia Prima',
        category: 'Oro 14k',
        unit: 'gramos',
        stockGrams: 450.5, // Tengo 450.5 gramos de oro 14k
        minStockGrams: 100,
    },
    {
        id: 'p2',
        name: 'Granalla Oro 10k',
        sku: 'MP-Au10-001',
        type: 'Materia Prima',
        category: 'Oro 10k',
        unit: 'gramos',
        stockGrams: 280.3,
        minStockGrams: 100,
    },
    {
        id: 'p3',
        name: 'Liga Italiana',
        sku: 'MP-Liga-001',
        type: 'Materia Prima',
        category: 'Otro',
        unit: 'gramos',
        stockGrams: 1200,
        minStockGrams: 500,
    },
    {
        id: 'p4',
        name: 'Plata .925',
        sku: 'MP-Ag925-001',
        type: 'Materia Prima',
        category: 'Plata .925',
        unit: 'gramos',
        stockGrams: 850,
        minStockGrams: 200,
    },
    {
        id: 'p5',
        name: 'Chatarra Oro 14k',
        sku: 'MP-Chat14-001',
        type: 'Materia Prima',
        category: 'Oro 14k',
        unit: 'gramos',
        stockGrams: 125.8, // Material recibido de clientes
        minStockGrams: 0,
    },
    {
        id: 'p6',
        name: 'Chatarra Oro 10k',
        sku: 'MP-Chat10-001',
        type: 'Materia Prima',
        category: 'Oro 10k',
        unit: 'gramos',
        stockGrams: 95.2,
        minStockGrams: 0,
    },
    {
        id: 'p7',
        name: 'Chatarra Plata',
        sku: 'MP-ChatAg-001',
        type: 'Materia Prima',
        category: 'Plata .925',
        unit: 'gramos',
        stockGrams: 320,
        minStockGrams: 0,
    },

    // === PRODUCTOS TERMINADOS ===
    {
        id: 'p10',
        name: 'Anillo Graduación',
        sku: 'PT-Anillo-001',
        type: 'Producto Terminado',
        category: 'Oro 14k',
        unit: 'piezas',
        weightPerPiece: 12.5, // Cada anillo pesa 12.5g
        stockGrams: 25, // Tengo 2 anillos terminados (25g)
        minStockGrams: 0,
        salesPrice: 2500, // Mano de obra
    },
    {
        id: 'p11',
        name: 'Cadena Cubana 60cm',
        sku: 'PT-Cadena-001',
        type: 'Producto Terminado',
        category: 'Oro 14k',
        unit: 'piezas',
        weightPerPiece: 45.0, // Cada cadena pesa 45g
        stockGrams: 0,
        minStockGrams: 0,
        salesPrice: 8500,
    },
    {
        id: 'p12',
        name: 'Argollas Matrimonio (Par)',
        sku: 'PT-Argolla-001',
        type: 'Producto Terminado',
        category: 'Oro 14k',
        unit: 'piezas',
        weightPerPiece: 8.0, // El par pesa 8g
        stockGrams: 16, // 2 pares en stock
        minStockGrams: 0,
        salesPrice: 1800,
    },
    {
        id: 'p13',
        name: 'Dije Virgen',
        sku: 'PT-Dije-001',
        type: 'Producto Terminado',
        category: 'Oro 10k',
        unit: 'piezas',
        weightPerPiece: 3.2,
        stockGrams: 9.6, // 3 piezas
        minStockGrams: 0,
        salesPrice: 650,
    },

    // === SERVICIOS ===
    {
        id: 'p20',
        name: 'Servicio de Fundición',
        sku: 'SV-Fund-001',
        type: 'Servicio',
        category: 'Otro',
        unit: 'gramos',
        stockGrams: 0,
        minStockGrams: 0,
        salesPrice: 50, // $50 por gramo fundido
    },
    {
        id: 'p21',
        name: 'Servicio de Soldadura',
        sku: 'SV-Sold-001',
        type: 'Servicio',
        category: 'Otro',
        unit: 'piezas',
        stockGrams: 0,
        minStockGrams: 0,
        salesPrice: 150, // Por soldadura
    },
];

// ------------------------------------------
// CLIENTES CON SALDOS DUALES
// ------------------------------------------
export const mockClients: Client[] = [
    {
        id: 'c1',
        name: 'Joyería La Esmeralda',
        email: 'ventas@esmeralda.com',
        phone: '555-1234',
        balanceMoney: 15000, // Me deben $15,000 pesos de mano de obra
        balanceGold10k: 0,
        balanceGold14k: 45.2, // Y me deben 45.2 gramos de material 14k
        balanceSilver: 0,
    },
    {
        id: 'c2',
        name: 'Boutique Oro Express',
        email: 'compras@oroexpress.mx',
        phone: '555-5678',
        balanceMoney: 28500,
        balanceGold10k: 22.5,
        balanceGold14k: 0,
        balanceSilver: 85,
    },
    {
        id: 'c3',
        name: 'Juan Pérez (Particular)',
        phone: '555-9012',
        balanceMoney: 0, // Al corriente en dinero
        balanceGold10k: 0,
        balanceGold14k: 0,
        balanceSilver: 150, // Me debe 150g de plata
    },
    {
        id: 'c4',
        name: 'Distribuidora Dorada',
        email: 'pedidos@dorada.com',
        phone: '555-3456',
        balanceMoney: 52000, // Cliente grande
        balanceGold10k: 35.8,
        balanceGold14k: 78.5,
        balanceSilver: 0,
    },
    {
        id: 'c5',
        name: 'María López (Particular)',
        phone: '555-7890',
        balanceMoney: 0,
        balanceGold10k: 0,
        balanceGold14k: 0,
        balanceSilver: 0, // Cliente al corriente
    },
];

// ------------------------------------------
// RECETAS DE PRODUCCIÓN
// ------------------------------------------
export const mockRecipes: Recipe[] = [
    {
        id: 'r1',
        productId: 'p10', // Anillo Graduación
        name: 'Anillo Graduación 14k',
        wastePercentage: 0.03, // 3% de merma
        ingredients: [
            { productId: 'p1', gramsRequired: 11.5 }, // Granalla 14k
            { productId: 'p3', gramsRequired: 1.5 },  // Liga
        ],
        steps: [
            { id: 'r1s1', name: 'Fundición', order: 10, estimatedMinutes: 45 },
            { id: 'r1s2', name: 'Vaciado', order: 20, estimatedMinutes: 30 },
            { id: 'r1s3', name: 'Limpieza y Lijado', order: 30, estimatedMinutes: 60 },
            { id: 'r1s4', name: 'Pulido', order: 40, estimatedMinutes: 45 },
            { id: 'r1s5', name: 'Control de Calidad', order: 50, estimatedMinutes: 15 },
        ],
    },
    {
        id: 'r2',
        productId: 'p11', // Cadena Cubana
        name: 'Cadena Cubana 60cm',
        wastePercentage: 0.05, // 5% de merma
        ingredients: [
            { productId: 'p1', gramsRequired: 42 }, // Granalla 14k
            { productId: 'p3', gramsRequired: 5 },  // Liga
        ],
        steps: [
            { id: 'r2s1', name: 'Fundición', order: 10, estimatedMinutes: 60 },
            { id: 'r2s2', name: 'Trefilado', order: 20, estimatedMinutes: 90 },
            { id: 'r2s3', name: 'Formado Eslabones', order: 30, estimatedMinutes: 180 },
            { id: 'r2s4', name: 'Soldadura', order: 40, estimatedMinutes: 120 },
            { id: 'r2s5', name: 'Aplanado', order: 50, estimatedMinutes: 60 },
            { id: 'r2s6', name: 'Pulido', order: 60, estimatedMinutes: 45 },
            { id: 'r2s7', name: 'Broche', order: 70, estimatedMinutes: 30 },
        ],
    },
    {
        id: 'r3',
        productId: 'p12', // Argollas Matrimonio
        name: 'Argollas Matrimonio (Par)',
        wastePercentage: 0.02,
        ingredients: [
            { productId: 'p1', gramsRequired: 7.5 },
            { productId: 'p3', gramsRequired: 1 },
        ],
        steps: [
            { id: 'r3s1', name: 'Fundición', order: 10, estimatedMinutes: 30 },
            { id: 'r3s2', name: 'Laminado', order: 20, estimatedMinutes: 25 },
            { id: 'r3s3', name: 'Corte y Formado', order: 30, estimatedMinutes: 40 },
            { id: 'r3s4', name: 'Soldadura', order: 40, estimatedMinutes: 20 },
            { id: 'r3s5', name: 'Grabado', order: 50, estimatedMinutes: 45 },
            { id: 'r3s6', name: 'Pulido Final', order: 60, estimatedMinutes: 30 },
        ],
    },
];

// ------------------------------------------
// ÓRDENES DE PRODUCCIÓN
// ------------------------------------------
export const mockOrders: ProductionOrder[] = [
    {
        id: 'op1',
        folio: 'OP-2311-001',
        productId: 'p10',
        productName: 'Anillo Graduación',
        clientId: 'c1',
        clientName: 'Joyería La Esmeralda',
        quantityPlanned: 10, // Voy a hacer 10 anillos
        status: 'En Proceso',
        createdAt: new Date().toISOString(),
        estimatedWeight: 128.75, // (12.5g * 10) + 3% merma
        notes: 'Oro 14k amarillo, talla 7-10',
        steps: [
            {
                id: 's1',
                name: 'Fundición',
                status: 'Terminada',
                order: 10,
                assignedOperators: ['Maestro Luis'],
                accumulatedMinutes: 120, // Tardaron 2 horas
                tempStartTime: null,
            },
            {
                id: 's2',
                name: 'Vaciado',
                status: 'Terminada',
                order: 20,
                assignedOperators: ['Maestro Luis'],
                accumulatedMinutes: 45,
                tempStartTime: null,
            },
            {
                id: 's3',
                name: 'Limpieza y Lijado',
                status: 'En Proceso', // ESTÁ CORRIENDO AHORA MISMO
                order: 30,
                assignedOperators: ['Aprendiz Pedro'],
                accumulatedMinutes: 45,
                tempStartTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Empezó hace 15 mins
            },
            {
                id: 's4',
                name: 'Pulido',
                status: 'Pendiente',
                order: 40,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
            {
                id: 's5',
                name: 'Control de Calidad',
                status: 'Pendiente',
                order: 50,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
        ],
    },
    {
        id: 'op2',
        folio: 'OP-2311-002',
        productId: 'p11',
        productName: 'Cadena Cubana 60cm',
        clientId: 'c4',
        clientName: 'Distribuidora Dorada',
        quantityPlanned: 3,
        status: 'Planeada',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Ayer
        estimatedWeight: 141.75, // (45g * 3) + 5% merma
        notes: 'Oro 14k, acabado brillante',
        steps: [
            {
                id: 's6',
                name: 'Fundición',
                status: 'Pendiente',
                order: 10,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
            {
                id: 's7',
                name: 'Trefilado',
                status: 'Pendiente',
                order: 20,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
            {
                id: 's8',
                name: 'Formado Eslabones',
                status: 'Pendiente',
                order: 30,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
            {
                id: 's9',
                name: 'Soldadura',
                status: 'Pendiente',
                order: 40,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
            {
                id: 's10',
                name: 'Aplanado',
                status: 'Pendiente',
                order: 50,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
            {
                id: 's11',
                name: 'Pulido',
                status: 'Pendiente',
                order: 60,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
            {
                id: 's12',
                name: 'Broche',
                status: 'Pendiente',
                order: 70,
                assignedOperators: [],
                accumulatedMinutes: 0,
                tempStartTime: null,
            },
        ],
    },
    {
        id: 'op3',
        folio: 'OP-2311-003',
        productId: 'p12',
        productName: 'Argollas Matrimonio (Par)',
        clientId: 'c3',
        clientName: 'Juan Pérez (Particular)',
        quantityPlanned: 1,
        status: 'Terminada',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // Hace 3 días
        estimatedWeight: 8.16, // 8g + 2% merma
        realWeightFinished: 8.1,
        realWaste: 0.5,
        notes: 'Oro 14k blanco, grabado "J&M 2023", talla 6 y 9',
        steps: [
            {
                id: 's13',
                name: 'Fundición',
                status: 'Terminada',
                order: 10,
                assignedOperators: ['Maestro Luis'],
                accumulatedMinutes: 35,
                tempStartTime: null,
            },
            {
                id: 's14',
                name: 'Laminado',
                status: 'Terminada',
                order: 20,
                assignedOperators: ['Oficial Carlos'],
                accumulatedMinutes: 28,
                tempStartTime: null,
            },
            {
                id: 's15',
                name: 'Corte y Formado',
                status: 'Terminada',
                order: 30,
                assignedOperators: ['Oficial Carlos'],
                accumulatedMinutes: 42,
                tempStartTime: null,
            },
            {
                id: 's16',
                name: 'Soldadura',
                status: 'Terminada',
                order: 40,
                assignedOperators: ['Maestro Luis'],
                accumulatedMinutes: 25,
                tempStartTime: null,
            },
            {
                id: 's17',
                name: 'Grabado',
                status: 'Terminada',
                order: 50,
                assignedOperators: ['Pulidora María'],
                accumulatedMinutes: 55,
                tempStartTime: null,
            },
            {
                id: 's18',
                name: 'Pulido Final',
                status: 'Terminada',
                order: 60,
                assignedOperators: ['Pulidora María'],
                accumulatedMinutes: 32,
                tempStartTime: null,
            },
        ],
    },
];
