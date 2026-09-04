import React, { useState } from 'react';
import { X, ChevronRight, ArrowRight, ArrowLeft, FileText, CloudUpload, PlusCircle, RefreshCw, CheckCircle } from 'lucide-react';
import './Capturista.css';

const InstrumentoModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [tipoOperacion, setTipoOperacion] = useState('nuevo');
  const [documento, setDocumento] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Estado para la ficha tecnica
  const [formData, setFormData] = useState({
    titulo: '',
    fuente: '',
    responsable: 'Gobierno de Campeche',
    escala: '',
    periodicidad: '',
    monitor: '',
    origen: '',
    fecha: '',
    horizonte: '',
    eje: ''
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && !documento) return;
    setStep(prev => Math.min(prev + 1, 3));
  };
  
  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.pdf')) {
      setDocumento(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="modal-drawer-overlay" onClick={onClose}></div>
      <div className="modal-drawer">
        
        <div className="modal-drawer-header" style={{ padding: '20px 24px', background: '#F9FAFB' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', color: 'var(--c-guinda)', fontFamily: 'var(--font-heading)', fontSize: '18px' }}>
              Registrar Instrumento Normativo
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Paso {step} de 3 — Modo: Nuevo
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ChevronRight size={16} color="#9CA3AF" />
            <button className="btn-close-drawer" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        <div className="modal-drawer-content" style={{ padding: '24px' }}>
          
          {/* PASO 1: CARGA DE ARCHIVOS */}
          {step === 1 && (
            <div className="wizard-step">
              <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-guinda-dk)', fontSize: '16px' }}>
                <CloudUpload size={20} /> 1. Carga de Archivos
              </h4>

              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--c-guinda)', marginBottom: '12px', textTransform: 'uppercase' }}>TIPO DE OPERACIÓN</label>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-primary)', fontWeight: tipoOperacion === 'nuevo' ? '600' : '400' }}>
                    <input type="radio" name="operacion" value="nuevo" checked={tipoOperacion === 'nuevo'} onChange={(e) => setTipoOperacion(e.target.value)} />
                    <PlusCircle size={16} color="#9F2241" /> Nuevo elemento
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <input type="radio" name="operacion" value="actualizar" checked={tipoOperacion === 'actualizar'} onChange={(e) => setTipoOperacion(e.target.value)} />
                    <RefreshCw size={16} color="#3B82F6" /> Actualizar existente
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Documento Normativo en PDF <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div 
                  className="drag-drop-zone" 
                  onDrop={handleDrop} 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} 
                  onDragLeave={() => setDragActive(false)}
                  style={{ 
                    padding: '40px 20px', 
                    border: '1px dashed #D1D5DB',
                    borderRadius: '8px',
                    background: documento || dragActive ? 'rgba(159, 34, 65, 0.02)' : '#F9FAFB',
                    textAlign: 'center'
                  }}
                >
                  {documento ? (
                    <>
                      <FileText size={32} color="var(--c-guinda)" style={{ marginBottom: '12px' }} />
                      <p style={{ margin: '0 0 16px', fontWeight: '600', color: 'var(--text-primary)', fontSize: '13px' }}>{documento.name}</p>
                      <button className="btn-base" onClick={() => setDocumento(null)} style={{ background: '#fff', border: '1px solid #9F2241', color: '#9F2241', width: 'auto', padding: '6px 16px', borderRadius: '6px', fontSize: '12px' }}>Quitar archivo</button>
                    </>
                  ) : (
                    <>
                      <FileText size={28} color="#6B7280" style={{ marginBottom: '12px' }} />
                      <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 4px', fontWeight: '500' }}>Arrastra tu archivo aquí o</p>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 16px', fontWeight: '600' }}>Formatos: .PDF</p>
                      <label className="btn-base" style={{ cursor: 'pointer', width: 'auto', background: '#fff', border: '1px solid #9F2241', color: '#9F2241', padding: '8px 24px', borderRadius: '6px', fontSize: '13px', fontWeight: '500' }}>
                        Explorar
                        <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => { if(e.target.files[0]) setDocumento(e.target.files[0]); }} />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: FICHA TECNICA */}
          {step === 2 && (
            <div className="wizard-step">
              <h4 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-guinda-dk)', fontSize: '16px' }}>
                <FileText size={20} /> 2. Ficha Técnica Institucional
              </h4>
              
              <div className="form-group">
                <label>Título del Instrumento</label>
                <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="form-input" placeholder="Ej. Programa Municipal de Movilidad Urbana Sustentable" />
              </div>
              
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Fuente</label>
                  <select name="fuente" value={formData.fuente} onChange={handleChange} className="form-input"><option value="">Seleccione fuente...</option></select>
                </div>
                <div>
                  <label>Responsable</label>
                  <select name="responsable" value={formData.responsable} onChange={handleChange} className="form-input"><option value="Gobierno de Campeche">Gobierno de Campeche</option></select>
                </div>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Escala Territorial</label>
                  <select name="escala" value={formData.escala} onChange={handleChange} className="form-input"><option value="">Seleccione escala...</option></select>
                </div>
                <div>
                  <label>Periodicidad</label>
                  <select name="periodicidad" value={formData.periodicidad} onChange={handleChange} className="form-input"><option value="">Seleccione periodicidad...</option></select>
                </div>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Monitor</label>
                  <select name="monitor" value={formData.monitor} onChange={handleChange} className="form-input"><option value="">Seleccione monitor...</option></select>
                </div>
                <div>
                  <label>Instrumento de Origen</label>
                  <select name="origen" value={formData.origen} onChange={handleChange} className="form-input"><option value="">Seleccione el marco normativo...</option></select>
                </div>
              </div>

              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Fecha</label>
                  <select name="fecha" value={formData.fecha} onChange={handleChange} className="form-input"><option value="">Seleccione año...</option></select>
                </div>
                <div>
                  <label>Horizonte de Planeación</label>
                  <select name="horizonte" value={formData.horizonte} onChange={handleChange} className="form-input"><option value="">Seleccione horizonte...</option></select>
                </div>
              </div>

              <div className="form-group">
                <label>Eje de Evaluación</label>
                <select name="eje" value={formData.eje} onChange={handleChange} className="form-input"><option value="">Seleccione eje...</option></select>
              </div>
            </div>
          )}

          {/* PASO 3: VALIDACION DE DATOS */}
          {step === 3 && (
            <div className="wizard-step">
              <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-guinda-dk)', fontSize: '16px' }}>
                <FileText size={20} /> 3. Validación de Datos
              </h4>
              <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px', lineHeight: '1.4' }}>
                Revise la previsualización del documento y los datos capturados en la ficha técnica antes de enviar a revisión.
              </p>

              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ background: '#F9FAFB', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', fontSize: '12px', fontWeight: '600', color: 'var(--c-guinda)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={14}/> Vista Previa: Primera Página</span>
                  <span style={{ color: '#9CA3AF', fontWeight: '400' }}>Documento.pdf</span>
                </div>
                <div style={{ padding: '40px 20px', textAlign: 'center', background: '#fff' }}>
                  <FileText size={40} color="#FCA5A5" style={{ marginBottom: '12px' }} />
                  <h5 style={{ margin: '0 0 8px', fontSize: '14px', color: '#1F2937' }}>{documento ? documento.name : 'Instrumento_Normativo.pdf'}</h5>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>Primera página lista para dictamen administrativo</p>
                </div>
              </div>

              <h5 style={{ color: 'var(--c-guinda)', fontSize: '14px', marginBottom: '12px', fontWeight: '700' }}>Ficha Técnica Institucional</h5>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', width: '35%', fontWeight: '600', color: '#4B5563' }}>Título / Documento:</td><td style={{ padding: '12px 16px', fontWeight: '600' }}>{formData.titulo || 'Nuevo Instrumento'}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Fuente:</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.fuente || 'No especificada'}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Responsable:</td><td style={{ padding: '12px 16px', color: '#374151' }}>{formData.responsable}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Escala Territorial:</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.escala || 'No especificada'}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Periodicidad:</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.periodicidad || 'No especificada'}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Monitor:</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.monitor || 'No Especificado'}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Instrumento de Origen:</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.origen || 'No especificado'}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Fecha (Año):</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.fecha || 'No especificada'}</td></tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Horizonte de Planeación:</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.horizonte || 'No Especificado'}</td></tr>
                    <tr><td style={{ padding: '12px 16px', background: '#F9FAFB', fontWeight: '600', color: '#4B5563' }}>Eje de Evaluación:</td><td style={{ padding: '12px 16px', color: '#6B7280' }}>{formData.eje || 'No Especificado'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        <div className="modal-drawer-footer" style={{ borderTop: '1px solid #E5E7EB', padding: '16px 24px', background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
          {step > 1 ? (
            <button className="btn-base" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #9F2241', color: '#9F2241', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
              <ArrowLeft size={16} /> Atrás
            </button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button 
              className="btn-base" 
              onClick={handleNext} 
              disabled={step === 1 && !documento} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: (step === 1 && !documento) ? '#E5E7EB' : '#9F2241', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: (step === 1 && !documento) ? 'not-allowed' : 'pointer' }}
            >
              Siguiente <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              className="btn-base" 
              onClick={() => onSubmit(documento?.name || 'Instrumento_Normativo.pdf')} 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10B981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              <CheckCircle size={16} /> Enviar a revisión
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default InstrumentoModal;