import { api, refresh, getSettings, PORTAL_URL } from "./lib.js";

// Firefox no tiene chrome.sidePanel: la barra lateral es `sidebar_action` y
// sidebarAction.open() solo se puede llamar desde el handler de un gesto del
// usuario (aquí, el clic en el icono de la barra de herramientas).
api.action.onClicked.addListener(() => {
  api.sidebarAction.open().catch(() => {});
});

async function schedule() {
  const { pollMinutes } = await getSettings();
  await api.alarms.create("poll", { periodInMinutes: pollMinutes });
}

api.runtime.onInstalled.addListener(async () => {
  await schedule();
  refresh();
});

api.runtime.onStartup.addListener(async () => {
  await schedule();
  refresh();
});

api.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "poll") refresh();
});

// Si cambia la frecuencia en los ajustes, se reprograma la alarma.
api.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.settings) return;
  const before = changes.settings.oldValue?.pollMinutes;
  const after = changes.settings.newValue?.pollMinutes;
  if (before !== after) schedule();
});

api.notifications.onClicked.addListener((id) => {
  api.tabs.create({ url: PORTAL_URL });
  api.notifications.clear(id);
});
