# Mapa Base de Campeche: cómo integrarlo en sesim

Este paquete viene del geovisor PEOTDU (`Downloads/peotdu-campeche`). Trae la
cartografía del **Mapa Base** ya procesada y la simbología real del proyecto
QGIS, para que sesim la pinte **igual que en QGIS** en vez de con estilos
escritos a mano.

Documento autocontenido: no hace falta abrir el otro proyecto para seguirlo.

## Qué se copió

```
public/Datos/MapaBase/           13 GeoJSON (50 MB)
public/Datos/MapaBase/estilos/   Mapa_Base.json + 00_Mapa_Base_simbologia.json
src/lib/qgisSymbology.ts         traducción QGIS → símbolo (puro, sin dependencias)
src/lib/leafletSymbology.ts      adaptador a Leaflet (solo importa `leaflet`)
```

No se tocó ningún archivo existente de sesim.

Los GeoJSON ya vienen **reproyectados a EPSG:4326**, con el mojibake del origen
reparado y las coordenadas recortadas a 6 decimales (≈11 cm). **No hay que
reproyectarlos ni recodificarlos**: ya pasaron por ese pipeline.

## Las 13 capas, en orden de dibujo

El orden es el del árbol de QGIS y **la primera va encima**. Respétalo o el mapa
no se verá como el original.

| # | id (= nombre de archivo) | geometría | nota |
|---|---|---|---|
| 1 | `estatal` | polígono | |
| 2 | `C04_Municipios` | polígono | |
| 3 | `C04_BUFER_ESTATAL` | polígono | |
| 4 | `C04_Puertos_reg` | punto | fija |
| 5 | `C04_Aeropuertos_2012` | punto | fija |
| 6 | `C04_estaciones_RFN25` | punto | fija |
| 7 | `C04_Loc_rur` | punto | |
| 8 | `C04_RFN_2024` | línea | 11 MB |
| 9 | `RNC_2025_SURESTE` | línea | **32 MB, 76 897 elementos** |
| 10 | `C04_corr_agua_2003` | línea | fija |
| 11 | `C04_Loc_urb` | polígono | |
| 12 | `C04_ANP_2024` | polígono | |
| 13 | `C04_ZonasMetropolitanas` | polígono | |

**Fija** significa que en el visor original se dibuja siempre con el módulo pero
no aparece en el menú de capas: el usuario no la puede apagar por separado. Es
una decisión de UI, adóptala o no.

`RNC_2025_SURESTE` es el 65% del peso del paquete. Si sesim va lento, es la
primera candidata a simplificar o a servir como teselas vectoriales.

## Los estilos son dos archivos, y hacen falta los dos

Esta es la parte fácil de arruinar.

- **`00_Mapa_Base_simbologia.json`** (volcado nuevo) — aporta el **árbol, el
  orden de dibujo** y dos capas que el viejo no tenía.
- **`Mapa_Base.json`** (volcado viejo) — aporta la **simbología buena** de las
  once capas que ya existían.

El volcado nuevo **dejó de exportar la forma del marcador, el desplazamiento y el
ángulo**. Si usas solo el nuevo, los iconos de aeropuertos, puertos y estaciones
se vuelven círculos y la trama cruzada del ANP desaparece.

La receta del visor original: leer el árbol del **nuevo** y, para cada capa que
también esté en el **viejo**, quedarse con la simbología del viejo.

### Los nombres no coinciden con los archivos

El volcado nuevo nombra las capas **sin el prefijo `C04_`** (`Municipios`,
`Loc_urb`, `ANP_2024`...) mientras los archivos sí lo llevan. Al resolver el id
hay que probar el prefijo antes de descartar la capa:

```js
const id = existe(nombre) ? nombre : existe(`C04_${nombre}`) ? `C04_${nombre}` : null
```

Sin esto no empareja **ninguna** capa y el mapa sale vacío sin errores en consola.

Dos entradas del volcado nuevo no tienen datos y hay que ignorarlas:
`C04_CESC_OPMATPG_2023` y `catp50s3gw` (esta última son 208 000 elementos, ~450 MB
como GeoJSON; se dejó fuera a propósito).

## Cómo se pinta

`qgisSymbology.ts` no importa nada — ni Leaflet ni React. `leafletSymbology.ts`
solo importa `leaflet`, que sesim ya tiene. Aunque sesim sea JavaScript, **Vite
transpila `.ts` sin configurar nada**; lo único que pierdes es el typecheck.

API que vas a usar:

```ts
resolveSymbol(simbologia, properties) → ResolvedSymbol | null
resolveLegend(simbologia)             → LegendEntry[]
toPathOptions(symbol, userOpacity)    → L.PathOptions      // líneas y polígonos
toPointLayer(symbol, latlng, opacity) → L.Layer | null     // puntos
toSwatchSvg(symbol, w?, h?)           → string | null      // muestra de leyenda
```

`resolveSymbol` devuelve **`null` cuando QGIS no dibujaría el elemento** (clase
con `renderizado: false`, valor sin categoría, valor fuera de los rangos
graduados). Quien llama debe **omitirlo, no pintarlo de un color por defecto**.

Con react-leaflet encaja directo, porque `<GeoJSON>` recibe los mismos objetos de
Leaflet:

```jsx
<GeoJSON
  data={capa}
  style={(feature) => toPathOptions(resolveSymbol(simbologia, feature.properties), 1)}
  pointToLayer={(feature, latlng) =>
    toPointLayer(resolveSymbol(simbologia, feature.properties), latlng, 1)}
  filter={(feature) => resolveSymbol(simbologia, feature.properties) !== null}
/>
```

El `filter` es lo que respeta los `null`. Sin él, react-leaflet intenta dibujar
elementos que QGIS oculta.

## Leyenda: nunca una tabla de colores en paralelo

Si haces leyenda, constrúyela con `resolveLegend()` + `toSwatchSvg()` sobre la
**misma** simbología que pinta el mapa. `resolveLegend` lista todas las clases sin
necesitar los datos y aplica los mismos descartes, así que lo que el mapa no pinta
tampoco se lista.

En el proyecto original esto ya se rompió una vez por mantener una tabla de
colores aparte: sus ids escritos a mano dejaron de coincidir con los de las capas
y el recuadro entero desapareció, sin un solo error en consola.

## Antes de integrar: capas que se traslapan

sesim ya tiene cartografía que probablemente sea lo mismo de otra fuente:

| ya en sesim | equivalente en este paquete |
|---|---|
| `Datos/Sociedad/Loc_rur.geojson` | `C04_Loc_rur` |
| `Datos/Infraestructura/Via_Ferrea.geojson` | `C04_RFN_2024` |
| `Datos/Infraestructura/Red_vial.geojson` | `RNC_2025_SURESTE` (probable) |
| `Datos/Lim_Est_Base.json` | `estatal` |
| `Datos/Lim_Mun_Base.json` | `C04_Municipios` |

**Decide cuál gana antes de conectar nada**, o vas a dibujar dos veces la misma
geometría con estilos distintos. Compara conteo de elementos y CRS: las de este
paquete traen además campos de metadatos (`denominacion_oficial`,
`fuente_custodio`, `instrumento_vigencia`, `restricciones_uso`) que las otras
quizá no tengan.

## Una trampa que ya costó cara

Si una capa **no se ve y la consola está limpia**, sospecha del CRS antes que del
render: mira la primera coordenada de su GeoJSON. Si son números de seis o siete
cifras, está proyectada, no en 4326.

Pasó con `C04_Loc_urb`: el GeoPackage de origen la declaraba en EPSG:4326 pero sus
coordenadas seguían en EPSG:6372 (Mexico ITRF2008 / LCC). Leaflet creaba los
`<path>` pero ninguno caía nunca dentro de la vista. **La copia de este paquete ya
está corregida** — el aviso es por si algún día traes más capas del mismo origen.

## Si necesitas volver a la fuente

Los GeoPackage originales están en `Downloads/peotdu-campeche/cartografia/`
(fuera de git, ~417 MB). El Mapa Base sale de `pendientes/00_Mapa_Base.gpkg`, que
trae **cada capa duplicada con y sin el prefijo `C04_`** y no siempre la variante
correcta es la misma. El script de extracción y su documentación están en
`extract_gpkg.py` y `docs/pipeline-cartografia.md` de ese proyecto.
