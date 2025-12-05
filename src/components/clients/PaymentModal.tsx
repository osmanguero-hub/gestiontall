// ===========================================
// Payment Modal - Pagos Duales
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
    const [karat, setKarat] = useState<MaterialKarat>('10k');
    const [notes, setNotes] = useState('');
    const [success, setSuccess] = useState(false);

    // Find chatarra product to show current stock
    const chatarraProduct = products.find(p =>
        p.name === (karat === '10k' ? 'Oro Chatarra 10k' : 'Oro Chatarra 14k')
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payment = {
            id: `pay-${Date.now()}`,
            clientId: client.id,
            type: paymentType,
            amount: paymentType === 'Efectivo' ? parseFloat(amount) : undefined,
            grams: paymentType === 'Material' ? parseFloat(grams) : undefined,
            karat: paymentType === 'Material' ? karat : undefined,
            date: new Date(),
            notes: notes || undefined,
        };

        processPayment(payment);
        setSuccess(true);

        setTimeout(() => {
            onClose();
        }, 1500);
    };

    const maxDebtMoney = client.balanceMoney;
    const maxDebtGold = karat === '10k' ? client.balanceGold10k : client.balanceGold14k;

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
                            : `Se recibieron ${parseFloat(grams).toFixed(1)}g de oro ${karat}`
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Registrar Abono</h2>
                        <p className="text-slate-400 text-sm mt-0.5">{client.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Current Debt Summary */}
                <div className="p-5 bg-slate-900/50 border-b border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-400 mb-3">Saldos Pendientes</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <div className={`p-3 rounded-xl ${client.balanceMoney > 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                            <DollarSign size={16} className={client.balanceMoney > 0 ? 'text-red-400' : 'text-slate-500'} />
                            <p className={`text-lg font-bold mt-1 ${client.balanceMoney > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                                ${client.balanceMoney.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">Mano de Obra</p>
                        </div>

                        <div className={`p-3 rounded-xl ${client.balanceGold10k > 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                            <Coins size={16} className={client.balanceGold10k > 0 ? 'text-amber-400' : 'text-slate-500'} />
                            <p className={`text-lg font-bold mt-1 ${client.balanceGold10k > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {client.balanceGold10k.toFixed(1)}g
                            </p>
                            <p className="text-xs text-slate-500">Oro 10k</p>
                        </div>

                        <div className={`p-3 rounded-xl ${client.balanceGold14k > 0 ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
                            <Coins size={16} className={client.balanceGold14k > 0 ? 'text-amber-400' : 'text-slate-500'} />
                            <p className={`text-lg font-bold mt-1 ${client.balanceGold14k > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                                {client.balanceGold14k.toFixed(1)}g
                            </p>
                            <p className="text-xs text-slate-500">Oro 14k</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Payment Type Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Tipo de Abono
                        </label>
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
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Monto a Abonar
                            </label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    max={maxDebtMoney}
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl
                             text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                             focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Máximo disponible: ${maxDebtMoney.toLocaleString()}
                            </p>
                        </div>
                    )}

                    {/* Material Input */}
                    {paymentType === 'Material' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Tipo de Oro
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setKarat('10k')}
                                        className={`p-3 rounded-xl border transition-all ${karat === '10k'
                                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                            : 'bg-slate-900/50 border-slate-700 text-slate-400'
                                            }`}
                                    >
                                        Oro 10k
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setKarat('14k')}
                                        className={`p-3 rounded-xl border transition-all ${karat === '14k'
                                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                            : 'bg-slate-900/50 border-slate-700 text-slate-400'
                                            }`}
                                    >
                                        Oro 14k
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Gramos a Recibir
                                </label>
                                <input
                                    type="number"
                                    value={grams}
                                    onChange={(e) => setGrams(e.target.value)}
                                    max={maxDebtGold}
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl
                             text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                             focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Deuda pendiente: {maxDebtGold.toFixed(1)}g de {karat}
                                </p>
                            </div>

                            {/* Inventory Update Notice */}
                            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <AlertCircle size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-blue-400 font-medium">Actualización de Inventario</p>
                                    <p className="text-slate-400 mt-1">
                                        Al recibir este material, se sumará automáticamente al stock de
                                        <span className="text-amber-400 font-medium"> Oro Chatarra {karat}</span>
                                    </p>
                                    {chatarraProduct && (
                                        <p className="text-slate-500 mt-1">
                                            Stock actual: {chatarraProduct.stockGrams.toFixed(1)}g
                                            <ArrowRight size={12} className="inline mx-1" />
                                            {(chatarraProduct.stockGrams + (parseFloat(grams) || 0)).toFixed(1)}g
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Notas (opcional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Observaciones del pago..."
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl
                         text-white placeholder-slate-500 focus:outline-none focus:ring-2 
                         focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-slate-700/50 text-slate-300 font-medium rounded-xl
                         hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                         bg-gradient-to-r from-emerald-500 to-emerald-600 text-white 
                         font-semibold rounded-xl shadow-lg shadow-emerald-500/25
                         hover:from-emerald-400 hover:to-emerald-500 transition-all"
                        >
                            <CheckCircle size={18} />
                            Registrar Abono
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
