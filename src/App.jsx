import React, { useState, useEffect } from 'react';
import LossForm from './components/LossForm';
import LossList from './components/LossList';
import SettingsPanel from './components/Settings';
import { LineChart, Settings as SettingsIcon } from 'lucide-react';

const DEFAULT_SIZES = ['9x13', '10x15', '13x18', '15x21', '20x25', '20x30', '30x40', '30x45', '10x10', '13x13', '15x15', '20x20', '30x30', 'Otro'];
const DEFAULT_SHEET_URL = "https://script.google.com/macros/s/AKfycbxQxCI_zQWgVmkDmW6wEL2ojqtFGYtV9zpQ8DKGRoo0HiaJ11MIBLsynyckmJTvQgiZ/exec";

function App() {
  const [losses, setLosses] = useState(() => {
    const saved = localStorage.getItem('printLosses');
    return saved ? JSON.parse(saved) : [];
  });

  const [sizes, setSizes] = useState(() => {
    const saved = localStorage.getItem('printSizes');
    return saved ? JSON.parse(saved) : DEFAULT_SIZES;
  });

  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem('sheetUrl') || DEFAULT_SHEET_URL;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('printLosses', JSON.stringify(losses));
  }, [losses]);

  useEffect(() => {
    localStorage.setItem('printSizes', JSON.stringify(sizes));
  }, [sizes]);

  useEffect(() => {
    localStorage.setItem('sheetUrl', sheetUrl);
  }, [sheetUrl]);

  const addLoss = (loss) => {
    setLosses([loss, ...losses]);
  };

  const deleteLoss = (id) => {
    setLosses(losses.filter(l => l.id !== id));
  };

  const handleOpenSettings = () => {
    const pin = prompt("Ingresa la contraseña para acceder a la configuración:");
    if (pin === "7777") {
      setIsSettingsOpen(true);
    } else if (pin !== null) {
      alert("Contraseña incorrecta. Acceso denegado.");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <LineChart className="logo-icon" />
          <h1>PrintLoss</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="tagline hidden sm:block">Control de pérdidas de impresión</p>
          <button
            onClick={handleOpenSettings}
            className="p-2 bg-transparent hover:bg-slate-800/50 rounded-full transition-colors text-slate-500 hover:text-white border-0 shadow-none"
            title="Configuración"
          >
            <SettingsIcon size={24} />
          </button>
        </div>
      </header>

      <main className="main-grid">
        <section className="input-section">
          <LossForm
            onAddLoss={addLoss}
            sizes={sizes}
            sheetUrl={sheetUrl}
          />
        </section>

        <section className="list-section">
          <LossList losses={losses} onDelete={deleteLoss} />
        </section>
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sizes={sizes}
        onUpdateSizes={setSizes}
        sheetUrl={sheetUrl}
        onUpdateSheetUrl={setSheetUrl}
      />
    </div>
  );
}

export default App;
