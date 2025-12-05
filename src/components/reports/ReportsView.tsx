// ===========================================
// Reports View - Exportar Datos
// ===========================================

import React from 'react';
import {
    FileSpreadsheet,
    Download,
    Users,
    Package,
    Factory,
    BookOpen,
    FileDown,
    Calendar
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useClientStore } from '../../stores/clientStore';
import { useOrderStore } from '../../stores/orderStore';
import { useRecipeStore } from '../../stores/recipeStore';
import {
    exportProductsToExcel,
    exportClientsToExcel,
    exportOrdersToExcel,
    exportRecipesToExcel,
    exportFullReport
} from '../../utils/exportUtils';

interface ReportCard {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    count: number | string;
    onExport: () => void;
}

const ReportsView: React.FC = () => {
    const { products } = useProductStore();
    const { clients } = useClientStore();
    const { orders } = useOrderStore();
    const { recipes } = useRecipeStore();

    const reportCards: ReportCard[] = [
        {
            id: 'inventory',
            title: 'Inventario',
            description: 'Listado completo de productos y existencias',
            icon: <Package size={24} />,
            color: 'from-blue-500 to-blue-600',
            count: products.length,
            onExport: () => exportProductsToExcel(products),
        },
        {
            id: 'clients',
            title: 'Clientes y Saldos',
            description: 'Clientes con saldos de mano de obra y material',
            icon: <Users size={24} />,
            color: 'from-emerald-500 to-emerald-600',
            count: clients.length,
            onExport: () => exportClientsToExcel(clients),
        },
        {
            id: 'orders',
            title: 'Órdenes de Producción',
            description: 'Órdenes con detalle de tiempos y pasos',
            icon: <Factory size={24} />,
            color: 'from-amber-500 to-amber-600',
            count: orders.length,
            onExport: () => exportOrdersToExcel(orders),
        },
        {
            id: 'recipes',
            title: 'Recetas',
            description: 'Rutas de producción estándar',
            icon: <BookOpen size={24} />,
            color: 'from-purple-500 to-purple-600',
            count: recipes.length,
            onExport: () => exportRecipesToExcel(recipes),
        },
    ];

    const handleFullExport = () => {
        exportFullReport(products, clients, orders, recipes);
    };

    const today = new Date().toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reportes</h1>
                    <p className="text-slate-400 text-sm mt-1">Exportar datos a Excel</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={16} />
                    {today}
                </div>
            </div>

            {/* Full Report Card */}
            <div className="mb-6 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 
                            flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <FileSpreadsheet size={28} className="text-slate-900" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Reporte Completo</h2>
                            <p className="text-slate-400 text-sm mt-0.5">
                                Exportar todos los datos en un solo archivo Excel con múltiples hojas
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleFullExport}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 
                       text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-500/25
                       hover:from-amber-400 hover:to-amber-500 transition-all"
                    >
                        <FileDown size={20} />
                        Descargar Reporte Completo
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{products.length}</p>
                        <p className="text-xs text-slate-500">Productos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{clients.length}</p>
                        <p className="text-xs text-slate-500">Clientes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{orders.length}</p>
                        <p className="text-xs text-slate-500">Órdenes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-white">{recipes.length}</p>
                        <p className="text-xs text-slate-500">Recetas</p>
                    </div>
                </div>
            </div>

            {/* Individual Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportCards.map((card) => (
                    <div
                        key={card.id}
                        className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-5 
                       hover:border-slate-600/50 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} 
                              flex items-center justify-center text-white shadow-lg
                              group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white font-semibold">{card.title}</h3>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-slate-700/50 text-slate-400 rounded-full">
                                        {card.count} registros
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">{card.description}</p>
                            </div>

                            <button
                                onClick={card.onExport}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 
                           font-medium rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                <Download size={16} />
                                Excel
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <FileSpreadsheet size={20} className="text-blue-400 mt-0.5" />
                    <div className="text-sm">
                        <p className="text-blue-400 font-medium">Formato de Exportación</p>
                        <p className="text-slate-400 mt-1">
                            Los archivos se exportan en formato <span className="text-white">.xlsx</span> (Excel)
                            y se descargan automáticamente. Cada reporte incluye los datos más recientes del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
