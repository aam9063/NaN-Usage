# NaN Usage

Extensión de Chrome que muestra el uso de tu cuenta de nan.builders en el panel lateral, sin pedir API key ni login: reutiliza la sesión que ya tienes abierta en cloud.nan.builders (cookie `nan_session`).

## Instalar

No abras `panel.html` directamente: fuera de Chrome como extensión no tiene acceso a las APIs ni a tu sesión.

1. Descomprime el zip.
2. Ve a `chrome://extensions` y activa el **Modo de desarrollador** (arriba a la derecha).
3. Pulsa **Cargar descomprimida** y elige la carpeta `nan-usage` (la que contiene `manifest.json`).
4. Fija el icono en la barra (icono de puzle > chincheta) y púlsalo: se abre el panel lateral.
5. Ten una sesión abierta en https://cloud.nan.builders.

Para actualizar tras cambiar archivos: botón de recargar de la extensión en `chrome://extensions`.

## Qué muestra

- Badge con los créditos restantes (morado, ámbar por debajo del 20 %, rojo por debajo del 10 %).
- Créditos del periodo, ritmo frente al tiempo transcurrido y proyección al cierre.
- Gasto de hoy, de la última hora y media diaria.
- Gráfica de gasto diario de 14 días, por tipo (input sin caché, cacheado, output, otros).
- Cache hit rate, reparto de tokens y gasto (24 h / 30 d) y ahorro por caché.
- Por modelo: gasto, tokens, % de caché y coste real por millón de tokens frente a su tarifa.
- Notificaciones: 80 / 90 / 100 %, ritmo que agota los créditos antes de la renovación, cuenta congelada y **gasto anómalo** (por defecto, 50 créditos en 15 min). Todo configurable en "Ajustes y alertas".

## Configuración

En `lib.js`:

- `USAGE_URL`: `https://cloud-api.nan.builders/api/usage/credits`.
- `BREAKDOWN_URL`: `https://cloud-api.nan.builders/api/metrics/usage`. Si se deja vacía, la gráfica se construye con el historial local y no se muestra el cache hit rate.

## Cómo funciona la autenticación

El service worker hace `fetch` con `credentials: "include"`. Como la extensión tiene `host_permissions` sobre `*.nan.builders`, Chrome adjunta la cookie de sesión y se salta el CORS. La extensión nunca lee ni guarda el token. Si la sesión caduca, el badge muestra `!` y el panel ofrece abrir el portal.

Los endpoints no están documentados: si NaN los cambia, hay que actualizar las URLs.

## Contribuir

¿Quieres reportar un bug, proponer una mejora o enviar un cambio? Lee [CONTRIBUTING.md](CONTRIBUTING.md): ahí están el protocolo de issues y pull requests, cómo probar la extensión en local y las reglas de diseño que no se rompen (nada de leer la cookie de sesión, telemetría, dependencias ni permisos de más).

## Licencia

[MIT](LICENSE) © 2026 aam9063.
