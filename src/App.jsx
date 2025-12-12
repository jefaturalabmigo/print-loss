import React, { useState, useEffect } from 'react';
import LossForm from './components/LossForm';
import LossList from './components/LossList';
import SettingsPanel from './components/Settings';
import { LineChart, Settings as SettingsIcon } from 'lucide-react';

const DEFAULT_SIZES = ['10x15', '13x18', '15x21', '20x30', 'A4', 'A3', 'Otro'];

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
    return localStorage.getItem('sheetUrl') || '';
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

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <LineChart className="logo-icon" />
          <h1>PrintLoss</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="tagline hidden sm:block">Control de Mermas</p>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Configuración"
          >
            <SettingsIcon size={20} className="text-white" />
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
