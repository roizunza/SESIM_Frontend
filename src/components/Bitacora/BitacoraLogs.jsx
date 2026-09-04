import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Search, Eye, LogOut, Map, FileText, Clock, XCircle, CheckCircle, DownloadCloud } from 'lucide-react';
import '../perfiles/auditora/Auditor.css';

const mockLogs = [
  {
    id: 'CAP-001',
    rol: 'Capturista',
    operacion: 'Nuevo registro',
    tipo: 'Cartografía',
    archivo: 'red_ciclovias_sector_norte',
    fecha: '28 Ago 2026',
    estatus: 'En Revisión',
    dictamen: false
  },
  {
    id: 'ADM-001',
    rol: 'Administrador',
    operacion: 'Rechazó',
    tipo: 'Cartografía',
    archivo: 'red_ciclovias_sector_norte',
    fecha: '28 Ago 2026',
    estatus: 'Rechazado',
    dictamen: true
  },
  {
    id: 'ADM-001',
    rol: 'Administrador',
    operacion: 'Aprobó',
    tipo: 'Normativa',
    archivo: 'PIMUS_Carmen_2025.pdf',
    fecha: '27 Ago 2026',
    estatus: 'Aprobado',
    dictamen: false
  },
  {
    id: 'ADM-002',
    rol: 'Administrador',
    operacion: 'Aprobó',
    tipo: 'Cartografía',
    archivo: 'zonas_riesgo_hidrometeorologico',
    fecha: '24 Ago 2026',
    estatus: 'Aprobado',
    dictamen: false
  },
  {
    id: 'ADM-001',
    rol: 'Administrador',
    operacion: 'Aprobó',
    tipo: 'Normativa',
    archivo: 'Ley_Movilidad_Campeche_2023.pdf',
    fecha: '22 Ago 2026',
    estatus: 'Aprobado',
    dictamen: false
  },
  {
    id: 'CAP-001',
    rol: 'Capturista',
    operacion: 'Actualización',
    tipo: 'Cartografía',
    archivo: 'red_vial_primaria_corredores',
    fecha: '20 Ago 2026',
    estatus: 'En Revisión',
    dictamen: false
  }
];

export default function BitacoraLogs() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const getRolStyle = (rol) => {
    if (rol === 'Capturista') return { bg: '#E6F4EA', color: '#047857' };
    return { bg: '#FEE2E2', color: '#B91C1C' }; 
  };

  const getOperacionStyle = (op) => {
    if (op === 'Rechazó') return { bg: '#FEE2E2', color: '#B91C1C' };
    if (op === 'Aprobó') return { bg: '#E6F4EA', color: '#047857' };
    return { bg: '#F3F4F6', color: '#4B5563' }; 
  };

  const getTipoStyle = (tipo) => {
    if (tipo === 'Cartografía') return { bg: '#EDE9FE', color: '#6D28D9' };
    return { bg: '#FCE7F3', color: '#BE185D' }; 
  };

  const getEstatusBadge = (estatus) => {
    switch (estatus) {
      case 'Rechazado':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEE2E2', color: '#B91C1C', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
            <XCircle size={14} /> Rechazado
          </span>
        );
      case 'Aprobado':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#E6F4EA', color: '#047857', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
            <CheckCircle size={14} /> Aprobado
          </span>
        );
      default: 
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F3F4F6', color: '#4B5563', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
            <Clock size={14} /> En Revisión
          </span>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'var(--font-body)' }}>
      
      <div style={{ background: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', gap: '16px', color: '#6B7280' }}>
          <Eye size={20} style={{ cursor: 'pointer' }} />
          <LogOut size={20} style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
        </div>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#9F2241', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              <ArrowLeft size={16} /> Regresar
            </button>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ margin: 0, fontSize: '24px', color: '#691C32', fontFamily: 'var(--font-heading)', fontWeight: 'bold' }}>Bitácora de Loggs</h1>
                <span style={{ border: '1px solid #D1D5DB', padding: '2px 10px', borderRadius: '16px', fontSize: '12px', color: '#6B7280', background: '#fff' }}>
                  Auditoría Institucional - Usuario: {userId}
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '13px' }}>
                Registro histórico de acciones dentro del sistema de los diferentes tipos de usuarios institucionales.
              </p>
            </div>
          </div>

          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#9F2241', border: '1px solid #9F2241', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
            <Download size={16} /> Exportar CSV
          </button>
        </div>

        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '8px 12px', flex: 1, minWidth: '250px' }}>
            <Search size={16} color="#9CA3AF" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Buscar ID, Rol, Cartografía o instrumento" 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="filter-select" style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', background: '#fff', outline: 'none' }}>
            <option value="">Día</option>
            {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>

          <select className="filter-select" style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', background: '#fff', outline: 'none' }}>
            <option value="">Mes</option>
            {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select className="filter-select" style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', background: '#fff', outline: 'none' }}>
            <option value="">Año</option>
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select className="filter-select" style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', background: '#fff', outline: 'none' }}>
            <option value="todos">Todos los roles</option>
            <option value="capturista">Capturista</option>
            <option value="administrador">Administrador</option>
          </select>

          <select className="filter-select" style={{ padding: '8px', border: '1px solid #9F2241', borderRadius: '6px', fontSize: '13px', background: '#fff', outline: 'none', color: '#9F2241', fontWeight: '600' }}>
            <option value="todos">Todos los Tipos</option>
            <option value="cartografia">Cartografía</option>
            <option value="normativa">Normativa</option>
          </select>

          <select className="filter-select" style={{ padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '13px', background: '#fff', outline: 'none' }}>
            <option value="todos">Todos los Estatus</option>
            <option value="aprobados">Aprobados</option>
            <option value="rechazados">Rechazados</option>
            <option value="revision">En Revisión</option>
          </select>
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <tr>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563' }}>ID</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563' }}>ROL</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563' }}>OPERACIÓN</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563' }}>TIPO</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563' }}>RECURSO / ARCHIVO</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563' }}>FECHA</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563' }}>ESTATUS</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#4B5563', textAlign: 'center' }}>DICTAMEN</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log, index) => {
                const rolStyle = getRolStyle(log.rol);
                const opStyle = getOperacionStyle(log.operacion);
                const tipoStyle = getTipoStyle(log.tipo);

                return (
                  <tr key={index} style={{ borderBottom: '1px solid #E5E7EB', background: '#fff' }}>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '600', color: '#B91C1C' }}>
                      <span style={{ background: '#FEE2E2', padding: '4px 8px', borderRadius: '4px' }}>{log.id}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: rolStyle.bg, color: rolStyle.color, padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '600' }}>
                        {log.rol}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: opStyle.bg, color: opStyle.color, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                        {log.operacion}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: tipoStyle.bg, color: tipoStyle.color, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                        {log.tipo}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#374151', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {log.tipo === 'Cartografía' ? <Map size={16} color="#4F46E5" /> : <FileText size={16} color="#E11D48" />}
                      {log.archivo}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#6B7280' }}>{log.fecha}</td>
                    <td style={{ padding: '16px' }}>
                      {getEstatusBadge(log.estatus)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {log.dictamen ? (
                        <button style={{ background: '#fff', border: '1px solid #F87171', color: '#E11D48', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <DownloadCloud size={14} /> Dictamen
                        </button>
                      ) : (
                        <span style={{ color: '#9CA3AF' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}