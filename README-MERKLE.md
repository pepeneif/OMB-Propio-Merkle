# OMB-Propio-Merkle

> **Versión propia de Merkle.Space** — instalación **independiente** de OpenMausBot. Hoy:
> **v0.1.180 + el port propio** en alfa (imagen `v0.1.180-cos-r5`) y **v0.1.171 + parches 022–032**
> en beta (imagen `v0.1.171-cos-r11`).

Repo propio de **Merkle.Space** para nuestro uso personal. **No es un fork de trabajo del upstream**:
el upstream sigue conectado para mandar parches, pero aquí vive nuestra copia con nuestras
modificaciones y la bitácora.

- **Repo:** `pepeneif/OMB-Propio-Merkle` (público, independiente).
- **Estado vigente:** rama **`merkle/v180-cos`** → `807e187f5` (r5), lo que corre **alfa**.
- **Beta:** rama `merkle/v171-p0008` → `f47143010`, imagen `openmausbot:v0.1.171-cos-r11`.
- El repo `pepeneif/OMB-Merkle` es el fork histórico del upstream (v0.1.130 → 171). **La 180 no se sube
  ahí**: vive solo en este repo.

## Ramas

- **`merkle/v180-cos`** (`807e187f5`) = **estado vigente en alfa**: v0.1.180 + el port propio + r2 a r5.
- **`merkle/v171-p0008`** (`f47143010`) = **lo que corre beta**: v0.1.171 + 022–032.
- **`merkle/v171-cos-r10`** (`e2cc7b13b`) = anterior: v0.1.171 + 022–031. Rollback de beta.
- `merkle/v170-cos` (`9947747aa`) = anterior (v0.1.170 + 022 + 023 + gate).
- `merkle/v169-cos` (`d040e854`) = v0.1.169 + parches 001–022 + cosméticos + riel.
- `merkle/v169-port`, `merkle/v169-mcpgate`, `merkle/v167-port`, `merkle/v165-port`, `merkle/v153-port`,
  `merkle/port-v143`, `base-v0.1.140` = etapas anteriores, conservadas como historia.

## La línea v0.1.180 (alfa, 2026-11-25/26)

Árbol `/home/pepeneif/omb-180-cos` (worktree de `omb-140-src`), rama `merkle/v180-cos` desde
**`v0.1.180`** (`5478065c4`). El port son **130 archivos, +2,836/−538**. Del linaje v171 se portaron
el 022 (captura del navegador a disco), el 023 (gate MCP de tres herramientas), el 024 (fuera la
pastilla «Chat activity»), el 031 (compactación de 24k) y el arreglo de `isImageModel` en
`fastModelFor`; el **028** se rehízo porque `MESSAGE_PAGE_SIZE` vive ahora en
`src/state/message-history.ts`. **La Skill Burger de la 180 se quedó completa, sin tocar.**

| Commit | Imagen | Qué trae |
|---|---|---|
| `8cc8c7390` | `v0.1.180-cos-r1` (`01a126473bb3`) | El port completo a v0.1.180 + la UI propia (emojis y `/setup` en `ComposerAdvancedTools`, compositor a 2 renglones, texto 17/25, borde tintado, mango de ancho de burbujas, asa de arrastre, riel de 72 px, ajustes sin published-apps, cabecera sin rol) |
| `9585b334e` | `v0.1.180-cos-r2` (`e8bc25a3b784`) | La cabecera vuelve completa: lupa de buscar, chip de uso uncached + % de contexto, copiar/descargar Markdown, buzón y selector de hilos; el clip sale del menú del `+` y vuelve a ser botón. Piezas nuevas en `src/components/ChatHeadTools.tsx` |
| `36fd736a7` | `v0.1.180-cos-r3` (`76e16b283593`) | **A17:** cabecera en tres píldoras iguales (36 px, `bg-raised/60`); izquierda nombre + lápiz + selector + copiar/descargar, derecha buscar + uso + buzón + bot's screen + `⋯`. Fuera el badge de Chief of Staff, el `+` de hilo nuevo y el renglón de Inbox; clip a la izquierda del emoji |
| `775b7f71b` | `v0.1.180-cos-r4` (`14be44705de3`) | **El mango de ancho de burbujas vuelve a aplicar:** se reponen en `ChatView.tsx` las clases `!simple && "bbl"` y `!simple && (user ? "bbl-user" : "bbl-bot")`. Sin ellas se escribía `--bubble-bot` y nadie lo leía. Dos líneas |
| `807e187f5` | `v0.1.180-cos-r5` (`ba096b4f7150`) | **La tarjeta de Skill Burger se ensancha y adelgaza** con el mecanismo del parche 0010 (`bbl bbl-run` + `BubbleResizeHandle` al borde izquierdo, arranque 336 px, categoría `run`, pastilla de abajo intacta) y **la selección de texto usa el tono del compositor en todas las pieles** (`--color-selection` = `var(--color-raised-hover)`, en vez del acento al 45 % que salía casi negro en Atelier) |

Los `.patch` de cada revisión están en `versiones-omb/parches/v180/` del sitio de datos
(`data.merkle.space/reportes/versiones-omb/parches/v180/`) y en `/home/pepeneif/omb-upgrade-docs/patches/`.
La `r1` no tiene `.patch` propio: su estado exacto es el commit `8cc8c7390`.

## La línea v0.1.171 (beta) — cómo se armó

El árbol `~/omb-171-cos` parte de `2799c92e9` (*bump version to 0.1.171*, upstream) y encima lleva:

| Commit | Qué trae |
|---|---|
| `641d7460f` | Merge de la v0.1.170 sobre el port v169 con los 21 parches del linaje |
| `ba33cb05d` | **022** — la captura del navegador no se manda al chat: se guarda en disco (`browser-frames/`) |
| `50caf81c3` | **023** — el gate lista **tres herramientas** en vez del catálogo de computer y browser |
| `9947747aa` | **022** (cierre) — la decisión vive en el módulo; `index.ts` no crece |
| `844632ca8` | Merge de la v0.1.171 sobre el port v170 (022 + 023), salas a `RoomTextMessage` |
| `d6387e7e1` | **024** — fuera la pastilla «Chat activity» del chathead; sus dos interruptores viven en Ajustes › Apariencia › Chat |
| `1a2438f2e` | **023b** — el merge de la 171 tiró el guard de `buildDirectory`; lo repone y agrega la regresión |
| `bf73427a0` | **027** — barra superior vuelve a `flex`; tooltip del selector de hilos con el título completo; prueba del gate con el schema real |
| `31db9a5bf` | **028** — p0008 en la 171: página de red a 50, ventana retenida fija en 200/600 |
| `47cf2e3f2` | **029** — cerrada, la pastilla del hilo muestra el título completo en el tooltip, no las estadísticas de caché |
| `1890c4b63` | **030** — escritorio del VPS: multiplexado SSH por línea de comandos, concesión persistida y prueba perezosa |
| `e2cc7b13b` | **031** — compactación: presupuesto del resumen de 6,000 → 24,000 bytes |
| `f47143010` | **032** — al compactar se retira la lectura vieja del contexto y el segundo clic avisa en vez de callarse |

Los `.patch` uno por uno están en `versiones-omb/parches/v171/` del sitio de datos
(`data.merkle.space/reportes/versiones-omb/parches/v171/`) y en `/home/pepeneif/omb-upgrade-docs/patches/v171/`.

## Qué hace cada parche de la 171

| Parche | Efecto |
|---|---|
| 022 | Las capturas del navegador van a `browser-frames/<turno>/` en el volumen, no como imagen al hilo |
| 023 | El gate de herramientas de computer/browser expone tres herramientas, no el catálogo entero |
| 024 | Se quita la pastilla «Chat activity» de la cabecera del chat (los interruptores pasan a Ajustes) |
| 026 | Repone `&& !builtDirectory` en la config del gate privado; sin eso, todo turno con `OMB_DIRECTORY_BUILTINS` se congelaba |
| 027 | Barra superior en `flex` (nombre, lápiz, hilos, copiar, descargar) y tooltip con el título completo del hilo |
| 028 | Paginación de red a 50 y ventana retenida fija en 200/600 |
| 029 | La pastilla del hilo ya no muestra estadísticas de caché; el tooltip lleva el título completo |
| 030 | `setup.computer` de 6,035–6,537 ms a 195–906 ms: `ControlMaster` forzado en la línea de comandos, concesión persistida con sonda y prueba perezosa del escritorio |
| 031 | `MAX_SUMMARY_BYTES` 6,000 → 24,000 y `DEFAULT_REBUILD_BYTES` 24,000 → 50,000; recortes consecutivos agrupados |
| 032 | Al compactar se retira la lectura vieja del contexto (el chip deja de repetir el % previo) y el segundo clic avisa en vez de callarse |

## Verificación

- **v0.1.180:** `typecheck`, `lint`, `i18n:check` y 433 pruebas dirigidas en la r1; 61 de
  `ChatView.controls` en la r2; `oxlint` 0/0 y 61 de cabecera + 18 de inbox/riel en la r3; 16 de
  `skill-burger` en la r5. Bundles servidos comprobados (`App-CUb8ewLa.js` con `burger-fold bbl bbl-run`,
  `styles-CQc26LgA.css` con `--color-selection:var(--color-raised-hover)`).
- **v0.1.171:** `tsc --noEmit` limpio, `pre-push` con **128 guards** en verde y turno real con navegador.
- Alfa corre `openmausbot:v0.1.180-cos-r5` (`ba096b4f7150`, 2.14 GB) sana desde el
  2026-11-26 03:27:23 UTC, health `0.1.180` y `problems: []`.
- Beta corre `openmausbot:v0.1.171-cos-r11` (`cef9c6fa0cf5`, 3.35 GB) sana desde el
  2026-11-25 08:22:17 UTC, health `0.1.171` y `problems: []`.
- `context.compactAt`: **150,000** en alfa y **60,000** en beta.

## Lo que hay que saber al instalar estas imágenes

- **No hornean los CLI de los motores** (desde la `v0.1.171-cos-r5`). Viven en
  `<volumen>/_data/.openmausbot/tools/npm` (~438 MB). En un volumen que ya los tiene no hay que hacer
  nada; en uno vacío se instalan desde **Ajustes › Proveedores de modelos y cuentas** y hace falta red.
- **`compactAt` no viaja en la imagen**: es del `config.json` del volumen.
- **La imagen no trae los ajustes del host**: Caddy, systemd, drop-ins de las PWA y túneles noVNC se
  quedan como están; el nombre del contenedor **no** cambia al subir de versión.
- **Formato de datos 2:** la 180 escribió `.openmausbot/data-format.json` = `{format:2, writtenBy:"0.1.180"}`.
  Volver a una imagen que solo lee formato 1 (la `r11` de la 171) **exige restaurar el volumen** y borrar
  ese archivo; la v0.1.177 sí lee formato 2.

## Reversión

- Alfa dentro de la 180: cambiar la imagen a `r4` (`14be44705de3`), `r3` (`76e16b283593`), `r2`
  (`e8bc25a3b784`) o `r1` (`01a126473bb3`), sin tocar el volumen.
- Alfa de la 180 a la 171: `/home/pepeneif/revertir-r180.sh` (restaura `alfa_data-clean.tar.zst` y borra
  `data-format.json`).
- Beta: `/home/pepeneif/revertir-r11.sh` (compose a `r10`); más atrás, `revertir-r10.sh` y `revertir-r8.sh`;
  y el compose `deploy-v165/docker-compose.yml.bak-pre-r3b-20261118T031927Z` → `v0.1.169-r3b`.
