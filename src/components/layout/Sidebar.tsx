// ===========================================
// Sidebar Navigation Component
// ===========================================

import React from 'react';
import {
    Factory,
    Users,
    Package,
    Settings,
    BookOpen,
    FileSpreadsheet,
    Menu,
    X
} from 'lucide-react';

interface SidebarProps {
    currentView: string;
    onNavigate: (view: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'taller', label: 'Taller', icon: <Factory size={20} /> },
    { id: 'clientes', label: 'Clientes', icon: <Users size={20} /> },
    { id: 'inventario', label: 'Inventario', icon: <Package size={20} /> },
    { id: 'recetas', label: 'Recetas', icon: <BookOpen size={20} /> },
    { id: 'reportes', label: 'Reportes', icon: <FileSpreadsheet size={20} /> },
    { id: 'config', label: 'Configuración', icon: <Settings size={20} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onToggle }) => {
    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={onToggle}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white md:hidden shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-gradient-to-b from-slate-900 to-slate-800
          border-r border-slate-700/50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Factory size={24} className="text-slate-900" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">GESTIONTALL</h1>
                            <p className="text-xs text-slate-400">ERP Joyería</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onNavigate(item.id);
                                if (window.innerWidth < 768) onToggle();
                            }}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${currentView === item.id
                                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 shadow-lg shadow-amber-500/5'
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                }
              `}
                        >
                            <span className={`
                transition-colors duration-200
                ${currentView === item.id ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400'}
              `}>
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.label}</span>

                            {currentView === item.id && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50">
                    <div className="px-4 py-3 rounded-xl bg-slate-800/50">
                        <p className="text-xs text-slate-500">Versión 1.0.0</p>
                        <p className="text-xs text-slate-600 mt-1">Prototipo Funcional</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
