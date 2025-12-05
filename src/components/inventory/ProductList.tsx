// ===========================================
// Product List - Inventario
// Con categorías de metal y control en gramos
// ===========================================

import React, { useState } from 'react';
import {
    Package,
    Search,
    Plus,
    Download,
    AlertTriangle,
    Scale
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import type { Product, MetalType } from '../../types';
import { exportProductsToExcel } from '../../utils/exportUtils';

const categoryColors: Record<MetalType, { bg: string; text: string }> = {
    'Oro 10k': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    'Oro 14k': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
    'Plata .925': { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    'Chapa': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    'Otro': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
};

const typeColors: Record<Product['type'], { bg: string; text: string }> = {
    'Materia Prima': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    'Producto Terminado': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    'Servicio': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

const ProductList: React.FC = () => {
    const { products, getLowStockProducts } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<Product['type'] | 'all'>('all');
    const [filterCategory, setFilterCategory] = useState<MetalType | 'all'>('all');

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || product.type === filterType;
        const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
    });

    // Stats
    const materiasPrimas = products.filter(p => p.type === 'Materia Prima');
    const totalGold14k = materiasPrimas.filter(p => p.category === 'Oro 14k').reduce((sum, p) => sum + p.stockGrams, 0);
    const totalGold10k = materiasPrimas.filter(p => p.category === 'Oro 10k').reduce((sum, p) => sum + p.stockGrams, 0);
    const totalSilver = materiasPrimas.filter(p => p.category === 'Plata .925').reduce((sum, p) => sum + p.stockGrams, 0);
    const lowStockProducts = getLowStockProducts();

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Inventario</h1>
                    <p className="text-slate-400 text-sm mt-1">Control de existencias en gramos</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportProductsToExcel(products)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700"
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500">
                        <Plus size={18} />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Scale size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-400">{totalGold14k.toFixed(0)}g</p>
                            <p className="text-xs text-slate-400">Oro 14k</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Scale size={20} className="text-amber-300" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-300">{totalGold10k.toFixed(0)}g</p>
                            <p className="text-xs text-slate-400">Oro 10k</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                            <Scale size={20} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-400">{totalSilver.toFixed(0)}g</p>
                            <p className="text-xs text-slate-400">Plata .925</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Package size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{products.length}</p>
                            <p className="text-xs text-slate-400">Productos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lowStockProducts.length > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                            <AlertTriangle size={20} className={lowStockProducts.length > 0 ? 'text-red-400' : 'text-emerald-400'} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{lowStockProducts.length}</p>
                            <p className="text-xs text-slate-400">Stock Bajo</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar producto o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>

                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                    <option value="all">Todos los tipos</option>
                    <option value="Materia Prima">Materias Primas</option>
                    <option value="Producto Terminado">Productos Terminados</option>
                    <option value="Servicio">Servicios</option>
                </select>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as typeof filterCategory)}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                    <option value="all">Todas las categorías</option>
                    <option value="Oro 14k">Oro 14k</option>
                    <option value="Oro 10k">Oro 10k</option>
                    <option value="Plata .925">Plata .925</option>
                    <option value="Chapa">Chapa</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            {/* Product Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="bg-slate-800/50 sticky top-0">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Producto</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">SKU</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Tipo</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Metal</th>
                            <th className="text-right p-4 text-sm font-medium text-slate-400">Stock (g)</th>
                            <th className="text-center p-4 text-sm font-medium text-slate-400">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {filteredProducts.map((product) => (
                            <ProductRow key={product.id} product={product} />
                        ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <Package size={48} className="mb-4 opacity-30" />
                        <p>No se encontraron productos</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductRow: React.FC<{ product: Product }> = ({ product }) => {
    const isLowStock = product.type === 'Materia Prima' && product.stockGrams < product.minStockGrams;
    const typeStyle = typeColors[product.type];
    const categoryStyle = categoryColors[product.category];

    return (
        <tr className="hover:bg-slate-800/30 transition-colors">
            <td className="p-4">
                <div>
                    <span className="text-white font-medium">{product.name}</span>
                    {product.weightPerPiece && (
                        <span className="block text-xs text-slate-500 mt-0.5">{product.weightPerPiece}g/pieza</span>
                    )}
                </div>
            </td>
            <td className="p-4">
                <span className="text-slate-400 font-mono text-sm">{product.sku}</span>
            </td>
            <td className="p-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
                    {product.type}
                </span>
            </td>
            <td className="p-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                    {product.category}
                </span>
            </td>
            <td className="p-4 text-right">
                <span className={`font-mono font-semibold ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                    {product.stockGrams.toFixed(1)}
                </span>
            </td>
            <td className="p-4 text-center">
                {product.type !== 'Servicio' && (
                    isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                            <AlertTriangle size={12} />
                            Bajo
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                            OK
                        </span>
                    )
                )}
            </td>
        </tr>
    );
};

export default ProductList;
