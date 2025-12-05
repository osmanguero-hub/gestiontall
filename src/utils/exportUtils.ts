// ===========================================
// Export Utilities - Excel/CSV
// ===========================================

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Product, Client, ProductionOrder, Recipe } from '../types';

// Formatear fecha para nombre de archivo
const getDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
};

// ===========================================
// EXPORTAR PRODUCTOS
// ===========================================
export const exportProductsToExcel = (products: Product[]) => {
    const data = products.map((p) => ({
        SKU: p.sku,
        Nombre: p.name,
        Tipo: p.type,
        'Categoría Metal': p.category,
        Unidad: p.unit,
        'Stock (g)': p.stockGrams,
        'Peso/Pieza (g)': p.weightPerPiece || '-',
        'Stock Mínimo (g)': p.minStockGrams,
        'Precio M.O.': p.salesPrice ? `$${p.salesPrice}` : '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

    // Ajustar anchos de columna
    worksheet['!cols'] = [
        { wch: 15 }, // SKU
        { wch: 25 }, // Nombre
        { wch: 18 }, // Tipo
        { wch: 15 }, // Categoría
        { wch: 10 }, // Unidad
        { wch: 12 }, // Stock
        { wch: 15 }, // Peso/Pieza
        { wch: 15 }, // Stock Mínimo
        { wch: 12 }, // Precio
    ];

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `GESTIONTALL_Inventario_${getDateString()}.xlsx`);
};

// ===========================================
// EXPORTAR CLIENTES
// ===========================================
export const exportClientsToExcel = (clients: Client[]) => {
    const data = clients.map((c) => ({
        Nombre: c.name,
        Email: c.email || '-',
        Teléfono: c.phone || '-',
        'Deuda M.O. ($)': c.balanceMoney,
        'Deuda Oro 14k (g)': c.balanceGold14k,
        'Deuda Oro 10k (g)': c.balanceGold10k,
        'Deuda Plata (g)': c.balanceSilver,
        'Total Material (g)': c.balanceGold10k + c.balanceGold14k + c.balanceSilver,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

    worksheet['!cols'] = [
        { wch: 30 }, // Nombre
        { wch: 25 }, // Email
        { wch: 15 }, // Teléfono
        { wch: 15 }, // Deuda M.O.
        { wch: 18 }, // Deuda Oro 14k
        { wch: 18 }, // Deuda Oro 10k
        { wch: 15 }, // Deuda Plata
        { wch: 18 }, // Total Material
    ];

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `GESTIONTALL_Clientes_${getDateString()}.xlsx`);
};

// ===========================================
// EXPORTAR ÓRDENES DE PRODUCCIÓN
// ===========================================
export const exportOrdersToExcel = (orders: ProductionOrder[]) => {
    const data = orders.map((o) => {
        const totalMinutes = o.steps.reduce((sum, s) => sum + s.accumulatedMinutes, 0);
        const completedSteps = o.steps.filter((s) => s.status === 'Terminada').length;

        return {
            Folio: o.folio,
            Producto: o.productName,
            Cliente: o.clientName || '-',
            Cantidad: o.quantityPlanned,
            'Peso Est. (g)': o.estimatedWeight.toFixed(1),
            'Peso Real (g)': o.realWeightFinished?.toFixed(1) || '-',
            Estado: o.status,
            'Pasos Completados': `${completedSteps}/${o.steps.length}`,
            'Tiempo Total (min)': totalMinutes.toFixed(0),
            'Fecha Creación': new Date(o.createdAt).toLocaleDateString('es-MX'),
            Notas: o.notes || '-',
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Órdenes');

    worksheet['!cols'] = [
        { wch: 15 }, // Folio
        { wch: 25 }, // Producto
        { wch: 25 }, // Cliente
        { wch: 10 }, // Cantidad
        { wch: 12 }, // Peso Est.
        { wch: 12 }, // Peso Real
        { wch: 12 }, // Estado
        { wch: 18 }, // Pasos
        { wch: 18 }, // Tiempo
        { wch: 15 }, // Fecha
        { wch: 30 }, // Notas
    ];

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `GESTIONTALL_Ordenes_${getDateString()}.xlsx`);
};

// ===========================================
// EXPORTAR RECETAS
// ===========================================
export const exportRecipesToExcel = (recipes: Recipe[]) => {
    const data = recipes.map((r) => ({
        Nombre: r.name,
        'Merma (%)': (r.wastePercentage * 100).toFixed(1),
        'Ingredientes': r.ingredients.length,
        'Total Pasos': r.steps.length,
        'Pasos': r.steps.map((s) => s.name).join(' → '),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recetas');

    worksheet['!cols'] = [
        { wch: 30 }, // Nombre
        { wch: 12 }, // Merma
        { wch: 15 }, // Ingredientes
        { wch: 12 }, // Total Pasos
        { wch: 60 }, // Pasos
    ];

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `GESTIONTALL_Recetas_${getDateString()}.xlsx`);
};

// ===========================================
// EXPORTAR REPORTE COMPLETO
// ===========================================
export const exportFullReport = (
    products: Product[],
    clients: Client[],
    orders: ProductionOrder[],
    recipes: Recipe[]
) => {
    const workbook = XLSX.utils.book_new();

    // Hoja de Inventario
    const productsData = products.map((p) => ({
        SKU: p.sku,
        Nombre: p.name,
        Tipo: p.type,
        Metal: p.category,
        'Stock (g)': p.stockGrams,
        'Peso/Pieza (g)': p.weightPerPiece || '-',
        'Precio M.O.': p.salesPrice ? `$${p.salesPrice}` : '-',
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(productsData), 'Inventario');

    // Hoja de Clientes
    const clientsData = clients.map((c) => ({
        Nombre: c.name,
        'Deuda M.O.': `$${c.balanceMoney}`,
        'Oro 14k (g)': c.balanceGold14k,
        'Oro 10k (g)': c.balanceGold10k,
        'Plata (g)': c.balanceSilver,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(clientsData), 'Clientes');

    // Hoja de Órdenes
    const ordersData = orders.map((o) => ({
        Folio: o.folio,
        Producto: o.productName,
        Cliente: o.clientName || '-',
        'Peso (g)': o.estimatedWeight.toFixed(1),
        Estado: o.status,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ordersData), 'Órdenes');

    // Hoja de Recetas
    const recipesData = recipes.map((r) => ({
        Nombre: r.name,
        'Merma (%)': (r.wastePercentage * 100).toFixed(1),
        Pasos: r.steps.length,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(recipesData), 'Recetas');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `GESTIONTALL_ReporteCompleto_${getDateString()}.xlsx`);
};
