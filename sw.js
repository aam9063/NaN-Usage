import { refresh, getSettings, PORTAL_URL } from "./lib.js";

// Al pulsar el icono se abre el panel lateral.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

async function schedule() {
  const { pollMinutes } = await getSettings();
  await chrome.alarms.create("poll", { periodInMinutes: pollMinutes });
}

chrome.runtime.onInstalled.addListener(async () => {
  await schedule();
  refresh();
});

chrome.runtime.onStartup.addListener(async () => {
  await schedule();
  refresh();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "poll") refresh();
});

// Si cambia la frecuencia en los ajustes, se reprograma la alarma.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.settings) return;
  const before = changes.settings.oldValue?.pollMinutes;
  const after = changes.settings.newValue?.pollMinutes;
  if (before !== after) schedule();
});

chrome.notifications.onClicked.addListener((id) => {
  chrome.tabs.create({ url: PORTAL_URL });
  chrome.notifications.clear(id);
});
