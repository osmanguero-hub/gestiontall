// ===========================================
// Step Card - Con Lógica de Cronómetro
// ===========================================

import React, { useState, useEffect } from 'react';
import {
    Play,
    Pause,
    CheckCircle,
    Clock,
    User,
    UserPlus,
    X
} from 'lucide-react';
import { useOrderStore } from '../../stores/orderStore';
import type { ProductionStep, StepStatus } from '../../types';
import { mockOperators } from '../../data/mockData';

interface StepCardProps {
    step: ProductionStep;
    orderId: string;
}

const statusColors: Record<StepStatus, { bg: string; text: string; border: string }> = {
    'Pendiente': { bg: 'bg-slate-700/50', text: 'text-slate-400', border: 'border-slate-600/50' },
    'En Proceso': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Terminada': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

const StepCard: React.FC<StepCardProps> = ({ step, orderId }) => {
    const { playStep, pauseStep, completeStep, getStepCurrentTime, assignOperator, removeOperator } = useOrderStore();
    const [currentTime, setCurrentTime] = useState(getStepCurrentTime(step));
    const [showOperatorMenu, setShowOperatorMenu] = useState(false);

    const isRunning = step.tempStartTime !== null;
    const isComplete = step.status === 'Terminada';

    // Actualizar el tiempo cada segundo si está corriendo
    useEffect(() => {
        if (!isRunning) {
            setCurrentTime(step.accumulatedMinutes);
            return;
        }

        const interval = setInterval(() => {
            setCurrentTime(getStepCurrentTime(step));
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, step, getStepCurrentTime]);

    const formatTime = (minutes: number) => {
        const hrs = Math.floor(minutes / 60);
        const mins = Math.floor(minutes % 60);
        const secs = Math.floor((minutes * 60) % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (isComplete) return;

        if (isRunning) {
            pauseStep(orderId, step.id);
        } else {
            playStep(orderId, step.id);
        }
    };

    const handleComplete = () => {
        if (isComplete) return;
        completeStep(orderId, step.id);
    };

    const handleAssignOperator = (operatorName: string) => {
        assignOperator(orderId, step.id, operatorName);
        setShowOperatorMenu(false);
    };

    const handleRemoveOperator = (operatorName: string) => {
        removeOperator(orderId, step.id, operatorName);
    };

    const colors = statusColors[step.status];

    return (
        <div className={`relative p-3 rounded-lg border ${colors.bg} ${colors.border} transition-all duration-200`}>
            <div className="flex items-center gap-3">
                {/* Status Indicator */}
                <div className={`w-2 h-2 rounded-full ${isComplete ? 'bg-emerald-400' :
                    isRunning ? 'bg-amber-400 animate-pulse' :
                        'bg-slate-500'
                    }`} />

                {/* Step Info */}
                <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm ${colors.text}`}>{step.name}</h4>

                    {/* Operators */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {step.assignedOperators.map((op) => (
                            <span
                                key={op}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs 
                           bg-slate-700/50 text-slate-300 rounded-full group"
                            >
                                <User size={10} />
                                {op.split(' ')[0]}
                                {!isComplete && (
                                    <button
                                        onClick={() => handleRemoveOperator(op)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </span>
                        ))}

                        {!isComplete && (
                            <button
                                onClick={() => setShowOperatorMenu(!showOperatorMenu)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs 
                           bg-slate-700/30 text-slate-500 rounded-full hover:bg-slate-700/50 
                           hover:text-slate-300 transition-colors"
                            >
                                <UserPlus size={10} />
                                Asignar
                            </button>
                        )}
                    </div>

                    {/* Operator Menu */}
                    {showOperatorMenu && (
                        <div className="absolute left-0 right-0 mt-2 p-2 bg-slate-800 border border-slate-700 
                            rounded-lg shadow-xl z-10">
                            <div className="text-xs text-slate-500 mb-2">Seleccionar operador:</div>
                            {mockOperators.filter(op => op.active && !step.assignedOperators.includes(op.name)).map((op) => (
                                <button
                                    key={op.id}
                                    onClick={() => handleAssignOperator(op.name)}
                                    className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 
                             rounded-md transition-colors"
                                >
                                    {op.name}
                                </button>
                            ))}
                            {mockOperators.filter(op => op.active && !step.assignedOperators.includes(op.name)).length === 0 && (
                                <p className="text-xs text-slate-500 py-2">Todos asignados</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Timer Display */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm
                        ${isRunning ? 'bg-amber-500/20 text-amber-300 timer-running' :
                        isComplete ? 'bg-emerald-500/10 text-emerald-400' :
                            'bg-slate-700/50 text-slate-400'}`}>
                    <Clock size={14} />
                    {formatTime(currentTime)}
                </div>

                {/* Action Buttons */}
                {!isComplete && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handlePlayPause}
                            className={`p-2 rounded-lg transition-all duration-200 ${isRunning
                                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                            title={isRunning ? 'Pausar' : 'Iniciar'}
                        >
                            {isRunning ? <Pause size={16} /> : <Play size={16} />}
                        </button>

                        <button
                            onClick={handleComplete}
                            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 
                         hover:bg-emerald-500/20 hover:text-emerald-400 transition-all duration-200"
                            title="Marcar como terminado"
                        >
                            <CheckCircle size={16} />
                        </button>
                    </div>
                )}

                {isComplete && (
                    <div className="p-2 text-emerald-400">
                        <CheckCircle size={16} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StepCard;
