import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  LayoutDashboard, 
  FileSpreadsheet, 
  Cpu, 
  TrendingUp, 
  Compass, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import './Inicio.css';

const Inicio = () => {
  return (
    <div className="inicio-page">
      <div className="hero-section">
        <h1>Sistema de Indicadores de Movilidad (SIM)</h1>
        <p className="hero-subtitle">
          Plataforma centralizada para la consulta, análisis y visualización geoespacial de la movilidad en el Estado de Campeche.
        </p>
      </div>

      <div className="intro-section no-container">
        <h2>Introducción</h2>
        <div className="intro-content">
          <p>
            El SIM (Sistema de Indicadores de Movilidad) surge de la necesidad de consolidar una plataforma que permita organizar, estructurar y hacer operativa la información en materia de movilidad y seguridad vial para el Estado de Campeche. En la actualidad, existe un amplio conjunto de indicadores, metas y variables definidos en distintos instrumentos normativos que se encuentran dispersos y bajo criterios heterogéneos, lo que limita su máximo aprovechamiento.
          </p>
          <p>
            Esta plataforma funciona como un mecanismo de gobernanza diseñado para articular a los actores públicos, privados y sociales en la definición y cumplimiento de las directrices sectoriales. El sistema no es un simple repositorio de datos, sino un entorno digital que transforma la información dispersa en un modelo de seguimiento estructurado, comparable y actualizable en el tiempo.
          </p>
        </div>
      </div>

      <div className="objectives-section">
        <h2>Objetivos del Sistema</h2>
        <div className="objectives-grid">
          <div className="objective-card">
            <Cpu size={28} className="objective-icon" />
            <p>Diseñar e implementar una herramienta tecnológica que permita integrar, homologar, registrar, validar, territorializar y reportar la información de manera estructurada y consistente.</p>
          </div>
          
          <div className="objective-card">
            <TrendingUp size={28} className="objective-icon" />
            <p>Mejorar la gestión de la política de movilidad y la seguridad vial mediante el uso de evidencias fiables, facilitando la toma de decisiones institucionales.</p>
          </div>
          
          <div className="objective-card">
            <Compass size={28} className="objective-icon" />
            <p>Establecer una metodología clara para la recopilación y sistematización de los datos generados por los diversos actores que operan el sistema de movilidad.</p>
          </div>
          
          <div className="objective-card">
            <Layers size={28} className="objective-icon" />
            <p>Permitir la consulta ágil y el análisis del comportamiento de los indicadores a través del tiempo y su respectiva distribución en el territorio estatal.</p>
          </div>
          
          <div className="objective-card">
            <ShieldCheck size={28} className="objective-icon" />
            <p>Asegurar la viabilidad operativa y la continuidad del sistema a largo plazo mediante la definición de protocolos estrictos de actualización, validación y gobernanza de datos.</p>
          </div>
        </div>
      </div>

      <div className="methodology-section">
        <h2>Metodología</h2>
        <div className="methodology-intro">
          <p>
            La metodología propuesta se fundamenta en un enfoque integral que articula de manera estructurada el componente metodológico y el componente tecnológico. El objetivo es realizar una transformación progresiva de la información, comenzando con el reconocimiento de datos dispersos en diversos instrumentos normativos y de planeación, hasta consolidarlos en un sistema estatal operable. Esta transformación exige establecer criterios de medición comunes para homologar la información, garantizando su consistencia conceptual y comparabilidad a lo largo del tiempo.
          </p>
        </div>
        
        <div className="methodology-sub">
          <h3>Indicadores</h3>
          <p className="methodology-sub-desc">
            Para el diseño y estructuración de los indicadores, se utiliza como herramienta principal la Matriz de Indicadores para Resultados (MIR) fundamentada en la Metodología del Marco Lógico (MML). Esta construcción metodológica se divide en dos procesos centrales:
          </p>
          
          <div className="methodology-cards">
            <div className="methodology-card">
              <span className="card-badge">Proceso 1</span>
              <h4>Desarrollo conceptual</h4>
              <p>
                Inicia con la delimitación del alcance utilizando fuentes como la Estrategia Nacional de Movilidad y Seguridad Vial (ENMOV) y los Planes Integrales de Movilidad Urbana Sustentable. Posteriormente, se definen los objetivos, se clasifican los indicadores temáticamente y se elaboran fichas técnicas detalladas que incluyen fórmulas, unidades de medida, medios de verificación y líneas base.
              </p>
            </div>
            
            <div className="methodology-card">
              <span className="card-badge">Proceso 2</span>
              <h4>Sistematización operativa</h4>
              <p>
                Consiste en incorporar los indicadores a una lógica de funcionamiento dentro del sistema. Define el flujo de la información mediante procesos de captura, organización, registro, homologación, validación institucional, consulta y territorialización.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="modules-section">
        <h2>Módulos del Sistema</h2>
        <div className="module-cards">
          <div className="module-card">
            <LayoutDashboard size={32} className="card-icon" />
            <h3>Dashboard y Geovisor SIG</h3>
            <p>Explora métricas globales y visualiza capas territoriales en el mapa interactivo.</p>
            <Link to="/dashboard" className="card-link">
              Ir al Dashboard <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="module-card">
            <FileSpreadsheet size={32} className="card-icon" />
            <h3>Matriz de Indicadores</h3>
            <p>Consulta el catálogo general y registra información en la bandeja de captura.</p>
            <Link to="/matriz" className="card-link">
              Ir a la Matriz <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;


