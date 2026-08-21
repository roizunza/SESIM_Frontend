import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import '../perfiles/auditora/Auditor.css'; /* Importamos los estilos del timeline que ya hicimos */

const mockLogs = [
  {
    id: 1,
    type: 'upload',
    date: '18 Ago 2026, 10:15',
    layer: 'pimus_municipio_carmen',
    action: 'Carga inicial del archivo .geojson y metadatos.',
    status: 'Borrador',
    comment: null
  },
  {
    id: 2,
    type: 'submit',
    date: '18 Ago 2026, 11:30',
    layer: 'pimus_municipio_carmen',
    action: 'Capa enviada a revisión institucional.',
    status: 'En Revisión',
    comment: null
  },
  {
    id: 3,
    type: 'reject',
    date: '19 Ago 2026, 09:45',
    layer: 'pimus_municipio_carmen',
    action: 'La administradora rechazó la capa.',
    status: 'Rechazado',
    comment: 'La tabla de atributos no coincide con el diccionario de datos. Falta el campo cve_ent.'
  },
  {
    id: 4,
    type: 'upload',
    date: '19 Ago 2026, 14:20',
    layer: 'pimus_municipio_carmen',
    action: 'Se subió la corrección tabular de la capa.',
    status: 'En Revisión',
    comment: null
  },
  {
    id: 5,
    type: 'approve',
    date: '20 Ago 2026, 10:00',
    layer: 'pimus_municipio_carmen',
    action: 'Capa aprobada y publicada en el tablero operativo.',
    status: 'Aprobado',
    comment: null
  }
];

export default function UserLogs() {
  const { userId } = useParams();
  const navigate = useNavigate();

  /* Funcion para asignar el icono correcto segun el tipo de accion */
  const getLogIcon = (type) => {
    switch (type) {
      case 'upload':
      case 'submit': return <div className="timeline-icon" style={{ background: 'var(--status-revision)', color: '#fff' }}><UploadCloud size={16} /></div>;
      case 'reject': return <div className="timeline-icon" style={{ background: 'var(--status-rechazado)', color: '#fff' }}><XCircle size={16} /></div>;
      case 'approve': return <div className="timeline-icon" style={{ background: 'var(--status-aprobado)', color: '#fff' }}><CheckCircle size={16} /></div>;
      default: return <div className="timeline-icon" style={{ background: 'var(--c-gray-md)', color: '#fff' }}><Clock size={16} /></div>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '40px 24px' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Encabezado y Navegacion */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: 'var(--c-guinda-dk)' }}>Historial de Actividad</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Mostrando registros para el usuario: <strong>{userId}</strong></p>
          </div>
          
          <button 
            className="btn-base btn-secondary" 
            onClick={() => navigate(-1)} 
            style={{ width: 'auto' }}
          >
            <ArrowLeft size={16} /> Regresar al Tablero
          </button>
        </div>

        {/* Contenedor Principal del Log */}
        <div style={{ background: 'var(--c-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
          
          <div className="timeline-container" style={{ padding: 0 }}>
            {/* Iteracion sobre los datos simulados, ordenados de forma descendente (el mas reciente primero) */}
            {mockLogs.sort((a, b) => b.id - a.id).map((log) => (
              <div className="timeline-item" key={log.id}>
                {getLogIcon(log.type)}
                
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-user" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={14} color="var(--c-guinda)" /> {log.layer}
                    </span>
                    <span className="timeline-date">{log.date}</span>
                  </div>
                  
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-primary)' }}>
                    {log.action}
                  </p>

                  <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: 'var(--c-bg)', color: 'var(--text-secondary)', marginBottom: log.comment ? '12px' : '0' }}>
                    Estatus actual: {log.status}
                  </div>
                  
                  {log.comment && (
                    <p className="timeline-comment">
                      "{log.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}