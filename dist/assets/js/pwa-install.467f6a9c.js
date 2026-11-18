export function initPwaInstallPrompt({
  documentRef = globalThis.document,
  windowRef = globalThis.window,
} = {}) {
  const button = documentRef?.querySelector("#install-pwa");
  const status = documentRef?.querySelector("#install-pwa-status");
  if (!button || !status || typeof windowRef?.addEventListener !== "function") return;

  let deferredPrompt = null;
  let prompting = false;
  button.hidden = true;
  status.hidden = true;

  function announce(message) {
    status.textContent = message;
    status.hidden = false;
  }

  function onBeforeInstallPrompt(event) {
    if (typeof event?.prompt !== "function") return;
    event.preventDefault?.();
    deferredPrompt = event;
    status.textContent = "";
    status.hidden = true;
    button.hidden = false;
  }

  function onAppInstalled() {
    deferredPrompt = null;
    button.hidden = true;
    announce("Batak Toba Play sudah dipasang. Buka dari daftar aplikasi browser Anda.");
  }

  async function onInstallClick() {
    if (!deferredPrompt || prompting) return;
    const promptEvent = deferredPrompt;
    deferredPrompt = null;
    prompting = true;
    button.disabled = true;

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice?.outcome === "accepted") {
        announce("Permintaan pemasangan diterima. Ikuti petunjuk selanjutnya di browser Anda.");
      } else if (choice?.outcome === "dismissed") {
        announce("Pemasangan dibatalkan. Anda dapat mencobanya lagi nanti dari menu browser.");
      } else {
        announce("Status pemasangan belum tersedia. Coba lagi nanti dari menu browser.");
      }
    } catch {
      announce("Opsi pemasangan belum tersedia. Coba lagi nanti dari menu browser.");
    } finally {
      button.hidden = true;
      button.disabled = false;
      prompting = false;
    }
  }

  windowRef.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  windowRef.addEventListener("appinstalled", onAppInstalled);
  button.addEventListener("click", onInstallClick);
}
