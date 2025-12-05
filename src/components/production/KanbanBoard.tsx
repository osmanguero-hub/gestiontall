// ===========================================
// Kanban Board - Production Module
// ===========================================

import React, { useState, useEffect } from 'react';
import {
    Plus,
    ChevronDown,
    ChevronRight,
    Clock,
    Package
} from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore';
import type { ProductionOrder, OrderStatus } from '../../types';
import StepCard from './StepCard';
import NewOrderModal from './NewOrderModal';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
    'Planeada': { label: 'Planeadas', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    'En Proceso': { label: 'En Proceso', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    'Terminada': { label: 'Terminadas', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
};

const KanbanBoard: React.FC = () => {
    const { orders } = useOrderStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    // Agrupar órdenes por estado
    const ordersByStatus = {
        'Planeada': orders.filter(o => o.status === 'Planeada'),
        'En Proceso': orders.filter(o => o.status === 'En Proceso'),
        'Terminada': orders.filter(o => o.status === 'Terminada'),
    };

    const toggleOrderExpanded = (orderId: string) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Taller de Producción</h1>
                    <p className="text-slate-400 text-sm mt-1">Gestión de órdenes y procesos</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 
                     text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-500/25
                     hover:from-amber-400 hover:to-amber-500 transition-all duration-200"
                >
                    <Plus size={20} />
                    Nueva Orden
                </button>
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
                {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
                    <div key={status} className="flex flex-col min-h-0">
                        {/* Column Header */}
                        <div className={`flex items-center gap-3 p-3 rounded-t-xl ${statusConfig[status].bgColor}`}>
                            <span className={`font-semibold ${statusConfig[status].color}`}>
                                {statusConfig[status].label}
                            </span>
                            <span className="px-2 py-0.5 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full">
                                {ordersByStatus[status].length}
                            </span>
                        </div>

                        {/* Column Content */}
                        <div className="flex-1 bg-slate-800/30 rounded-b-xl p-3 space-y-3 overflow-y-auto">
                            {ordersByStatus[status].length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                                    <Package size={32} className="mb-2 opacity-50" />
                                    <p className="text-sm">Sin órdenes</p>
                                </div>
                            ) : (
                                ordersByStatus[status].map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        isExpanded={expandedOrders.has(order.id)}
                                        onToggle={() => toggleOrderExpanded(order.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && <NewOrderModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

// ===========================================
// Order Card Component
// ===========================================
interface OrderCardProps {
    order: ProductionOrder;
    isExpanded: boolean;
    onToggle: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isExpanded, onToggle }) => {
    const { getStepCurrentTime } = useOrderStore();
    const [, forceUpdate] = useState(0);

    // Actualizar el tiempo cada segundo si hay pasos en proceso
    useEffect(() => {
        const hasRunningSteps = order.steps.some(s => s.tempStartTime !== null);
        if (!hasRunningSteps) return;

        const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
        return () => clearInterval(interval);
    }, [order.steps]);

    // Calcular tiempo total
    const totalMinutes = order.steps.reduce((sum, step) => sum + getStepCurrentTime(step), 0);
    const completedSteps = order.steps.filter(s => s.status === 'Terminada').length;
    const inProgressSteps = order.steps.filter(s => s.status === 'En Proceso').length;

    const formatTime = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        if (hrs > 0) {
            return `${hrs}h ${mins}m`;
        }
        return `${mins}m`;
    };

    return (
        <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden 
                    hover:border-slate-600/50 transition-all duration-200 shadow-lg">
            {/* Order Header */}
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-slate-700/30 transition-colors"
            >
                <span className="mt-1 text-slate-500">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            {order.folio}
                        </span>
                        {inProgressSteps > 0 && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Activa
                            </span>
                        )}
                    </div>

                    <h3 className="text-white font-medium mt-1.5 truncate">{order.recipeName}</h3>

                    {order.clientName && (
                        <p className="text-slate-400 text-sm mt-0.5 truncate">{order.clientName}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(totalMinutes)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Package size={12} />
                            {completedSteps}/{order.steps.length} pasos
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${(completedSteps / order.steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </button>

            {/* Expanded Steps */}
            {isExpanded && (
                <div className="border-t border-slate-700/50 p-3 space-y-2 bg-slate-900/50">
                    <div className="text-xs text-slate-500 uppercase tracking-wider px-2 mb-2">
                        Procesos
                    </div>
                    {order.steps.sort((a, b) => a.order - b.order).map((step) => (
                        <StepCard
                            key={step.id}
                            step={step}
                            orderId={order.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;
