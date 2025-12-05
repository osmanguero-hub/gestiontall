// ===========================================
// New Order Modal
// ===========================================

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore';
import { useRecipeStore } from '../../stores/recipeStore';
import { useClientStore } from '../../stores/clientStore';

interface NewOrderModalProps {
    onClose: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose }) => {
    const { recipes } = useRecipeStore();
    const { clients } = useClientStore();
    const { createOrder } = useOrderStore();

    const [recipeId, setRecipeId] = useState('');
    const [clientId, setClientId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');

    const selectedRecipe = recipes.find(r => r.id === recipeId);
    const selectedClient = clients.find(c => c.id === clientId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!recipeId) {
            alert('Selecciona una receta');
            return;
        }

        createOrder(
            recipeId,
            quantity,
            clientId || undefined,
            selectedClient?.name,
            notes || undefined
        );

        onClose();
    };

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
                    <h2 className="text-xl font-semibold text-white">Nueva Orden de Producción</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Recipe Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Receta *
                        </label>
                        <select
                            value={recipeId}
                            onChange={(e) => setRecipeId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl 
                         text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                         focus:border-amber-500/50 transition-all"
                            required
                        >
                            <option value="">Seleccionar receta...</option>
                            {recipes.map((recipe) => (
                                <option key={recipe.id} value={recipe.id}>
                                    {recipe.name} ({recipe.steps.length} pasos)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selected Recipe Preview */}
                    {selectedRecipe && (
                        <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
                            <h4 className="text-sm font-medium text-amber-400 mb-2">Pasos a clonar:</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedRecipe.steps.sort((a, b) => a.order - b.order).map((step, idx) => (
                                    <span
                                        key={step.id}
                                        className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded"
                                    >
                                        {idx + 1}. {step.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Client Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Cliente (opcional)
                        </label>
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl 
                         text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                         focus:border-amber-500/50 transition-all"
                        >
                            <option value="">Sin cliente asignado</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Cantidad a producir
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl 
                         text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                         focus:border-amber-500/50 transition-all"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Notas
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Especificaciones adicionales..."
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
                         bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 
                         font-semibold rounded-xl shadow-lg shadow-amber-500/25
                         hover:from-amber-400 hover:to-amber-500 transition-all"
                        >
                            <Plus size={18} />
                            Crear Orden
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewOrderModal;
