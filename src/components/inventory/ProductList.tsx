// ===========================================
// Product List - Inventario
// ===========================================

import React, { useState } from 'react';
import {
    Package,
    Search,
    Plus,
    Download,
    AlertTriangle,
    Boxes
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import type { Product, ProductType } from '../../types';
import { exportProductsToExcel } from '../../utils/exportUtils';

const typeColors: Record<ProductType, { bg: string; text: string }> = {
    'Materia Prima': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    'Producto Terminado': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    'Servicio': { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

const colorBadges: Record<string, string> = {
    'Amarillo': 'bg-amber-500',
    'Blanco': 'bg-gray-300',
    'Rosa': 'bg-pink-400',
    'N/A': 'bg-slate-500',
};

const ProductList: React.FC = () => {
    const { products } = useProductStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<ProductType | 'all'>('all');

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || product.type === filterType;
        return matchesSearch && matchesType;
    });

    // Stats
    const materiasPrimas = products.filter(p => p.type === 'Materia Prima');
    const totalGoldStock = materiasPrimas
        .filter(p => p.name.toLowerCase().includes('oro'))
        .reduce((sum, p) => sum + p.stockGrams, 0);
    const totalSilverStock = materiasPrimas
        .filter(p => p.name.toLowerCase().includes('plata'))
        .reduce((sum, p) => sum + p.stockGrams, 0);
    const lowStockCount = materiasPrimas.filter(p => p.stockGrams < 50).length;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Inventario</h1>
                    <p className="text-slate-400 text-sm mt-1">Control de existencias y materiales</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportProductsToExcel(products)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-300 
                       font-medium rounded-xl hover:bg-slate-700 transition-colors"
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                       text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-500/25
                       hover:from-amber-400 hover:to-amber-500 transition-all"
                    >
                        <Plus size={18} />
                        Nuevo Producto
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Boxes size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalGoldStock.toFixed(0)}g</p>
                            <p className="text-xs text-slate-400">Stock Oro Total</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                            <Boxes size={20} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalSilverStock.toFixed(0)}g</p>
                            <p className="text-xs text-slate-400">Stock Plata</p>
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
                            <p className="text-xs text-slate-400">Total Productos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lowStockCount > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'
                            }`}>
                            <AlertTriangle size={20} className={lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{lowStockCount}</p>
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
                        placeholder="Buscar producto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl
                       text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                       focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'Todos' },
                        { key: 'Materia Prima', label: 'Materias Primas' },
                        { key: 'Producto Terminado', label: 'Terminados' },
                        { key: 'Servicio', label: 'Servicios' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setFilterType(filter.key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === filter.key
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="bg-slate-800/50 sticky top-0">
                        <tr>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Producto</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Tipo</th>
                            <th className="text-left p-4 text-sm font-medium text-slate-400">Color</th>
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
    const isLowStock = product.type === 'Materia Prima' && product.stockGrams < 50;
    const typeStyle = typeColors[product.type];

    return (
        <tr className="hover:bg-slate-800/30 transition-colors">
            <td className="p-4">
                <span className="text-white font-medium">{product.name}</span>
            </td>
            <td className="p-4">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
                    {product.type}
                </span>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${colorBadges[product.color]}`} />
                    <span className="text-slate-400 text-sm">{product.color}</span>
                </div>
            </td>
            <td className="p-4 text-right">
                <span className={`font-mono ${isLowStock ? 'text-red-400' : 'text-white'}`}>
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
