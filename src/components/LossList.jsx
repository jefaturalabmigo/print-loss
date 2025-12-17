```
import React from 'react';
import { Trash2, AlertCircle, Calendar } from 'lucide-react';

export default function LossList({ losses, onDelete }) {
  if (losses.length === 0) {
    return (
      <div className="card empty-state">
        <div className="empty-icon"><AlertCircle size={48} /></div>
        <h3>No hay pérdidas registradas hoy</h3>
        <p>Los registros aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Últimos Registros</h2>
        <span className="badge">{losses.length} total</span>
      </div>
      <div className="list-container">
        {losses.map(loss => (
          <div key={loss.id} className="loss-item slide-in">
            <div className="loss-info">
              <div className="loss-qty">
                {loss.quantity}
              </div>
              <div className="loss-details">
                <span className="loss-size">{loss.size} - {loss.paperType}</span>
                <span className="loss-reason">{loss.reason}</span>
                {loss.details && (
                  <span className="text-xs text-slate-500 mt-1 italic">
                    Note: {loss.details}
                  </span>
                )}
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] uppercase tracking-wider bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-400">{loss.team}</span>
                </div>
              </div>
            </div>
            <div className="loss-meta">
              <div className="flex flex-col items-end">
                 <span className="loss-time flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(loss.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
              <button 
                onClick={() => onDelete(loss.id)} 
                className="btn-icon delete-btn"
                aria-label="Eliminar registro"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```
