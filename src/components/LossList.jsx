import React from 'react';
import { Trash2, History, Copy } from 'lucide-react';

export default function LossList({ losses, onDelete }) {
    if (losses.length === 0) {
        return (
            <div className="empty-state">
                <History size={48} className="empty-icon" />
                <p>No hay pérdidas registradas hoy.</p>
                <span className="subtitle">¡Buen trabajo!</span>
            </div>
        );
    }

    return (
        <div className="card list-card">
            <div className="card-header">
                <h2>Historial Reciente</h2>
                <span className="badge">{losses.length} registros</span>
            </div>
            <div className="list-container">
                {losses.map((loss) => (
                    <div key={loss.id} className="loss-item slide-in">
                        <div className="loss-info">
                            <span className="loss-qty">{loss.quantity}</span>
                            <div className="loss-details">
                                <span className="loss-size">{loss.size}</span>
                                <span className="loss-reason">{loss.reason}</span>
                            </div>
                        </div>
                        <div className="loss-meta">
                            <span className="loss-time">
                                {new Date(loss.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button
                                onClick={() => onDelete(loss.id)}
                                className="btn-icon delete-btn"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
