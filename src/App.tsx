// ===========================================
// GESTIONTALL - Main App Component
// ERP para Taller de Joyería
// ===========================================

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import KanbanBoard from './components/production/KanbanBoard';
import ClientList from './components/clients/ClientList';
import ProductList from './components/inventory/ProductList';
import RecipeList from './components/config/RecipeList';
import ReportsView from './components/reports/ReportsView';
import ConfigView from './components/config/ConfigView';

type ViewType = 'taller' | 'clientes' | 'inventario' | 'recetas' | 'reportes' | 'config';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('taller');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'taller':
        return <KanbanBoard />;
      case 'clientes':
        return <ClientList />;
      case 'inventario':
        return <ProductList />;
      case 'recetas':
        return <RecipeList />;
      case 'reportes':
        return <ReportsView />;
      case 'config':
        return <ConfigView />;
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as ViewType)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar - Mobile spacing */}
        <div className="h-16 md:h-0" />

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
