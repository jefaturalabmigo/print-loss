import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Loader2, Users } from 'lucide-react';
import { submitToGoogleSheet } from '../services/googleSheetsService';

const REASONS = ['Atasco de papel', 'Error de ingreso de orden', 'Copia manchada', 'Copia doblada', 'Otro'];
const TEAMS = ['Equipo Análogo', 'Equipo Web'];
const PAPER_TYPES = ['Matte', 'Brillante'];

export default function LossForm({ onAddLoss, sizes, sheetUrl }) {
  const [formData, setFormData] = useState({
    quantity: '',
    size: '',
    paperType: 'Matte',
    team: 'Equipo Análogo',
    reason: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.quantity || !formData.size || !formData.reason) return;

    setIsSubmitting(true);

    const newLoss = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      quantity: Number(formData.quantity)
    };

    // 1. Submit to Google Sheet if URL is configured
    if (sheetUrl) {
      const sheetData = {
        'ID': newLoss.id,
        'Fecha': new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' }),
        'Equipo': newLoss.team,
        'Cantidad': newLoss.quantity,
        'Tamaño': newLoss.size,
        'Tipo de Papel': newLoss.paperType,
        'Razón': newLoss.reason,
        'Detalles': newLoss.details
      };
      await submitToGoogleSheet(sheetUrl, sheetData);
    }

    // 2. Update local state
    onAddLoss(newLoss);

    setFormData({
      quantity: '',
      size: '',
      paperType: 'Matte',
      team: 'Equipo Análogo',
      reason: '',
      details: ''
    });
    setIsSubmitting(false);
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2><AlertCircle className="icon" size={20} /> Registrar Pérdida</h2>
      </div>
      <form onSubmit={handleSubmit} className="loss-form">
        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="0"
            required
            className="input-premium"
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label className="flex items-center gap-2 mb-2"><Users size={16} /> Equipo / Origen</label>
          <div className="flex gap-6 mt-2 flex-wrap">
            {TEAMS.map(team => (
              <label key={team} className="flex items-center gap-4 cursor-pointer p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                <input
                  type="radio"
                  name="team"
                  value={team}
                  checked={formData.team === team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="accent-blue-600 w-6 h-6"
                  disabled={isSubmitting}
                />
                <span className="text-base font-medium text-slate-700 dark:text-slate-300">{team}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Tamaño</label>
          <div className="select-wrapper">
            <select
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
              className="input-premium"
              disabled={isSubmitting}
            >
              <option value="" disabled>Seleccionar tamaño</option>
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="mb-2 block">Tipo de Papel</label>
          <div className="flex gap-6 mt-2 flex-wrap">
            {PAPER_TYPES.map(type => (
              <label key={type} className="flex items-center gap-4 cursor-pointer p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                <input
                  type="radio"
                  name="paperType"
                  value={type}
                  checked={formData.paperType === type}
                  onChange={(e) => setFormData({ ...formData, paperType: e.target.value })}
                  className="accent-blue-600 w-6 h-6"
                  disabled={isSubmitting}
                />
                <span className="text-base font-medium text-slate-700 dark:text-slate-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Razón</label>
          <div className="select-wrapper">
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              className="input-premium"
              disabled={isSubmitting}
            >
              <option value="" disabled>Seleccionar motivo</option>
              {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
          {isSubmitting ? ' Registrando...' : ' Registrar'}
        </button>
      </form>
    </div>
  );
}
