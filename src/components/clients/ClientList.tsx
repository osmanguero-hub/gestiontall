// ===========================================
// Client List - Con Semáforos de Saldo
// ===========================================

import React, { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    Phone,
    Mail,
    AlertCircle,
    CheckCircle,
    DollarSign,
    Coins,
    Download
} from 'lucide-react';
import { useClientStore } from '../../stores/clientStore';
import type { Client } from '../../types';
import PaymentModal from './PaymentModal';
import { exportClientsToExcel } from '../../utils/exportUtils';

const ClientList: React.FC = () => {
    const { clients } = useClientStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [filterDebt, setFilterDebt] = useState<'all' | 'withDebt' | 'noDebt'>('all');

    // Filtrar clientes
    const filteredClients = clients.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const hasDebt = client.balanceMoney > 0 || client.balanceGold10k > 0 || client.balanceGold14k > 0;

        if (filterDebt === 'withDebt') return matchesSearch && hasDebt;
        if (filterDebt === 'noDebt') return matchesSearch && !hasDebt;
        return matchesSearch;
    });

    const handleOpenPayment = (client: Client) => {
        setSelectedClient(client);
        setShowPaymentModal(true);
    };

    // Stats
    const totalClients = clients.length;
    const clientsWithDebt = clients.filter(c =>
        c.balanceMoney > 0 || c.balanceGold10k > 0 || c.balanceGold14k > 0
    ).length;
    const totalDebtMoney = clients.reduce((sum, c) => sum + c.balanceMoney, 0);
    const totalDebtGold = clients.reduce((sum, c) => sum + c.balanceGold10k + c.balanceGold14k, 0);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Clientes</h1>
                    <p className="text-slate-400 text-sm mt-1">Gestión de saldos y pagos</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportClientsToExcel(clients)}
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
                        Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Users size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalClients}</p>
                            <p className="text-xs text-slate-400">Total Clientes</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <AlertCircle size={20} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{clientsWithDebt}</p>
                            <p className="text-xs text-slate-400">Con Adeudo</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <DollarSign size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">${totalDebtMoney.toLocaleString()}</p>
                            <p className="text-xs text-slate-400">Deuda M.O.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Coins size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalDebtGold.toFixed(1)}g</p>
                            <p className="text-xs text-slate-400">Deuda Material</p>
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
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl
                       text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                       focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    {[
                        { key: 'all', label: 'Todos' },
                        { key: 'withDebt', label: 'Con Adeudo' },
                        { key: 'noDebt', label: 'Al Corriente' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setFilterDebt(filter.key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterDebt === filter.key
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto space-y-3">
                {filteredClients.map((client) => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        onPayment={() => handleOpenPayment(client)}
                    />
                ))}

                {filteredClients.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <Users size={48} className="mb-4 opacity-30" />
                        <p>No se encontraron clientes</p>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedClient && (
                <PaymentModal
                    client={selectedClient}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedClient(null);
                    }}
                />
            )}
        </div>
    );
};

// ===========================================
// Client Card Component
// ===========================================
interface ClientCardProps {
    client: Client;
    onPayment: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onPayment }) => {
    const hasDebtMoney = client.balanceMoney > 0;
    const hasDebtGold = client.balanceGold10k > 0 || client.balanceGold14k > 0;
    const hasAnyDebt = hasDebtMoney || hasDebtGold;

    return (
        <div className={`bg-slate-800/50 rounded-xl p-4 border transition-all duration-200 ${hasAnyDebt
            ? 'border-red-500/30 hover:border-red-500/50'
            : 'border-slate-700/30 hover:border-slate-600/50'
            }`}>
            <div className="flex items-start gap-4">
                {/* Status Indicator */}
                <div className={`w-3 h-3 rounded-full mt-1.5 ${hasAnyDebt ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                    }`} />

                {/* Client Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium truncate">{client.name}</h3>
                        {!hasAnyDebt && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <CheckCircle size={10} />
                                Al corriente
                            </span>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                        {client.phone && (
                            <span className="flex items-center gap-1">
                                <Phone size={12} />
                                {client.phone}
                            </span>
                        )}
                        {client.email && (
                            <span className="flex items-center gap-1">
                                <Mail size={12} />
                                {client.email}
                            </span>
                        )}
                    </div>

                    {/* Balances */}
                    {hasAnyDebt && (
                        <div className="flex flex-wrap gap-3 mt-3">
                            {hasDebtMoney && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-lg">
                                    <DollarSign size={14} className="text-red-400" />
                                    <span className="text-sm">
                                        <span className="text-red-400 font-semibold">
                                            ${client.balanceMoney.toLocaleString()}
                                        </span>
                                        <span className="text-slate-500 ml-1">M.O.</span>
                                    </span>
                                </div>
                            )}

                            {client.balanceGold10k > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg">
                                    <Coins size={14} className="text-amber-400" />
                                    <span className="text-sm">
                                        <span className="text-amber-400 font-semibold">
                                            {client.balanceGold10k.toFixed(1)}g
                                        </span>
                                        <span className="text-slate-500 ml-1">Oro 10k</span>
                                    </span>
                                </div>
                            )}

                            {client.balanceGold14k > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg">
                                    <Coins size={14} className="text-amber-400" />
                                    <span className="text-sm">
                                        <span className="text-amber-400 font-semibold">
                                            {client.balanceGold14k.toFixed(1)}g
                                        </span>
                                        <span className="text-slate-500 ml-1">Oro 14k</span>
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                {hasAnyDebt && (
                    <button
                        onClick={onPayment}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 
                       text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20
                       hover:from-emerald-400 hover:to-emerald-500 transition-all text-sm"
                    >
                        Abonar
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClientList;
