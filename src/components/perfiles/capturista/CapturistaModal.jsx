import React, { useState } from 'react';
import { X, UploadCloud, ArrowRight, ArrowLeft, CheckCircle, FileText, Database, AlertTriangle, File, Palette } from 'lucide-react';
import './Capturista.css';
import catalogos from '../../plataforma/catalogos_sesim.json';

const CapturistaModal = ({ isOpen, onClose, onVerify }) => {
  const [step, setStep] = useState(1);
  const [epsgConfirmed, setEpsgConfirmed] = useState(false);
  const [tipoIndicador, setTipoIndicador] = useState('');
  
  /* Estados para guardar los 3 archivos obligatorios en memoria */
  const [archivo, setArchivo] = useState(null);
  const [estilo, setEstilo] = useState(null);
  const [documento, setDocumento] = useState(null);

  if (!isOpen) return null;

  const handleNext = () => {
    /* Validacion estricta: Capa, Estilo, Documento y Confirmacion EPSG son obligatorios */
    if (step === 1 && (!epsgConfirmed || !archivo || !estilo || !documento)) return; 
    setStep(prev => Math.min(prev + 1, 3));
  };
  
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  /* Handlers Drag & Drop */
  const handleDropArchivo = (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setArchivo(e.dataTransfer.files[0]); };
  const handleDropEstilo = (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setEstilo(e.dataTransfer.files[0]); };
  const handleDropDocumento = (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setDocumento(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <>
      <div className="modal-drawer-overlay" onClick={onClose}></div>
      <div className="modal-drawer">
        
        <div className="modal-drawer-header">
          <div>
            <h3 style={{ margin: 0, color: 'var(--c-guinda)', fontFamily: 'var(--font-heading)' }}>
              Registrar Indicador
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Paso {step} de 3</span>
          </div>
          <button className="btn-close-drawer" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-drawer-content">
          
          {step === 1 && (
            <div className="wizard-step">
              <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-guinda-dk)' }}>
                <UploadCloud size={18} /> 1. Carga de Archivos
              </h4>

              {/* Zona A: Capa Espacial */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  A. Capa Espacial
                </label>
                <div className="drag-drop-zone" onDrop={handleDropArchivo} onDragOver={handleDragOver} style={{ padding: '20px', borderColor: archivo ? 'var(--c-guinda)' : 'var(--border-color)', background: archivo ? 'rgba(107, 20, 40, 0.05)' : '#f9fafb' }}>
                  {archivo ? (
                    <>
                      <File size={24} color="var(--c-guinda)" />
                      <p style={{ margin: '8px 0 4px', fontWeight: '600', color: 'var(--c-guinda)', fontSize: '13px' }}>{archivo.name}</p>
                      <button className="btn-outline-guinda" onClick={() => setArchivo(null)} style={{ marginTop: '4px', padding: '4px 10px', fontSize: '11px' }}>Quitar</button>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={20} color="var(--text-secondary)" />
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: '8px 0' }}>Formatos: <strong>GeoJSON, KML, GeoPackage o .zip</strong></p>
                      <label className="btn-outline-guinda" style={{ cursor: 'pointer', display: 'inline-block', padding: '4px 10px', fontSize: '11px' }}>
                        Explorar <input type="file" style={{ display: 'none' }} onChange={(e) => setArchivo(e.target.files[0])} />
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Advertencia EPSG */}
              <div style={{ marginBottom: '16px', padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={epsgConfirmed} onChange={(e) => setEpsgConfirmed(e.target.checked)} style={{ marginTop: '3px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '12px', color: '#991B1B', lineHeight: '1.4' }}>
                    <strong><AlertTriangle size={12} style={{ display: 'inline', marginBottom: '-2px' }}/> Advertencia:</strong> Solo se aceptan archivos con proyección <strong>EPSG:4326</strong>.
                  </span>
                </label>
              </div>

              {/* Zona B: Archivo de Estilo */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  B. Archivo de Estilo
                </label>
                <div className="drag-drop-zone" onDrop={handleDropEstilo} onDragOver={handleDragOver} style={{ padding: '20px', borderColor: estilo ? 'var(--c-guinda)' : 'var(--border-color)', background: estilo ? 'rgba(107, 20, 40, 0.05)' : '#f9fafb' }}>
                  {estilo ? (
                    <>
                      <Palette size={24} color="var(--c-guinda)" />
                      <p style={{ margin: '8px 0 4px', fontWeight: '600', color: 'var(--c-guinda)', fontSize: '13px' }}>{estilo.name}</p>
                      <button className="btn-outline-guinda" onClick={() => setEstilo(null)} style={{ marginTop: '4px', padding: '4px 10px', fontSize: '11px' }}>Quitar</button>
                    </>
                  ) : (
                    <>
                      <Palette size={20} color="var(--text-secondary)" />
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: '8px 0' }}>Formatos: <strong>.SLD o .QML</strong></p>
                      <label className="btn-outline-guinda" style={{ cursor: 'pointer', display: 'inline-block', padding: '4px 10px', fontSize: '11px' }}>
                        Explorar <input type="file" accept=".sld,.qml" style={{ display: 'none' }} onChange={(e) => setEstilo(e.target.files[0])} />
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Zona C: Expediente Técnico PDF */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  C. Expediente Técnico / Legal
                </label>
                <div className="drag-drop-zone" onDrop={handleDropDocumento} onDragOver={handleDragOver} style={{ padding: '20px', borderColor: documento ? 'var(--c-guinda)' : 'var(--border-color)', background: documento ? 'rgba(107, 20, 40, 0.05)' : '#f9fafb' }}>
                  {documento ? (
                    <>
                      <FileText size={24} color="var(--c-guinda)" />
                      <p style={{ margin: '8px 0 4px', fontWeight: '600', color: 'var(--c-guinda)', fontSize: '13px' }}>{documento.name}</p>
                      <button className="btn-outline-guinda" onClick={() => setDocumento(null)} style={{ marginTop: '4px', padding: '4px 10px', fontSize: '11px' }}>Quitar</button>
                    </>
                  ) : (
                    <>
                      <FileText size={20} color="var(--text-secondary)" />
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center', margin: '8px 0' }}>Formatos: <strong>.PDF</strong></p>
                      <label className="btn-outline-guinda" style={{ cursor: 'pointer', display: 'inline-block', padding: '4px 10px', fontSize: '11px' }}>
                        Explorar <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => setDocumento(e.target.files[0])} />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step">
              <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-guinda-dk)' }}><FileText size={18} /> 2. Ficha Técnica Institucional</h4>
              <div className="form-group"><label>Nombre de la Capa (Título)</label><input type="text" className="form-input" placeholder="Ej. Red Vial Primaria" /></div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label>Categoría</label><select className="form-input"><option value="">Seleccione...</option>{catalogos.cat_categoria.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}</select></div>
                <div><label>Cobertura Territorial</label><select className="form-input"><option value="">Seleccione...</option>{catalogos.cat_cobertura.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}</select></div>
              </div>
              <div className="form-group"><label>Instrumento de Origen</label><select className="form-input"><option value="">Seleccione el marco normativo...</option>{catalogos.cat_instrumento.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}</select></div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label>Escala Responsable</label><select className="form-input"><option value="">Seleccione...</option>{catalogos.cat_responsable.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}</select></div>
                <div><label>Periodicidad</label><select className="form-input"><option value="">Seleccione...</option>{catalogos.cat_periodicidad.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}</select></div>
              </div>
              <div className="form-group">
                <label>Eje de Evaluación</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  {catalogos.cat_eje_evaluacion.map(item => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '400', fontSize: '13px' }}><input type="radio" name="eje" value={item.id} onChange={(e) => setTipoIndicador(e.target.value)} /> {item.etiqueta}</label>
                  ))}
                </div>
              </div>
              {tipoIndicador === 'sectorial' && (<div className="form-group"><label>Sector Asociado</label><select className="form-input"><option value="">Seleccione sector...</option>{catalogos.cat_sector.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}</select></div>)}
              {tipoIndicador === 'desempeno' && (<div className="form-group"><label>Horizonte de Planeación</label><select className="form-input"><option value="">Seleccione horizonte...</option>{catalogos.cat_horizonte.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}</select></div>)}
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label>Restricciones de Uso</label><select className="form-input"><option value="">Seleccione...</option><option value="publico">Público</option><option value="restringido">Restringido</option></select></div>
                <div><label>Fuente (Institución/Año)</label><input type="text" className="form-input" placeholder="Ej. INEGI, 2024" /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step">
              <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--c-guinda-dk)' }}><Database size={18} /> 3. Validación de Estructura SQL</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Para proteger la integridad de la base de datos, su archivo debe cumplir con los lineamientos del diccionario de datos.</p>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--c-bg)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    <tr><th style={{ padding: '10px 12px' }}>Campo</th><th style={{ padding: '10px 12px' }}>Esperado</th><th style={{ padding: '10px 12px' }}>Detectado</th><th style={{ padding: '10px 12px', textAlign: 'center' }}>Estatus</th></tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px dashed #E5E7EB' }}><td style={{ padding: '10px 12px', fontWeight: '600', fontFamily: 'monospace' }}>cve_ent</td><td style={{ padding: '10px 12px', color: '#3B82F6' }}>Texto</td><td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>cve_ent</td><td style={{ padding: '10px 12px', textAlign: 'center', color: '#10B981' }}>✅</td></tr>
                    <tr style={{ background: '#FEF2F2' }}><td style={{ padding: '10px 12px', fontWeight: '600', fontFamily: 'monospace' }}>poblacion</td><td style={{ padding: '10px 12px', color: '#10B981' }}>Numérico</td><td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#DC2626' }}>Texto</td><td style={{ padding: '10px 12px', textAlign: 'center', color: '#DC2626' }}>❌</td></tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '16px', padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', fontSize: '12px', color: '#991B1B', lineHeight: '1.4' }}>
                <strong><AlertTriangle size={14} style={{ display: 'inline', marginBottom: '-2px' }}/> Error:</strong> La estructura no coincide. Por favor, <strong>corrija la tabla de atributos</strong> y vuelva a intentarlo.
              </div>
            </div>
          )}
        </div>

        <div className="modal-drawer-footer">
          {step > 1 ? <button className="btn-outline-guinda" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowLeft size={16} /> Atrás</button> : <div></div>}
          {step < 3 ? (
            <button className="btn-solid-guinda" onClick={handleNext} disabled={step === 1 && (!epsgConfirmed || !archivo || !estilo || !documento)} style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: (step === 1 && (!epsgConfirmed || !archivo || !estilo || !documento)) ? 0.5 : 1, cursor: (step === 1 && (!epsgConfirmed || !archivo || !estilo || !documento)) ? 'not-allowed' : 'pointer' }}>Siguiente <ArrowRight size={16} /></button>
          ) : (
            <button className="btn-solid-guinda" onClick={() => onVerify(archivo?.name || 'capa_nueva')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#10B981' }}><CheckCircle size={16} /> Verificar en geovisualizador</button>
          )}
        </div>
      </div>
    </>
  );
};

export default CapturistaModal;