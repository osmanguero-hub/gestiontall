// ===========================================
// GESTIONTALL - Mock Data
// ===========================================

import type { Product, Client, Recipe, ProductionOrder, Operator } from '../types';

// ------------------------------------------
// OPERADORES
// ------------------------------------------
export const mockOperators: Operator[] = [
    { id: 'op1', name: 'Carlos Mendez', hourlyRate: 150, active: true },
    { id: 'op2', name: 'María García', hourlyRate: 180, active: true },
    { id: 'op3', name: 'Juan Pérez', hourlyRate: 140, active: true },
    { id: 'op4', name: 'Ana López', hourlyRate: 160, active: true },
];

// ------------------------------------------
// PRODUCTOS E INVENTARIO
// ------------------------------------------
export const mockProducts: Product[] = [
    // Materias Primas
    { id: 'prod1', name: 'Oro Chatarra 10k', type: 'Materia Prima', color: 'Amarillo', stockGrams: 250.5, sellable: false },
    { id: 'prod2', name: 'Oro Chatarra 14k', type: 'Materia Prima', color: 'Amarillo', stockGrams: 180.3, sellable: false },
    { id: 'prod3', name: 'Oro Fino 24k', type: 'Materia Prima', color: 'Amarillo', stockGrams: 100.0, sellable: false },
    { id: 'prod4', name: 'Plata .925', type: 'Materia Prima', color: 'Blanco', stockGrams: 500.0, sellable: false },
    { id: 'prod5', name: 'Oro Blanco 14k', type: 'Materia Prima', color: 'Blanco', stockGrams: 75.2, sellable: false },
    { id: 'prod6', name: 'Oro Rosa 14k', type: 'Materia Prima', color: 'Rosa', stockGrams: 45.8, sellable: false },

    // Productos Terminados
    { id: 'prod7', name: 'Anillo Solitario', type: 'Producto Terminado', color: 'Amarillo', stockGrams: 0, sellable: true },
    { id: 'prod8', name: 'Cadena Eslabón Cubano', type: 'Producto Terminado', color: 'Amarillo', stockGrams: 0, sellable: true },
    { id: 'prod9', name: 'Argollas de Matrimonio', type: 'Producto Terminado', color: 'Blanco', stockGrams: 0, sellable: true },
    { id: 'prod10', name: 'Dije Corazón', type: 'Producto Terminado', color: 'Rosa', stockGrams: 0, sellable: true },

    // Servicios
    { id: 'prod11', name: 'Servicio de Fundición', type: 'Servicio', color: 'N/A', stockGrams: 0, sellable: true },
    { id: 'prod12', name: 'Servicio de Soldadura', type: 'Servicio', color: 'N/A', stockGrams: 0, sellable: true },
];

// ------------------------------------------
// CLIENTES
// ------------------------------------------
export const mockClients: Client[] = [
    {
        id: 'cli1',
        name: 'Joyería El Diamante',
        phone: '555-1234',
        email: 'contacto@eldiamante.com',
        balanceMoney: 15000,    // Debe $15,000 de mano de obra
        balanceGold10k: 25.5,   // Debe 25.5g de oro 10k
        balanceGold14k: 0
    },
    {
        id: 'cli2',
        name: 'Roberto Sánchez',
        phone: '555-5678',
        balanceMoney: 0,
        balanceGold10k: 0,
        balanceGold14k: 10.2    // Debe 10.2g de oro 14k
    },
    {
        id: 'cli3',
        name: 'Boutique Elegance',
        phone: '555-9012',
        email: 'ventas@elegance.mx',
        balanceMoney: 8500,
        balanceGold10k: 15.0,
        balanceGold14k: 8.5
    },
    {
        id: 'cli4',
        name: 'Patricia Morales',
        phone: '555-3456',
        balanceMoney: 0,
        balanceGold10k: 0,
        balanceGold14k: 0       // Sin adeudo
    },
    {
        id: 'cli5',
        name: 'Oro Express SA',
        phone: '555-7890',
        email: 'compras@oroexpress.com',
        balanceMoney: 45000,
        balanceGold10k: 50.0,
        balanceGold14k: 30.0
    },
];

// ------------------------------------------
// RECETAS
// ------------------------------------------
export const mockRecipes: Recipe[] = [
    {
        id: 'rec1',
        name: 'Anillo Solitario Clásico',
        productId: 'prod7',
        steps: [
            { id: 'rs1', name: 'Fundición', order: 10, estimatedMinutes: 30 },
            { id: 'rs2', name: 'Laminado', order: 20, estimatedMinutes: 20 },
            { id: 'rs3', name: 'Formado de Aro', order: 30, estimatedMinutes: 45 },
            { id: 'rs4', name: 'Soldadura', order: 40, estimatedMinutes: 15 },
            { id: 'rs5', name: 'Engaste de Piedra', order: 50, estimatedMinutes: 60 },
            { id: 'rs6', name: 'Pulido Final', order: 60, estimatedMinutes: 25 },
        ]
    },
    {
        id: 'rec2',
        name: 'Cadena Eslabón Cubano',
        productId: 'prod8',
        steps: [
            { id: 'rs7', name: 'Fundición', order: 10, estimatedMinutes: 45 },
            { id: 'rs8', name: 'Trefilado', order: 20, estimatedMinutes: 60 },
            { id: 'rs9', name: 'Formado de Eslabones', order: 30, estimatedMinutes: 120 },
            { id: 'rs10', name: 'Soldadura de Eslabones', order: 40, estimatedMinutes: 90 },
            { id: 'rs11', name: 'Aplanado', order: 50, estimatedMinutes: 40 },
            { id: 'rs12', name: 'Pulido', order: 60, estimatedMinutes: 30 },
            { id: 'rs13', name: 'Instalación de Broche', order: 70, estimatedMinutes: 20 },
        ]
    },
    {
        id: 'rec3',
        name: 'Argollas de Matrimonio',
        productId: 'prod9',
        steps: [
            { id: 'rs14', name: 'Fundición', order: 10, estimatedMinutes: 25 },
            { id: 'rs15', name: 'Laminado', order: 20, estimatedMinutes: 15 },
            { id: 'rs16', name: 'Corte y Formado', order: 30, estimatedMinutes: 40 },
            { id: 'rs17', name: 'Soldadura', order: 40, estimatedMinutes: 20 },
            { id: 'rs18', name: 'Grabado', order: 50, estimatedMinutes: 30 },
            { id: 'rs19', name: 'Pulido Final', order: 60, estimatedMinutes: 20 },
        ]
    },
    {
        id: 'rec4',
        name: 'Dije Corazón',
        productId: 'prod10',
        steps: [
            { id: 'rs20', name: 'Diseño en Cera', order: 10, estimatedMinutes: 45 },
            { id: 'rs21', name: 'Fundición a la Cera Perdida', order: 20, estimatedMinutes: 60 },
            { id: 'rs22', name: 'Limpieza y Ajuste', order: 30, estimatedMinutes: 25 },
            { id: 'rs23', name: 'Pulido', order: 40, estimatedMinutes: 20 },
            { id: 'rs24', name: 'Instalación de Argolla', order: 50, estimatedMinutes: 10 },
        ]
    },
];

// ------------------------------------------
// ÓRDENES DE PRODUCCIÓN
// ------------------------------------------
export const mockOrders: ProductionOrder[] = [
    {
        id: 'ord1',
        folio: 'OP-231205-001',
        recipeId: 'rec1',
        recipeName: 'Anillo Solitario Clásico',
        clientId: 'cli1',
        clientName: 'Joyería El Diamante',
        status: 'En Proceso',
        quantityPlanned: 3,
        createdAt: new Date('2024-12-01'),
        notes: 'Oro amarillo 14k, piedras de 0.5ct',
        steps: [
            { id: 'os1', name: 'Fundición', order: 10, status: 'Terminada', assignedOperators: ['Carlos Mendez'], tempStartTime: null, accumulatedMinutes: 35 },
            { id: 'os2', name: 'Laminado', order: 20, status: 'Terminada', assignedOperators: ['Carlos Mendez'], tempStartTime: null, accumulatedMinutes: 22 },
            { id: 'os3', name: 'Formado de Aro', order: 30, status: 'En Proceso', assignedOperators: ['María García'], tempStartTime: new Date(), accumulatedMinutes: 15 },
            { id: 'os4', name: 'Soldadura', order: 40, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os5', name: 'Engaste de Piedra', order: 50, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os6', name: 'Pulido Final', order: 60, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
        ]
    },
    {
        id: 'ord2',
        folio: 'OP-231205-002',
        recipeId: 'rec2',
        recipeName: 'Cadena Eslabón Cubano',
        clientId: 'cli3',
        clientName: 'Boutique Elegance',
        status: 'Planeada',
        quantityPlanned: 1,
        createdAt: new Date('2024-12-03'),
        notes: '60cm, oro amarillo 10k, 45g aprox',
        steps: [
            { id: 'os7', name: 'Fundición', order: 10, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os8', name: 'Trefilado', order: 20, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os9', name: 'Formado de Eslabones', order: 30, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os10', name: 'Soldadura de Eslabones', order: 40, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os11', name: 'Aplanado', order: 50, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os12', name: 'Pulido', order: 60, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
            { id: 'os13', name: 'Instalación de Broche', order: 70, status: 'Pendiente', assignedOperators: [], tempStartTime: null, accumulatedMinutes: 0 },
        ]
    },
    {
        id: 'ord3',
        folio: 'OP-231205-003',
        recipeId: 'rec3',
        recipeName: 'Argollas de Matrimonio',
        clientId: 'cli2',
        clientName: 'Roberto Sánchez',
        status: 'Terminada',
        quantityPlanned: 2,
        createdAt: new Date('2024-11-28'),
        notes: 'Oro blanco 14k, talla 7 y 10, grabado interno',
        steps: [
            { id: 'os14', name: 'Fundición', order: 10, status: 'Terminada', assignedOperators: ['Juan Pérez'], tempStartTime: null, accumulatedMinutes: 28 },
            { id: 'os15', name: 'Laminado', order: 20, status: 'Terminada', assignedOperators: ['Juan Pérez'], tempStartTime: null, accumulatedMinutes: 18 },
            { id: 'os16', name: 'Corte y Formado', order: 30, status: 'Terminada', assignedOperators: ['Ana López'], tempStartTime: null, accumulatedMinutes: 45 },
            { id: 'os17', name: 'Soldadura', order: 40, status: 'Terminada', assignedOperators: ['Ana López'], tempStartTime: null, accumulatedMinutes: 22 },
            { id: 'os18', name: 'Grabado', order: 50, status: 'Terminada', assignedOperators: ['María García'], tempStartTime: null, accumulatedMinutes: 35 },
            { id: 'os19', name: 'Pulido Final', order: 60, status: 'Terminada', assignedOperators: ['María García'], tempStartTime: null, accumulatedMinutes: 25 },
        ]
    },
];
