// ===========================================
// Export Utilities - Excel/CSV
// ===========================================

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Product, Client, ProductionOrder, Recipe } from '../types';

// Formatear fecha para nombre de archivo
const getDateString = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10);
};

// =============================================
// EXPORTAR PRODUCTOS/INVENTARIO
// =============================================
export const exportProductsToExcel = (products: Product[]) => {
    const data = products.map((p) => ({
        'ID': p.id,
        'Nombre': p.name,
        'Tipo': p.type,
        'Color': p.color,
        'Stock (Gramos)': p.stockGrams.toFixed(2),
        'Vendible': p.sellable ? 'Sí' : 'No',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

    // Ajustar ancho de columnas
    ws['!cols'] = [
        { wch: 15 }, { wch: 30 }, { wch: 18 }, { wch: 12 }, { wch: 15 }, { wch: 10 }
    ];

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Inventario_${getDateString()}.xlsx`);
};

// =============================================
// EXPORTAR CLIENTES CON SALDOS
// =============================================
export const exportClientsToExcel = (clients: Client[]) => {
    const data = clients.map((c) => ({
        'ID': c.id,
        'Nombre': c.name,
        'Teléfono': c.phone || '',
        'Email': c.email || '',
        'Saldo Mano de Obra ($)': c.balanceMoney.toFixed(2),
        'Saldo Oro 10k (g)': c.balanceGold10k.toFixed(2),
        'Saldo Oro 14k (g)': c.balanceGold14k.toFixed(2),
        'Estado': (c.balanceMoney > 0 || c.balanceGold10k > 0 || c.balanceGold14k > 0) ? 'CON ADEUDO' : 'AL CORRIENTE',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

    ws['!cols'] = [
        { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 25 },
        { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 15 }
    ];

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Clientes_${getDateString()}.xlsx`);
};

// =============================================
// EXPORTAR ÓRDENES DE PRODUCCIÓN
// =============================================
export const exportOrdersToExcel = (orders: ProductionOrder[]) => {
    // Hoja 1: Resumen de órdenes
    const orderSummary = orders.map((o) => {
        const totalMinutes = o.steps.reduce((sum, s) => sum + s.accumulatedMinutes, 0);
        const completedSteps = o.steps.filter(s => s.status === 'Terminada').length;

        return {
            'Folio': o.folio,
            'Receta': o.recipeName,
            'Cliente': o.clientName || 'N/A',
            'Estado': o.status,
            'Cantidad': o.quantityPlanned,
            'Pasos Completados': `${completedSteps}/${o.steps.length}`,
            'Tiempo Total (min)': totalMinutes.toFixed(1),
            'Tiempo Total (hrs)': (totalMinutes / 60).toFixed(2),
            'Fecha Creación': o.createdAt.toLocaleDateString(),
            'Notas': o.notes || '',
        };
    });

    // Hoja 2: Detalle de pasos
    const stepDetails: any[] = [];
    orders.forEach((o) => {
        o.steps.forEach((s) => {
            stepDetails.push({
                'Folio Orden': o.folio,
                'Paso': s.name,
                'Orden': s.order,
                'Estado': s.status,
                'Operadores': s.assignedOperators.join(', ') || 'Sin asignar',
                'Tiempo (min)': s.accumulatedMinutes.toFixed(1),
                'Tiempo (hrs)': (s.accumulatedMinutes / 60).toFixed(2),
            });
        });
    });

    const ws1 = XLSX.utils.json_to_sheet(orderSummary);
    const ws2 = XLSX.utils.json_to_sheet(stepDetails);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Ordenes');
    XLSX.utils.book_append_sheet(wb, ws2, 'Detalle Pasos');

    ws1['!cols'] = [
        { wch: 18 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 10 },
        { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 30 }
    ];

    ws2['!cols'] = [
        { wch: 18 }, { wch: 25 }, { wch: 8 }, { wch: 12 },
        { wch: 30 }, { wch: 12 }, { wch: 12 }
    ];

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Ordenes_Produccion_${getDateString()}.xlsx`);
};

// =============================================
// EXPORTAR RECETAS
// =============================================
export const exportRecipesToExcel = (recipes: Recipe[]) => {
    const data: any[] = [];

    recipes.forEach((r) => {
        r.steps.forEach((s, index) => {
            data.push({
                'Receta': index === 0 ? r.name : '',
                'ID Receta': index === 0 ? r.id : '',
                'Paso #': s.order,
                'Nombre Paso': s.name,
                'Tiempo Estimado (min)': s.estimatedMinutes || 'N/A',
            });
        });
        // Línea vacía entre recetas
        data.push({});
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recetas');

    ws['!cols'] = [
        { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 20 }
    ];

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Recetas_${getDateString()}.xlsx`);
};

// =============================================
// REPORTE COMPLETO (TODAS LAS HOJAS)
// =============================================
export const exportFullReport = (
    products: Product[],
    clients: Client[],
    orders: ProductionOrder[],
    recipes: Recipe[]
) => {
    const wb = XLSX.utils.book_new();

    // Hoja: Inventario
    const productData = products.map((p) => ({
        'Nombre': p.name,
        'Tipo': p.type,
        'Color': p.color,
        'Stock (g)': p.stockGrams.toFixed(2),
    }));
    const wsProducts = XLSX.utils.json_to_sheet(productData);
    XLSX.utils.book_append_sheet(wb, wsProducts, 'Inventario');

    // Hoja: Clientes
    const clientData = clients.map((c) => ({
        'Nombre': c.name,
        'Saldo MO ($)': c.balanceMoney.toFixed(2),
        'Saldo 10k (g)': c.balanceGold10k.toFixed(2),
        'Saldo 14k (g)': c.balanceGold14k.toFixed(2),
    }));
    const wsClients = XLSX.utils.json_to_sheet(clientData);
    XLSX.utils.book_append_sheet(wb, wsClients, 'Clientes');

    // Hoja: Órdenes
    const orderData = orders.map((o) => ({
        'Folio': o.folio,
        'Receta': o.recipeName,
        'Cliente': o.clientName || 'N/A',
        'Estado': o.status,
        'Tiempo (hrs)': (o.steps.reduce((s, step) => s + step.accumulatedMinutes, 0) / 60).toFixed(2),
    }));
    const wsOrders = XLSX.utils.json_to_sheet(orderData);
    XLSX.utils.book_append_sheet(wb, wsOrders, 'Ordenes');

    // Hoja: Recetas
    const recipeData = recipes.map((r) => ({
        'Nombre': r.name,
        'Pasos': r.steps.length,
        'Tiempo Est. Total (min)': r.steps.reduce((s, step) => s + (step.estimatedMinutes || 0), 0),
    }));
    const wsRecipes = XLSX.utils.json_to_sheet(recipeData);
    XLSX.utils.book_append_sheet(wb, wsRecipes, 'Recetas');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `GESTIONTALL_Reporte_${getDateString()}.xlsx`);
};
