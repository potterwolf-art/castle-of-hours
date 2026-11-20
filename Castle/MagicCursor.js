// One document owns its native cursor, including every scene or dialog mounted later.
(() => {
  const script = document.currentScript;
  if (!script || document.getElementById('castle-magic-cursor')) return;
  const sources = JSON.parse(script.dataset.cursorResources || '{}');
  const png = name => new URL(sources[name] || name, sources[name] ? document.baseURI : script.src).href;
  const cssURL = name => 'url(' + JSON.stringify(png(name)) + ')';
  const hotspot = ' 2 2';
  const states = ['default', 'hover', 'pressed'];
  const probe = '(url("cursor.png") 1x, url("cursor_2x.png") 2x)';
  const imageSet = ['image-set', '-webkit-image-set'].find(fn =>
    CSS.supports('cursor', fn + probe + hotspot + ', auto'));

  const declarations = states.map(state => {
    const stem = 'cursor_magic_' + state;
    const normal = cssURL(stem + '.png');
    const retina = cssURL(stem + '_2x.png');
    const candidates = imageSet ? imageSet + '(' + normal + ' 1x,' + retina + ' 2x)' + hotspot + ',' : '';
    return '--coh-cursor-' + state + ':' + candidates + normal + hotspot + ',default';
  });
  const controls = ':is(button,a[href],area[href],select,summary,input:not([type="hidden"]),'+
    '[role="button"],[role="tab"],[role="link"],[role="switch"],[role="slider"],'+
    'label[for],label:has(input:enabled,select:enabled,textarea:enabled))';
  const edit = ':is(textarea,input:not([type]),input[type="text"],input[type="search"],'+
    'input[type="email"],input[type="password"],input[type="tel"],input[type="url"],'+
    'input[type="number"],[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"])';
  const blocked = ':is(:disabled,[aria-disabled="true"],[inert])';
  // These backdrops are actionable only when the backdrop itself was hit.
  const dismiss = ':is(.cozy-backdrop,.album-shade,.home-book-shade,.moon-overlay,dialog[open])';
  const pressed = '[data-coh-cursor-pressed]';
  const style = document.createElement('style');
  style.id = 'castle-magic-cursor';
  style.textContent = `
    :root { ${declarations.join(';')} }
    @layer castleNativeCursor {
      :where(html,body,body *), dialog::backdrop { cursor:var(--coh-cursor-default) !important }
      :where(${controls},${controls} *,${dismiss}) { cursor:var(--coh-cursor-hover) !important }
      :where(${controls}${pressed},${controls}${pressed} *,${dismiss}${pressed}) { cursor:var(--coh-cursor-pressed) !important }
      :where(${edit},${edit} *) { cursor:text !important }
      :where(${blocked},${blocked} *) { cursor:var(--coh-cursor-default) !important }
    }`;
  document.head.append(style);

  // Keep the six tiny PNGs ready for the first hover and for moves between displays.
  for (const state of states) {
    for (const suffix of ['', '_2x']) {
      const image = new Image();
      image.src = png('cursor_magic_' + state + suffix + '.png');
    }
  }

  let active = null;
  let pulse;
  function release() {
    clearTimeout(pulse);
    active?.removeAttribute('data-coh-cursor-pressed');
    active = null;
  }
  window.addEventListener('pointerdown', event => {
    // Embedded desktop hosts can leave pointerType empty for a primary mouse click.
    if ((event.pointerType && event.pointerType !== 'mouse') || event.button !== 0 || !(event.target instanceof Element)) return;
    release();
    const target = event.target;
    if (target.closest(blocked) || target.closest(edit)) return;
    const control = target.closest(controls) || (target.matches(dismiss) ? target : null);
    if (!control || control.control?.disabled) return;
    active = control;
    active.setAttribute('data-coh-cursor-pressed', '');
    pulse = setTimeout(release, 100);
  }, {capture:true, passive:true});
  window.addEventListener('pointercancel', release);
  window.addEventListener('blur', release);
  window.addEventListener('pagehide', release);
})();
