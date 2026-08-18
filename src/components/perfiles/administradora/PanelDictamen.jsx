import React, { useState } from 'react';
import { X, CheckCircle, XCircle, FileText, Database, FileBadge } from 'lucide-react';

const PanelDictamen = ({ capa, isOpen, onClose, onDictamen }) => {
  const [activeTab, setActiveTab] = useState('ficha');
  const [comentario, setComentario] = useState('');

  if (!isOpen) return null;

  return (
    <div className={`audit-drawer ${isOpen ? 'open' : ''}`}>
      <div className="audit-drawer-header">
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--c-guinda)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Auditoría de Solicitud</span>
          <h3 style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-primary)' }}>{capa}</h3>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <X size={20} />
        </button>
      </div>

      <div className="audit-tabs">
        <button className={`audit-tab ${activeTab === 'ficha' ? 'active' : ''}`} onClick={() => setActiveTab('ficha')}>
          Ficha Técnica
        </button>
        <button className={`audit-tab ${activeTab === 'sql' ? 'active' : ''}`} onClick={() => setActiveTab('sql')}>
          Atributos SQL
        </button>
        <button className={`audit-tab ${activeTab === 'pdf' ? 'active' : ''}`} onClick={() => setActiveTab('pdf')}>
          Expediente
        </button>
      </div>

      <div className="audit-content">
        {activeTab === 'ficha' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div><strong style={{ color: 'var(--text-secondary)', fontSize: '11px', display: 'block' }}>INSTRUMENTO</strong><span>Programa Integral de Movilidad Urbana Sustentable (PIMUS)</span></div>
            <div><strong style={{ color: 'var(--text-secondary)', fontSize: '11px', display: 'block' }}>ESCALA</strong><span>Municipal</span></div>
            <div><strong style={{ color: 'var(--text-secondary)', fontSize: '11px', display: 'block' }}>EJE DE EVALUACIÓN</strong><span>Sectorial</span></div>
            <div><strong style={{ color: 'var(--text-secondary)', fontSize: '11px', display: 'block' }}>FUENTE</strong><span>INEGI, 2024</span></div>
          </div>
        )}

        {activeTab === 'sql' && (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Muestra de los primeros 5 registros tabulares:</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead><tr style={{ background: '#f3f4f6' }}><th style={{ padding: '8px', textAlign: 'left' }}>id_tramo</th><th style={{ padding: '8px', textAlign: 'left' }}>tipo</th></tr></thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}><td style={{ padding: '8px' }}>TR-001</td><td style={{ padding: '8px' }}>Ciclovía</td></tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}><td style={{ padding: '8px' }}>TR-002</td><td style={{ padding: '8px' }}>Carril Bus</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'pdf' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <FileBadge size={48} color="var(--c-guinda)" style={{ marginBottom: '16px', opacity: 0.8 }} />
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Documento_Soporte.pdf</p>
            <button style={{ padding: '8px 16px', background: 'var(--c-guinda)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Abrir Visor PDF</button>
          </div>
        )}
      </div>

      <div className="audit-footer">
        <textarea 
          placeholder="Comentarios (Obligatorio si se rechaza)..." 
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '12px', resize: 'vertical', minHeight: '60px', fontFamily: 'var(--font-body)' }}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => onDictamen('rechazar', comentario)}
            style={{ flex: 1, padding: '10px', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <XCircle size={16} /> Rechazar
          </button>
          <button 
            onClick={() => onDictamen('aprobar', '')}
            style={{ flex: 1, padding: '10px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <CheckCircle size={16} /> Aprobar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelDictamen;