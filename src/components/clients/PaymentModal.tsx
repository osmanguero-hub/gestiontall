// ===========================================
// Payment Modal - Pagos Duales
// Incluye Plata además de Oro
// ===========================================

import React, { useState } from 'react';
import {
    X,
    DollarSign,
    Coins,
    AlertCircle,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import { useClientStore } from '../../stores/clientStore';
import { useProductStore } from '../../stores/productStore';
import type { Client, PaymentType, MaterialKarat } from '../../types';

interface PaymentModalProps {
    client: Client;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ client, onClose }) => {
    const { processPayment } = useClientStore();
    const { products } = useProductStore();

    const [paymentType, setPaymentType] = useState<PaymentType>('Efectivo');
    const [amount, setAmount] = useState('');
    const [grams, setGrams] = useState('');
    const [karat, setKarat] = useState<MaterialKarat>('14k');
    const [notes, setNotes] = useState('');
    const [success, setSuccess] = useState(false);

    // Find chatarra product to show current stock
    const getChatarraProduct = () => {
        let name = '';
        switch (karat) {
            case '10k': name = 'Chatarra Oro 10k'; break;
            case '14k': name = 'Chatarra Oro 14k'; break;
            case 'Plata': name = 'Chatarra Plata'; break;
        }
        return products.find(p => p.name === name);
    };

    const chatarraProduct = getChatarraProduct();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payment = {
            id: `pay-${Date.now()}`,
            clientId: client.id,
            type: paymentType,
            amount: paymentType === 'Efectivo' ? parseFloat(amount) : undefined,
            grams: paymentType === 'Material' ? parseFloat(grams) : undefined,
            karat: paymentType === 'Material' ? karat : undefined,
            date: new Date().toISOString(),
            notes: notes || undefined,
        };

        processPayment(payment);
        setSuccess(true);

        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const maxDebtMoney = client.balanceMoney;
    const getMaxDebtMaterial = () => {
        switch (karat) {
            case '10k': return client.balanceGold10k;
            case '14k': return client.balanceGold14k;
            case 'Plata': return client.balanceSilver;
            default: return 0;
        }
    };
    const maxDebtMaterial = getMaxDebtMaterial();

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="relative w-full max-w-md bg-slate-800 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle size={32} className="text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">¡Pago Registrado!</h3>
                    <p className="text-slate-400">
                        {paymentType === 'Efectivo'
                            ? `Se abonaron $${parseFloat(amount).toLocaleString()} a mano de obra`
                            : `Se recibieron ${parseFloat(grams).toFixed(1)}g de ${karat === 'Plata' ? 'Plata .925' : `Oro ${karat}`}`
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50 sticky top-0 bg-slate-800">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Registrar Abono</h2>
                        <p className="text-slate-400 text-sm mt-0.5">{client.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Current Debt Summary */}
                <div className="p-5 bg-slate-900/50 border-b border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Saldos Pendientes</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-xl ${client.balanceMoney > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                            <DollarSign size={16} className={client.balanceMoney > 0 ? 'text-red-400' : 'text-slate-500'} />
                            <p className={`text-lg font-bold mt-1 ${client.balanceMoney > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                                ${client.balanceMoney.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">Mano de Obra</p>
                        </div>

                        <div className={`p-3 rounded-xl ${client.balanceGold14k > 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                            <Coins size={16} className={client.balanceGold14k > 0 ? 'text-amber-400' : 'text-slate-500'} />
                            <p className={`text-lg font-bold mt-1 ${client.balanceGold14k > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {client.balanceGold14k.toFixed(1)}g
                            </p>
                            <p className="text-xs text-slate-500">Oro 14k</p>
                        </div>

                        <div className={`p-3 rounded-xl ${client.balanceGold10k > 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                            <Coins size={16} className={client.balanceGold10k > 0 ? 'text-amber-400' : 'text-slate-500'} />
                            <p className={`text-lg font-bold mt-1 ${client.balanceGold10k > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {client.balanceGold10k.toFixed(1)}g
                            </p>
                            <p className="text-xs text-slate-500">Oro 10k</p>
                        </div>

                        <div className={`p-3 rounded-xl ${client.balanceSilver > 0 ? 'bg-gray-500/10 border border-gray-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                            <Coins size={16} className={client.balanceSilver > 0 ? 'text-gray-400' : 'text-slate-500'} />
                            <p className={`text-lg font-bold mt-1 ${client.balanceSilver > 0 ? 'text-gray-400' : 'text-slate-500'}`}>
                                {client.balanceSilver.toFixed(1)}g
                            </p>
                            <p className="text-xs text-slate-500">Plata .925</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Payment Type Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Abono</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentType('Efectivo')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${paymentType === 'Efectivo'
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <DollarSign size={18} />
                                Efectivo
                            </button>

                            <button
                                type="button"
                                onClick={() => setPaymentType('Material')}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${paymentType === 'Material'
                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <Coins size={18} />
                                Material
                            </button>
                        </div>
                    </div>

                    {/* Efectivo Input */}
                    {paymentType === 'Efectivo' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Monto a Abonar</label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    max={maxDebtMoney}
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Máximo: ${maxDebtMoney.toLocaleString()}</p>
                        </div>
                    )}

                    {/* Material Input */}
                    {paymentType === 'Material' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Material</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { value: '14k' as MaterialKarat, label: 'Oro 14k', debt: client.balanceGold14k },
                                        { value: '10k' as MaterialKarat, label: 'Oro 10k', debt: client.balanceGold10k },
                                        { value: 'Plata' as MaterialKarat, label: 'Plata', debt: client.balanceSilver },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setKarat(opt.value)}
                                            disabled={opt.debt <= 0}
                                            className={`p-3 rounded-xl border transition-all text-sm ${karat === opt.value
                                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                                : opt.debt > 0
                                                    ? 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    : 'bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed'
                                                }`}
                                        >
                                            {opt.label}
                                            <span className="block text-xs mt-1">{opt.debt.toFixed(1)}g</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Gramos a Recibir</label>
                                <input
                                    type="number"
                                    value={grams}
                                    onChange={(e) => setGrams(e.target.value)}
                                    max={maxDebtMaterial}
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-2">Deuda: {maxDebtMaterial.toFixed(1)}g</p>
                            </div>

                            {/* Inventory Update Notice */}
                            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <AlertCircle size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-blue-400 font-medium">Actualización de Inventario</p>
                                    <p className="text-slate-400 mt-1">
                                        Se sumará al stock de <span className="text-amber-400 font-medium">Chatarra {karat === 'Plata' ? 'Plata' : `Oro ${karat}`}</span>
                                    </p>
                                    {chatarraProduct && (
                                        <p className="text-slate-500 mt-1">
                                            {chatarraProduct.stockGrams.toFixed(1)}g <ArrowRight size={12} className="inline mx-1" />
                                            {(chatarraProduct.stockGrams + (parseFloat(grams) || 0)).toFixed(1)}g
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Notas (opcional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Observaciones..."
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500"
                        >
                            <CheckCircle size={18} />
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
