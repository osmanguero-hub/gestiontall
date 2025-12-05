// ===========================================
// Product Form Modal
// Modal para crear/editar productos
// ===========================================

import React, { useState } from 'react';
import {
    X,
    Save,
    Calculator,
    Package
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import type { Product, MetalType, MetalColor, ProductType, UnitOfMeasure } from '../../types';
import { calculateAlloy } from '../../utils/alloyCalculator';

interface ProductFormModalProps {
    product?: Product | null; // Si viene, es edición; si no, es creación
    onClose: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose }) => {
    const { addProduct, updateProduct } = useProductStore();
    const isEdit = !!product;

    // Form state
    const [formData, setFormData] = useState<Partial<Product>>({
        sku: product?.sku || '',
        name: product?.name || '',
        type: product?.type || 'Producto Terminado',
        category: product?.category || 'Oro 14k',
        color: product?.color || 'Amarillo',
        size: product?.size || '',
        unit: product?.unit || 'piezas',
        weightPerPiece: product?.weightPerPiece || 0,
        stockGrams: product?.stockGrams || 0,
        minStockGrams: product?.minStockGrams || 0,
        yieldPercentage: product?.yieldPercentage || 0.97,
        leadTimeDays: product?.leadTimeDays || 0,
        salesPrice: product?.salesPrice || 0,
        visibleForSale: product?.visibleForSale ?? true,
        active: product?.active ?? true,
        comments: product?.comments || '',
    });

    // Calculadora de aleación
    const [showCalculator, setShowCalculator] = useState(false);
    const [calcTargetWeight, setCalcTargetWeight] = useState('');

    const handleChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productData: Product = {
            id: product?.id || `prod-${Date.now()}`,
            sku: formData.sku!,
            name: formData.name!,
            type: formData.type!,
            category: formData.category!,
            color: formData.color!,
            size: formData.size,
            unit: formData.unit!,
            weightPerPiece: Number(formData.weightPerPiece),
            stockGrams: Number(formData.stockGrams),
            minStockGrams: Number(formData.minStockGrams),
            yieldPercentage: Number(formData.yieldPercentage),
            leadTimeDays: Number(formData.leadTimeDays),
            salesPrice: formData.salesPrice ? Number(formData.salesPrice) : undefined,
            visibleForSale: formData.visibleForSale!,
            active: formData.active!,
            comments: formData.comments,
            imageUrl: formData.imageUrl,
        };

        if (isEdit) {
            updateProduct(product.id, productData);
        } else {
            addProduct(productData);
        }

        onClose();
    };

    // Calculadora
    const alloyCalc = calcTargetWeight && formData.category !== 'Plata .925' && formData.category !== 'Otro'
        ? calculateAlloy(
            formData.category === 'Oro 10k' ? '10k' : '14k',
            Number(calcTargetWeight)
        )
        : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-800 z-10 flex items-center justify-between p-5 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Package size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <p className="text-slate-400 text-sm">
                                {isEdit ? `SKU: ${product.sku}` : 'Completa los datos del producto'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información Básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">SKU *</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => handleChange('sku', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del Producto *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Tipo *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value as ProductType)}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="Producto Terminado">Producto Terminado</option>
                                <option value="Subensamble">Subensamble</option>
                                <option value="Paquete">Paquete</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Categoría Metal *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value as MetalType)}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="Oro 14k">Oro 14k</option>
                                <option value="Oro 10k">Oro 10k</option>
                                <option value="Plata .925">Plata .925</option>
                                <option value="Chapa">Chapa</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                            <select
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value as MetalColor)}
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            >
                                <option value="Amarillo">Amarillo</option>
                                <option value="Blanco">Blanco</option>
                                <option value="Rosa">Rosa</option>
                                <option value="N/A">N/A</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Tamaño</label>
                            <input
                                type="text"
                                value={formData.size || ''}
                                onChange={(e) => handleChange('size', e.target.value)}
                                placeholder="Ej: 7-10, 60cm"
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            />
                        </div>
                    </div>

                    {/* Medición y Peso */}
                    <div className="border-t border-slate-700/50 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Medición y Peso</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Unidad de Medida *</label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => handleChange('unit', e.target.value as UnitOfMeasure)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                >
                                    <option value="piezas">Piezas</option>
                                    <option value="gramos">Gramos</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Peso por Pieza (g) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.weightPerPiece}
                                    onChange={(e) => handleChange('weightPerPiece', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Rendimiento (%) *
                                    <span className="text-xs text-slate-500 ml-2">Ej: 97 = 97%</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={(formData.yieldPercentage || 0) * 100}
                                    onChange={(e) => handleChange('yieldPercentage', Number(e.target.value) / 100)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Inventario */}
                    <div className="border-t border-slate-700/50 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Inventario</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Stock Actual (g) *</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.stockGrams}
                                    onChange={(e) => handleChange('stockGrams', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Stock Mínimo (g)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.minStockGrams}
                                    onChange={(e) => handleChange('minStockGrams', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Comercial */}
                    <div className="border-t border-slate-700/50 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Información Comercial</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Precio Venta (M.O.)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.salesPrice || ''}
                                    onChange={(e) => handleChange('salesPrice', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Plazo Entrega (días)</label>
                                <input
                                    type="number"
                                    value={formData.leadTimeDays}
                                    onChange={(e) => handleChange('leadTimeDays', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.visibleForSale}
                                        onChange={(e) => handleChange('visibleForSale', e.target.checked)}
                                        className="w-5 h-5 rounded bg-slate-900/50 border-slate-700 text-amber-500 focus:ring-amber-500/50"
                                    />
                                    <span className="text-sm text-slate-300">Visible para venta</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => handleChange('active', e.target.checked)}
                                        className="w-5 h-5 rounded bg-slate-900/50 border-slate-700 text-amber-500 focus:ring-amber-500/50"
                                    />
                                    <span className="text-sm text-slate-300">Activo</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Comentarios */}
                    <div className="border-t border-slate-700/50 pt-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Comentarios</label>
                        <textarea
                            value={formData.comments || ''}
                            onChange={(e) => handleChange('comments', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                            placeholder="Observaciones adicionales..."
                        />
                    </div>

                    {/* Calculadora de Aleación */}
                    {(formData.category === 'Oro 14k' || formData.category === 'Oro 10k') && (
                        <div className="border-t border-slate-700/50 pt-6">
                            <button
                                type="button"
                                onClick={() => setShowCalculator(!showCalculator)}
                                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4"
                            >
                                <Calculator size={18} />
                                <span className="text-sm font-medium">Calculadora de Aleación</span>
                            </button>

                            {showCalculator && (
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <label className="block text-sm font-medium text-amber-400 mb-2">
                                        Peso objetivo a producir (g)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={calcTargetWeight}
                                        onChange={(e) => setCalcTargetWeight(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white"
                                        placeholder="Ej: 100"
                                    />

                                    {alloyCalc && (
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-slate-900/50 rounded-lg">
                                                <p className="text-xs text-slate-400">Oro Puro</p>
                                                <p className="text-lg font-bold text-amber-400">{alloyCalc.pureGoldGrams.toFixed(2)}g</p>
                                            </div>
                                            <div className="p-3 bg-slate-900/50 rounded-lg">
                                                <p className="text-xs text-slate-400">Liga</p>
                                                <p className="text-lg font-bold text-amber-400">{alloyCalc.alloyGrams.toFixed(2)}g</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500"
                        >
                            <Save size={18} />
                            {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;
