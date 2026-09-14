// Let the generated autoUpdate worker activate without forcing a reload of drafts.
// New navigations use the latest precached app shell. User storage is untouched.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/', updateViaCache: 'none',
      });
      let lastCheck = 0;
      const checkUpdate = () => {
        if (!navigator.onLine || document.visibilityState !== 'visible' || Date.now() - lastCheck < 60000) return;
        lastCheck = Date.now();
        registration.update().catch(() => {});
      };
      window.addEventListener('online', checkUpdate);
      document.addEventListener('visibilitychange', checkUpdate);
      setInterval(checkUpdate, 60 * 60 * 1000);
      checkUpdate();
    } catch (error) {
      console.warn('Offline app shell could not be registered.', error);
    }
  }, {once:true});
}
