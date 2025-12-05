// ===========================================
// Client List - Comercial Module
// ===========================================

import React, { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    DollarSign,
    Coins,
    Phone,
    Mail,
    AlertTriangle,
    CheckCircle,
    Download
} from 'lucide-react';
import { useClientStore } from '../../stores/clientStore';
import type { Client } from '../../types';
import PaymentModal from './PaymentModal';
import { exportClientsToExcel } from '../../utils/exportUtils';

const ClientList: React.FC = () => {
    const { clients } = useClientStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDebt, setFilterDebt] = useState<'all' | 'withDebt' | 'noDebt'>('all');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const hasDebt = (c: Client) => c.balanceMoney > 0 || c.balanceGold10k > 0 || c.balanceGold14k > 0 || c.balanceSilver > 0;

    const filteredClients = clients.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterDebt === 'all' ||
            (filterDebt === 'withDebt' && hasDebt(client)) ||
            (filterDebt === 'noDebt' && !hasDebt(client));
        return matchesSearch && matchesFilter;
    });

    // Stats
    const totalDebtMoney = clients.reduce((sum, c) => sum + c.balanceMoney, 0);
    const totalDebtGold = clients.reduce((sum, c) => sum + c.balanceGold10k + c.balanceGold14k, 0);
    const totalDebtSilver = clients.reduce((sum, c) => sum + c.balanceSilver, 0);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Clientes</h1>
                    <p className="text-slate-400 text-sm mt-1">Gestión de clientes y cobranza</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportClientsToExcel(clients)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700"
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500">
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
                            <p className="text-2xl font-bold text-white">{clients.length}</p>
                            <p className="text-xs text-slate-400">Total Clientes</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <DollarSign size={20} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-400">${totalDebtMoney.toLocaleString()}</p>
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
                            <p className="text-2xl font-bold text-amber-400">{totalDebtGold.toFixed(1)}g</p>
                            <p className="text-xs text-slate-400">Deuda Oro</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                            <Coins size={20} className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-400">{totalDebtSilver.toFixed(1)}g</p>
                            <p className="text-xs text-slate-400">Deuda Plata</p>
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
                        className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'Todos' },
                        { key: 'withDebt', label: 'Con Deuda' },
                        { key: 'noDebt', label: 'Al Corriente' },
                    ].map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setFilterDebt(filter.key as typeof filterDebt)}
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
            <div className="flex-1 overflow-auto space-y-3">
                {filteredClients.map((client) => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        onPayment={() => setSelectedClient(client)}
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
            {selectedClient && (
                <PaymentModal client={selectedClient} onClose={() => setSelectedClient(null)} />
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
    const hasDebt = client.balanceMoney > 0 || client.balanceGold10k > 0 || client.balanceGold14k > 0 || client.balanceSilver > 0;

    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-4 hover:border-slate-600/50 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Status Indicator */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${hasDebt ? 'bg-red-500/20' : 'bg-emerald-500/20'
                    }`}>
                    {hasDebt ? (
                        <AlertTriangle size={24} className="text-red-400" />
                    ) : (
                        <CheckCircle size={24} className="text-emerald-400" />
                    )}
                </div>

                {/* Client Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{client.name}</h3>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-400">
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
                    <div className="flex flex-wrap gap-3 mt-2">
                        {client.balanceMoney > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                                <DollarSign size={12} />
                                ${client.balanceMoney.toLocaleString()}
                            </span>
                        )}
                        {client.balanceGold14k > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Coins size={12} />
                                {client.balanceGold14k.toFixed(1)}g 14k
                            </span>
                        )}
                        {client.balanceGold10k > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Coins size={12} />
                                {client.balanceGold10k.toFixed(1)}g 10k
                            </span>
                        )}
                        {client.balanceSilver > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                <Coins size={12} />
                                {client.balanceSilver.toFixed(1)}g Plata
                            </span>
                        )}
                    </div>
                </div>

                {/* Action */}
                {hasDebt && (
                    <button
                        onClick={onPayment}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                    >
                        Abonar
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClientList;
