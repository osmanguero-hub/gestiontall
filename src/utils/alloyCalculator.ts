// ===========================================
// ALLOY CALCULATOR UTILITY
// Calculadora de Ligado para Oro
// ===========================================

import type { AlloyCalculation } from '../types';

/**
 * Calcula la aleación necesaria para oro
 * 
 * @param targetKarat - '10k' o '14k'
 * @param targetWeightGrams - Peso final deseado en gramos
 * @returns Cálculo de cuánto oro puro y cuánta liga se necesita
 * 
 * Fórmulas:
 * - Oro 10k = 41.7% oro puro (10/24)
 * - Oro 14k = 58.5% oro puro (14/24)
 */
export const calculateAlloy = (
    targetKarat: '10k' | '14k',
    targetWeightGrams: number
): AlloyCalculation => {
    // Porcentaje de oro puro según quilates
    const pureGoldPercentage = targetKarat === '10k' ? 10 / 24 : 14 / 24;

    // Calcular gramos de oro puro necesarios
    const pureGoldGrams = targetWeightGrams * pureGoldPercentage;

    // Calcular gramos de liga necesarios
    const alloyGrams = targetWeightGrams - pureGoldGrams;

    return {
        targetKarat,
        targetWeightGrams,
        pureGoldGrams: Math.round(pureGoldGrams * 100) / 100, // 2 decimales
        alloyGrams: Math.round(alloyGrams * 100) / 100,
        pureGoldPercentage,
    };
};

/**
 * Calcula el peso final considerando el rendimiento (merma)
 * 
 * @param netWeight - Peso neto deseado del producto
 * @param yieldPercentage - Rendimiento (0-1, ej: 0.97 = 97%)
 * @returns Peso bruto necesario para lograr el peso neto
 * 
 * Ejemplo: Si quiero 100g netos con 97% rendimiento
 * Necesito fundir: 100 / 0.97 = 103.09g
 */
export const calculateGrossWeight = (
    netWeight: number,
    yieldPercentage: number
): number => {
    if (yieldPercentage <= 0 || yieldPercentage > 1) {
        throw new Error('Yield percentage must be between 0 and 1');
    }
    return Math.round((netWeight / yieldPercentage) * 100) / 100;
};

/**
 * Calcula los materiales necesarios para una producción
 * Contempla: cantidad de piezas, peso por pieza, rendimiento y aleación
 */
export const calculateProductionMaterials = (
    weightPerPiece: number,
    quantity: number,
    yieldPercentage: number,
    targetKarat?: '10k' | '14k'
): {
    totalNetWeight: number;
    totalGrossWeight: number;
    wasteWeight: number;
    alloyCalculation: AlloyCalculation | null;
} => {
    // Peso neto total (lo que necesitamos al final)
    const totalNetWeight = weightPerPiece * quantity;

    // Peso bruto (contemplando merma)
    const totalGrossWeight = calculateGrossWeight(totalNetWeight, yieldPercentage);

    // Merma/desperdicio
    const wasteWeight = totalGrossWeight - totalNetWeight;

    // Si hay quilataje, calcular aleación
    const alloyCalculation = targetKarat
        ? calculateAlloy(targetKarat, totalGrossWeight)
        : null;

    return {
        totalNetWeight: Math.round(totalNetWeight * 100) / 100,
        totalGrossWeight: Math.round(totalGrossWeight * 100) / 100,
        wasteWeight: Math.round(wasteWeight * 100) / 100,
        alloyCalculation,
    };
};
