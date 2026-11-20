// Public web export. VK launch parameters are supplied by the hosting client.
(function() {
  'use strict';
  if (window.__castleVkLaunch) return;
  const query = new URLSearchParams(location.search);
  const hash = new URLSearchParams(location.hash.slice(1));
  if (!query.has('vk_app_id') && !hash.has('vk_app_id') && !window.vkBridge?.send) return;
  window.__castleVkLaunch = true;
  function ready() {
    const bridge = window.vkBridge;
    if (bridge?.send) bridge.send('VKWebAppInit', {}).catch(() => {});
  }
  if (window.vkBridge?.send) { ready(); return; }
  const sdk = document.createElement('script');
  sdk.src = 'https://cdn.jsdelivr.net/npm/@vkontakte/vk-bridge@2.15.0/dist/browser.min.js';
  sdk.async = true;
  sdk.addEventListener('load', ready, {once:true});
  document.head.appendChild(sdk);
})();
