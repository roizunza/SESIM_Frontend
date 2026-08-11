/**
 * Carga del Mapa Base de Campeche traído del geovisor PEOTDU.
 *
 * Punto único de acceso a esos datos: si mañana dejan de ser GeoJSON estáticos
 * y pasan a una API, solo cambia este archivo. Ver MAPA-BASE-TRASPASO.md.
 *
 * No importa Leaflet ni React a propósito: solo carga y empareja simbología.
 */

import { createSymbolResolver } from './qgisSymbology'

const BASE = '/Datos/MapaBase'

/**
 * Las 13 capas con datos, **en el orden del árbol de QGIS**: la primera va
 * encima. Quien las dibuje debe respetarlo o el mapa no se ve como el original.
 *
 * `fija` marca las que en el visor original se dibujan siempre con el módulo
 * pero no aparecen en el menú: el usuario no las apaga por separado.
 */
export const CAPAS_MAPA_BASE = [
  { id: 'estatal', label: 'Límite Estatal' },
  { id: 'C04_Municipios', label: 'Límites Municipales' },
  { id: 'C04_BUFER_ESTATAL', label: 'Búfer Estatal' },
  { id: 'C04_Puertos_reg', label: 'Puertos', fija: true },
  { id: 'C04_Aeropuertos_2012', label: 'Aeropuertos', fija: true },
  { id: 'C04_estaciones_RFN25', label: 'Estaciones Ferroviarias', fija: true },
  { id: 'C04_Loc_rur', label: 'Localidades Rurales' },
  { id: 'C04_RFN_2024', label: 'Red Ferroviaria Nacional' },
  { id: 'RNC_2025_SURESTE', label: 'Red Nacional de Caminos' },
  { id: 'C04_corr_agua_2003', label: 'Corrientes de Agua', fija: true },
  { id: 'C04_Loc_urb', label: 'Localidades Urbanas' },
  { id: 'C04_ANP_2024', label: 'Áreas Naturales Protegidas' },
  { id: 'C04_ZonasMetropolitanas', label: 'Zonas Metropolitanas' },
]

const IDS = new Set(CAPAS_MAPA_BASE.map((c) => c.id))

/**
 * El volcado nombra las capas sin el prefijo `C04_` y los archivos sí lo llevan.
 * Sin probar el prefijo no empareja ninguna y el mapa sale vacío sin errores.
 */
function resolverId(nombre) {
  if (!nombre) return null
  if (IDS.has(nombre)) return nombre
  if (IDS.has(`C04_${nombre}`)) return `C04_${nombre}`
  return null
}

/** Volcado nuevo: plano, con `nombre_tabla`. Aporta el árbol y el orden. */
function simbologiaDelNuevo(json) {
  const out = {}
  for (const capa of json.capas ?? []) {
    if (capa?.tipo === 'raster') continue
    const id = resolverId(capa.nombre_tabla || capa.nombre)
    if (id) out[id] = capa.simbologia
  }
  return out
}

/** Volcado viejo: árbol anidado por grupos. Aporta la simbología detallada. */
function simbologiaDelViejo(nodo, out = {}) {
  if (nodo?.tipo === 'grupo') {
    for (const hijo of nodo.capas ?? []) simbologiaDelViejo(hijo, out)
    return out
  }
  const id = resolverId(nodo?.nombre)
  if (id) out[id] = nodo.simbologia
  return out
}

/**
 * Carga las 13 capas con su simbología ya resuelta.
 *
 * Hacen falta **los dos** volcados: el nuevo trae el árbol y capas que el viejo
 * no tenía, pero dejó de exportar la forma del marcador, el desplazamiento y el
 * ángulo. Por eso el viejo pisa al nuevo en las capas que ambos describen: sin
 * eso los iconos de aeropuertos, puertos y estaciones se vuelven círculos y la
 * trama cruzada del ANP desaparece.
 */
export async function cargarMapaBase() {
  const [nuevo, viejo] = await Promise.all([
    fetch(`${BASE}/estilos/00_Mapa_Base_simbologia.json`).then((r) => r.json()),
    fetch(`${BASE}/estilos/Mapa_Base.json`).then((r) => r.json()),
  ])

  const simbologias = { ...simbologiaDelNuevo(nuevo), ...simbologiaDelViejo(viejo) }

  return Promise.all(
    CAPAS_MAPA_BASE.map(async (capa) => ({
      ...capa,
      simbologia: simbologias[capa.id] ?? null,
      /**
       * Resolvedor con memoria, uno por capa. Leaflet consulta la simbología
       * tres veces por elemento (`filter`, `style`, `pointToLayer`), y la Red
       * Nacional de Caminos tiene 76 897 tramos que producen solo 7 símbolos
       * distintos. Sin esto son ~154 000 resoluciones para nada.
       */
      simboloDe: createSymbolResolver(simbologias[capa.id] ?? null),
      data: await fetch(`${BASE}/${encodeURIComponent(capa.id)}.geojson`).then((r) => r.json()),
    }))
  )
}
