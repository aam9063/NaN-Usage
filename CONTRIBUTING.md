# Contribuir a NaN Usage

Gracias por aportar. Aquí está el protocolo para abrir issues y enviar pull requests, y lo que esperamos de un cambio para poder revisarlo rápido.

## Antes de nada

- Lee el [README](README.md) y busca en issues abiertos y cerrados: si ya existe, súmate a la conversación en vez de abrir otro.
- Este repositorio no recolecta datos ni pide login: la extensión reutiliza la sesión que ya tienes abierta en `cloud.nan.builders`. Cualquier propuesta que se salga de ahí se rechaza (ver [Reglas del proyecto](#reglas-del-proyecto)).
- **Nunca publiques datos de sesión** (cookie, token, cabeceras). Ver [Seguridad](#seguridad).

## Cómo está organizado el repo

| Carpeta | Qué contiene |
|---|---|
| Raíz (`lib.js`, `sw.js`, `panel.js`, `manifest.json`, …) | Extensión de Chrome (Manifest V3, `side_panel` + service worker). |
| `firefox/` | Port para Firefox (Manifest V3, `sidebar_action` + página de eventos). |

Las dos versiones comparten la UI, el cálculo de métricas y los endpoints; solo cambia la capa de APIs del navegador. El código no se comparte por importaciones entre carpetas: cada una es autocontenida para que se pueda cargar como extensión independiente.

**Regla de oro:** un cambio de comportamiento o de UI se aplica a las dos carpetas en el mismo PR, o se explica en el PR por qué solo afecta a una.

## Reportar un bug

Un issue sin esta información se etiqueta como *falta información* y se cierra si no se completa:

1. **Versión y variante**: la `version` del `manifest.json` y si usas la de Chrome (raíz) o la de `firefox/`.
2. **Navegador y versión**: Chrome 116+ o Firefox 140+ (142 en Android).
3. **Sistema operativo** y versión.
4. **Pasos para reproducir**, numerados, empezando por el estado inicial.
5. **Esperado vs. real**: qué creías que iba a pasar y qué pasó.
6. **Qué muestra el badge y qué muestra el panel** en ese momento (`!`, `?`, `OFF`, un número, un estado de error).
7. **Errores de consola**, tal cual, sin recortar:
   - Chrome: `chrome://extensions` → *Service worker* / *Inspeccionar vistas*.
   - Firefox: `about:debugging#/runtime/this-firefox` → *Inspeccionar*.
8. **Captura** si el problema es visual.
9. **¿Tienes sesión abierta en `cloud.nan.builders`?** Muchos síntomas de datos en blanco son simplemente sesión caducada.

Si el bug es que las cifras no cuadran con el dashboard de NaN, dilo: los endpoints no están documentados y pueden cambiar sin aviso.

## Proponer una mejora

- Explica **el problema** antes de la solución: qué te falta y en qué situación.
- Define el alcance: qué entra y qué no.
- Si la propuesta toca los endpoints, los permisos o el `manifest.json`, dilo explícitamente: es la parte más sensible del proyecto.
- Las mejoras grandes conviene hablarlas en un issue antes de escribir código; así no trabajas en algo que no se va a aceptar.

## Enviar un pull request

1. **Un cambio por PR.** Los refactors masivos, los cambios de formato y las mejoras funcionales van en PRs separados.
2. **Rama desde `master`**, con nombre descriptivo: `fix/badge-sin-sesion`, `feat/panel-16-dias`, `docs/firefox-instalacion`.
3. **Commits en [Conventional Commits](https://www.conventionalcommits.org/es/)**, en inglés: `fix(panel): recorta el título largo`, `feat(firefox): añade sidebar_action`. Un commit por paso lógico, mensajes en imperativo.
4. **No subas** `node_modules/`, `web-ext-artifacts/`, zips, capturas sin recortar ni ficheros de tu editor.
5. **Describe el PR** con: qué cambia, por qué, cómo lo probaste y qué no pudiste probar. Si el PR cambia la UI, adjunta captura de Chrome y de Firefox.
6. **Actualiza la documentación** que tu cambio deje obsoleta: `README.md` para Chrome, `firefox/README.md` para Firefox.
7. **Si subes la versión**, hazlo en los dos `manifest.json` a la vez y en el mismo PR; si no, las dos variantes se desincronizan.

### Probarlo en local

Chrome:

1. `chrome://extensions` → activa **Modo de desarrollador**.
2. **Cargar descomprimida** → elige la raíz del repo.
3. Tras cambiar ficheros, pulsa *Recargar* en la tarjeta de la extensión.

Firefox:

```bash
npx --yes web-ext@10 lint --source-dir firefox
npx --yes web-ext@10 build --source-dir firefox --overwrite-dest
```

1. `about:debugging#/runtime/this-firefox` → **Cargar complemento temporal…** → `firefox/manifest.json`.
2. Tras cambiar ficheros, vuelve a cargarlo: el complemento temporal desaparece al cerrar Firefox.

Antes de abrir el PR:

- [ ] `web-ext lint` sin errores ni avisos (si tocaste `firefox/`).
- [ ] `web-ext build` genera el paquete (si tocaste `firefox/`).
- [ ] La extensión de Chrome carga y el panel renderiza (si tocaste la raíz).
- [ ] El panel de Firefox renderiza y el clic en el icono abre la barra lateral (si tocaste `firefox/`).
- [ ] Los cambios de comportamiento están probados en ambos navegadores, o el PR explica por qué no aplica.

### Revisión

- Se revisa que funcione, que no rompa la otra variante y que no amplíe permisos ni dominios.
- Se pueden pedir cambios; los comentarios de revisión se responden en el mismo hilo.
- Un PR se puede cerrar sin merge si queda abandonado más de un mes, si duplica trabajo ya en curso o si no respeta las reglas de abajo. No es personal: avísanos y lo retomamos.

## Reglas del proyecto

Estas son las que sostienen el diseño actual. Un PR que las rompa necesita una justificación muy sólida y se habla antes en un issue:

- **No leer ni guardar la cookie o el token de sesión.** El `fetch` con `credentials: "include"` es todo el mecanismo de autenticación; la extensión nunca ve el valor.
- **Sin telemetría ni analítica.** Ninguna petición a dominios que no sean `*.nan.builders`.
- **Sin dependencias externas ni paso de build.** JavaScript plano que el navegador ejecuta tal cual: sin bundler, sin framework, sin CDN.
- **Sin API key ni login propio.** Si la sesión del navegador no sirve, el estado correcto es `!`, no un formulario.
- **Sin permisos nuevos sin justificación.** `alarms`, `storage`, `notifications` y `host_permissions` sobre `*.nan.builders`: ampliar eso se revisa aparte.
- **No apuntar a endpoints de pruebas en el código que se publica**, ni cambiar las constantes de `lib.js` para apuntar a otro sitio.

## Seguridad

Si encuentras una vulnerabilidad (exposición de datos de sesión, inyección en el panel, permisos de más), **no abras un issue público**: usa la pestaña *Security* del repo → *Report a vulnerability* (GitHub Security Advisories). Los bugs de privacidad se tratan igual.

En issues y PRs, tapa siempre cookies, tokens y cualquier cosa que identifique tu cuenta.

## Licencia

Al enviar un pull request aceptas que tu aporte se publica bajo la licencia MIT de este repositorio (ver [LICENSE](LICENSE)). No se aceptan aportes con licencias incompatibles.
