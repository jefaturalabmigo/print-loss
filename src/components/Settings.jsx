import React, { useState, useRef } from 'react';
import { Settings, Save, Upload, Trash2, Plus, X, Activity } from 'lucide-react';
import { submitToGoogleSheet } from '../services/googleSheetsService';

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

    const handleTestConnection = async () => {
        if (!localUrl) {
            alert("Primero ingresa y guarda una URL.");
            return;
        }

        const testData = {
            'ID': 'TEST-' + Date.now(),
            'Fecha': new Date().toLocaleString(),
            'Equipo': 'TEST',
            'Cantidad': 0,
            'Tamaño': 'TEST',
            'Tipo de Papel': 'TEST',
            'Razón': 'Prueba de Conexión',
            'Detalles': 'Este es un dato de prueba para verificar la conexión.'
        };

        try {
            alert("Enviando prueba... Si la configuración es correcta, aparecerá una fila en tu hoja en unos segundos.");
            await submitToGoogleSheet(localUrl, testData);
        } catch (error) {
            alert("Error al intentar conectar: " + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings className="w-5 h-5 icon" /> Configuración
                    </h2>
                    <button onClick={onClose} className="btn-close">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">

                    {/* Section: Google Sheets */}
                    <section>
                        <h3 className="section-title">Integración Google Sheets</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                                URL del Web App (Google Apps Script)
                            </label>
                            <div className="input-row">
                                <input
                                    type="text"
                                    value={localUrl}
                                    onChange={(e) => setLocalUrl(e.target.value)}
                                    placeholder="https://script.google.com/macros/s/..."
                                    className="input-premium"
                                    style={{ flex: 1, fontSize: '0.9rem' }}
                                />
                                <button
                                    onClick={handleSaveUrl}
                                    className="btn-secondary"
                                >
                                    <Save size={16} /> Save
                                </button>
                                <button
                                    onClick={handleTestConnection}
                                    className="btn-secondary btn-test"
                                    title="Enviar dato de prueba"
                                >
                                    <Activity size={16} /> Probar
                                </button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Los datos se enviarán a esta URL al registrar una pérdida.
                            </p>
                        </div>
                    </section>

                    {/* Section: Paper Sizes */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <h3 className="section-title" style={{ margin: 0 }}>Tamaños de Papel</h3>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                <Upload size={14} /> Importar CSV
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".csv,.txt"
                                onChange={handleFileUpload}
                            />
                        </div>

                        <form onSubmit={handleAddSize} className="input-row" style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder="Nuevo tamaño..."
                                className="input-premium"
                                style={{ flex: 1, fontSize: '0.9rem' }}
                            />
                            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem' }}>
                                <Plus size={20} />
                            </button>
                        </form>

                        <div className="tags-grid">
                            {sizes.length === 0 ? (
                                <p style={{ gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem' }}>
                                    No hay tamaños configurados
                                </p>
                            ) : (
                                sizes.map(size => (
                                    <div key={size} className="tag-item">
                                        <span>{size}</span>
                                        <button
                                            onClick={() => handleDeleteSize(size)}
                                            className="btn-icon delete-btn"
                                            style={{ padding: '0.25rem' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
