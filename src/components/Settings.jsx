import React, { useState, useRef } from 'react';
import { Settings, Save, Upload, Trash2, Plus, X } from 'lucide-react';

export default function SettingsPanel({
    isOpen,
    onClose,
    sizes,
    onUpdateSizes,
    sheetUrl,
    onUpdateSheetUrl
}) {
    const [newSize, setNewSize] = useState('');
    const [localUrl, setLocalUrl] = useState(sheetUrl || '');
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleAddSize = (e) => {
        e.preventDefault();
        const trimmedSize = newSize.trim();

        if (!trimmedSize) return;

        if (sizes.includes(trimmedSize)) {
            alert(`El tamaño "${trimmedSize}" ya existe en la lista.`);
            return;
        }

        onUpdateSizes([...sizes, trimmedSize]);
        setNewSize('');
    };

    const handleDeleteSize = (sizeToDelete) => {
        onUpdateSizes(sizes.filter(s => s !== sizeToDelete));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            // Assume CSV is strictly "SizeName" or "SizeName,..."
            // Split by newlines or commas and clean up
            const items = text.split(/[\n,]/)
                .map(item => item.trim())
                .filter(item => item.length > 0);

            // Merge unique
            const uniqueItems = [...new Set([...sizes, ...items])];
            onUpdateSizes(uniqueItems);
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    const handleSaveUrl = () => {
        onUpdateSheetUrl(localUrl);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                        <Settings className="w-5 h-5" /> Configuración
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-8">

                    {/* Section: Google Sheets */}
                    <section>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Integración Google Sheets</h3>
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                URL del Web App (Google Apps Script)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={localUrl}
                                    onChange={(e) => setLocalUrl(e.target.value)}
                                    placeholder="https://script.google.com/macros/s/..."
                                    className="flex-1 input-premium text-sm"
                                />
                                <button
                                    onClick={handleSaveUrl}
                                    className="btn-secondary whitespace-nowrap"
                                >
                                    <Save size={16} /> Guardar
                                </button>
                            </div>
                            <p className="text-xs text-slate-400">
                                Los datos se enviarán a esta URL al registrar una pérdida.
                            </p>
                        </div>
                    </section>

                    {/* Section: Paper Sizes */}
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tamaños de Papel</h3>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Upload size={14} /> Importar CSV
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                            />
                        </div>

                        <form onSubmit={handleAddSize} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder="Nuevo tamaño (ej: 10x15)"
                                className="flex-1 input-premium text-sm"
                            />
                            <button type="submit" className="btn-primary p-2">
                                <Plus size={20} />
                            </button>
                        </form>

                        <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-2 max-h-80 overflow-y-auto border border-gray-100 dark:border-slate-700">
                            {sizes.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-4">No hay tamaños configurados</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {sizes.map(size => (
                                        <div key={size} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded shadow-sm border border-gray-100 dark:border-slate-700 group">
                                            <span className="text-sm font-medium">{size}</span>
                                            <button
                                                onClick={() => handleDeleteSize(size)}
                                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
