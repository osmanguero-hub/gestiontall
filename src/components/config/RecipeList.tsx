// ===========================================
// Recipe List - Configuración
// ===========================================

import React, { useState } from 'react';
import {
    BookOpen,
    Plus,
    Download,
    ChevronDown,
    ChevronRight,
    Clock,
    Layers,
    Edit2
} from 'lucide-react';
import { useRecipeStore } from '../../stores/recipeStore';
import type { Recipe } from '../../types';
import { exportRecipesToExcel } from '../../utils/exportUtils';

const RecipeList: React.FC = () => {
    const { recipes } = useRecipeStore();
    const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set());

    const toggleRecipe = (id: string) => {
        setExpandedRecipes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Recetas de Producción</h1>
                    <p className="text-slate-400 text-sm mt-1">Rutas y procesos estándar</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportRecipesToExcel(recipes)}
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
                        Nueva Receta
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <BookOpen size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{recipes.length}</p>
                            <p className="text-xs text-slate-400">Total Recetas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Layers size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {recipes.reduce((sum, r) => sum + r.steps.length, 0)}
                            </p>
                            <p className="text-xs text-slate-400">Total Pasos</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                            <Clock size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">
                                {Math.round(recipes.reduce((sum, r) =>
                                    sum + r.steps.reduce((s, step) => s + (step.estimatedMinutes || 0), 0), 0
                                ) / 60)}h
                            </p>
                            <p className="text-xs text-slate-400">Tiempo Est. Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe List */}
            <div className="flex-1 overflow-y-auto space-y-3">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isExpanded={expandedRecipes.has(recipe.id)}
                        onToggle={() => toggleRecipe(recipe.id)}
                    />
                ))}

                {recipes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <BookOpen size={48} className="mb-4 opacity-30" />
                        <p>No hay recetas configuradas</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface RecipeCardProps {
    recipe: Recipe;
    isExpanded: boolean;
    onToggle: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isExpanded, onToggle }) => {
    const totalEstimatedTime = recipe.steps.reduce((sum, s) => sum + (s.estimatedMinutes || 0), 0);

    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 overflow-hidden">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-700/30 transition-colors"
            >
                <span className="text-slate-500">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </span>

                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{recipe.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                            <Layers size={14} />
                            {recipe.steps.length} pasos
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} />
                            ~{Math.round(totalEstimatedTime / 60 * 10) / 10}h estimadas
                        </span>
                    </div>
                </div>

                <button className="p-2 text-slate-500 hover:text-amber-400 hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Edit2 size={16} />
                </button>
            </button>

            {/* Steps */}
            {isExpanded && (
                <div className="border-t border-slate-700/50 p-4 bg-slate-900/30">
                    <div className="space-y-2">
                        {recipe.steps.sort((a, b) => a.order - b.order).map((step, idx) => (
                            <div
                                key={step.id}
                                className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                            >
                                <span className="w-6 h-6 flex items-center justify-center text-xs font-bold 
                                 bg-amber-500/20 text-amber-400 rounded-full">
                                    {idx + 1}
                                </span>
                                <span className="flex-1 text-white">{step.name}</span>
                                {step.estimatedMinutes && (
                                    <span className="text-sm text-slate-500">
                                        ~{step.estimatedMinutes} min
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeList;
