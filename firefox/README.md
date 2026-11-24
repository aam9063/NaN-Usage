# NaN Usage para Firefox

Port de la extensión a Firefox (Manifest V3). La versión de Chrome sigue en la raíz del repo y no se modifica.

La UI es idéntica a la de Chrome, incluido el tema auto / claro / oscuro que se alterna desde el botón de la cabecera y se guarda en los ajustes.

## Diferencias respecto a Chrome

| Chrome | Firefox | Motivo |
|---|---|---|
| `chrome.sidePanel`, `side_panel` | `sidebar_action`, `action.onClicked` → `sidebarAction.open()` | Firefox no tiene `sidePanel`; la barra lateral se abre desde el icono (la apertura requiere un gesto del usuario). |
| `background.service_worker` | `background.scripts` + `"type": "module"` | Firefox usa página de eventos en MV3, no service workers. |
| `await chrome.storage...` | `await browser.storage...` (alias `api`) | En Firefox el namespace `chrome.*` es solo-callback; los `await` devolverían `undefined`. |
| `notifications.priority` | eliminado | Firefox no soporta esa propiedad. |
| — | `browser_specific_settings.gecko` | ID, versión mínima 140 (142 en Android) y `data_collection_permissions.required: ["websiteContent"]`. |

El ID de Firefox es un UUID: no reutilizarlo ni cambiarlo sin necesidad (AMO rechaza IDs duplicados). La declaración `websiteContent` es obligatoria porque la extensión envía peticiones autenticadas con la cookie de sesión a `*.nan.builders`.

## Instalar en local (temporal)

1. Abre `about:debugging#/runtime/this-firefox`.
2. Pulsa **Cargar complemento temporal…**.
3. Selecciona `firefox/manifest.json` de este repo.
4. Se abre la barra lateral con tus créditos si tienes sesión en https://cloud.nan.builders.

La carga temporal se pierde al cerrar Firefox. Para una instalación permanente hace falta el XPI firmado por AMO, o usar Firefox Developer Edition/Nightly/ESR con `xpinstall.signatures.required = false`.

## Empaquetar y validar

```bash
npm install --no-save web-ext
npx web-ext lint --source-dir firefox
npx web-ext build --source-dir firefox --overwrite-dest
```

`lint` debe dar 0 errores y 0 avisos. El ZIP resultante se genera en `web-ext-artifacts/`.

## Verificación

El port se probó con Firefox 160: carga la extensión, consulta la API real (estado `auth` sin sesión), renderiza los cinco bloques del panel, abre la barra lateral y adjunta la cookie de sesión a las peticiones del background, incluida una cookie `SameSite=Strict`.
