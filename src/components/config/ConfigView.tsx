// ===========================================
// Configuration View
// ===========================================

import React from 'react';
import {
    Settings,
    Users,
    Smartphone,
    Database,
    Shield,
    Bell,
    Palette,
    HelpCircle
} from 'lucide-react';

const ConfigView: React.FC = () => {
    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Configuración</h1>
                <p className="text-slate-400 text-sm mt-1">Ajustes del sistema</p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* General */}
                <SettingCard
                    icon={<Settings size={22} />}
                    title="General"
                    description="Nombre del taller, moneda, zona horaria"
                    color="from-slate-500 to-slate-600"
                />

                {/* Operators */}
                <SettingCard
                    icon={<Users size={22} />}
                    title="Operadores"
                    description="Gestionar personal y tarifas por hora"
                    color="from-blue-500 to-blue-600"
                />

                {/* Mobile */}
                <SettingCard
                    icon={<Smartphone size={22} />}
                    title="App Móvil"
                    description="Configuración de la aplicación Android"
                    color="from-emerald-500 to-emerald-600"
                    badge="Android"
                />

                {/* Data */}
                <SettingCard
                    icon={<Database size={22} />}
                    title="Datos"
                    description="Respaldo y restauración de información"
                    color="from-purple-500 to-purple-600"
                />

                {/* Security */}
                <SettingCard
                    icon={<Shield size={22} />}
                    title="Seguridad"
                    description="Usuarios y permisos de acceso"
                    color="from-red-500 to-red-600"
                />

                {/* Notifications */}
                <SettingCard
                    icon={<Bell size={22} />}
                    title="Notificaciones"
                    description="Alertas de stock bajo y vencimientos"
                    color="from-amber-500 to-amber-600"
                />

                {/* Appearance */}
                <SettingCard
                    icon={<Palette size={22} />}
                    title="Apariencia"
                    description="Tema y personalización visual"
                    color="from-pink-500 to-pink-600"
                />

                {/* Help */}
                <SettingCard
                    icon={<HelpCircle size={22} />}
                    title="Ayuda"
                    description="Documentación y soporte técnico"
                    color="from-cyan-500 to-cyan-600"
                />
            </div>

            {/* Version Info */}
            <div className="mt-auto pt-6">
                <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-medium">GESTIONTALL</h3>
                            <p className="text-slate-500 text-sm">ERP para Taller de Joyería</p>
                        </div>
                        <div className="text-right">
                            <p className="text-amber-400 font-mono">v1.0.0</p>
                            <p className="text-slate-500 text-xs">Prototipo Funcional</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SettingCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    badge?: string;
}

const SettingCard: React.FC<SettingCardProps> = ({ icon, title, description, color, badge }) => {
    return (
        <button className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 
                       text-left hover:border-slate-600/50 hover:bg-slate-800/70 
                       transition-all group">
            <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} 
                        flex items-center justify-center text-white shadow-lg
                        group-hover:scale-105 transition-transform`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{title}</h3>
                        {badge && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full">
                                {badge}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{description}</p>
                </div>
            </div>
        </button>
    );
};

export default ConfigView;
