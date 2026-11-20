// Electron main process. The GDevelop desktop exporter copies this module alongside the game.
'use strict';
const path = require('node:path');
const fs = require('node:fs');
const W = 320, H = 74, INSET = 18;
const bound = (n, lo, hi) => Math.max(lo, Math.min(Math.max(lo, hi), n));

function placement(saved, screen, ownerBounds) {
  const valid = saved && Number.isFinite(saved.x) && Number.isFinite(saved.y);
  const area = screen.getDisplayMatching(valid ?
    {x: Math.round(saved.x), y: Math.round(saved.y), width: W, height: H} : ownerBounds).workArea;
  return {x: Math.round(bound(valid ? saved.x : area.x + area.width - W - INSET, area.x, area.x + area.width - W)),
    y: Math.round(bound(valid ? saved.y : area.y + INSET, area.y, area.y + area.height - H)), width: W, height: H};
}
const hosts = new Map();
function attach(ownerId) {
  if (hosts.has(ownerId)) return true;
  const electron = require('electron');
  const owner = electron.BrowserWindow.fromId(ownerId);
  if (!owner || owner.isDestroyed()) return false;
  hosts.set(ownerId, connect(electron, owner, () => hosts.delete(ownerId)));
  return true;
}
function connect({BrowserWindow, app, ipcMain, screen, Tray, Menu, nativeImage}, owner, detach) {
  const folder = app.getPath('userData');
  const positions = path.join(folder, 'castle-mini-position.json');
  let saved;
  try { saved = JSON.parse(fs.readFileSync(positions, 'utf8')); } catch {}
  let mini, loading = false, away = false, panelReady = false, paintReady = false;
  let last, guard, writing, minimizeCheck, tray, quitting = false;
  function recoveryIcon() {
    if (tray) return true;
    try {
      const img=nativeImage.createFromDataURL('data:image/png;base64,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');
      tray=new Tray(img); tray.setToolTip('Castle of Hours');
      tray.on('click',()=>restore(true));
      tray.setContextMenu(Menu.buildFromTemplate([{label:last?.en?'Return to the castle':'Вернуться в замок',click:()=>restore(true)}]));
      return true;
    } catch { return false; }
  }
  function releaseIcon(){if(tray){tray.destroy();tray=null;}}
  function send(w, channel, value) {
    if (w && !w.isDestroyed() && !w.webContents.isDestroyed()) w.webContents.send('coh-mini:' + channel, value);
  }
  function mode() { send(owner, 'mode', {away, visible: !!mini?.isVisible(), loading}); }
  function cancelGuard() { clearTimeout(guard); guard = null; }
  function persist() {
    clearTimeout(writing);
    if (!saved) return;
    try {
      const tmp = positions + '.' + process.pid + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(saved), {mode: 0o600});
      fs.renameSync(tmp, positions);
    } catch { /* Position is optional when the profile is read-only. */ }
  }
  function moved() {
    if (!mini || mini.isDestroyed()) return;
    const {x,y} = mini.getBounds();
    if (saved?.x === x && saved?.y === y) return;
    saved = {x,y};
    clearTimeout(writing); writing = setTimeout(persist, 240);
  }
  function fit() {
    if (!mini || mini.isDestroyed()) return;
    const b = placement(saved, screen, owner.getBounds()), was = mini.getBounds();
    if (was.x !== b.x || was.y !== b.y || was.width !== W || was.height !== H) { mini.setBounds(b); moved(); }
  }
  function restore(activate) {
    cancelGuard(); clearTimeout(minimizeCheck); loading = false; away = false;
    if (mini && !mini.isDestroyed()) mini.hide();
    if (activate && !owner.isDestroyed()) {
      if (owner.isMinimized()) owner.restore();
      owner.show(); owner.focus();
    }
    releaseIcon(); mode();
  }
  function failed(reason) {
    if (quitting) return;
    const needsRestore = away;
    restore(needsRestore);
    if (mini && !mini.isDestroyed()) mini.destroy();
    mini = null;
    send(owner, 'error', reason);
  }
  function reveal() {
    if (!loading || !mini || !panelReady || !paintReady) return;
    cancelGuard();
    fit(); send(mini,'state',last);
    try {
      mini.showInactive();
      if (!mini.isVisible()) throw Error('Window is unavailable');
      away = true; loading = false;
      if (process.platform === 'darwin') owner.hide(); // Dock activation restores the full game.
      else {
        owner.minimize(); // The full game keeps its Windows taskbar entry.
        minimizeCheck=setTimeout(()=>{
          if(away && !owner.isDestroyed() && owner.isVisible() && !owner.isMinimized() && recoveryIcon()) owner.hide();
        },350);
      }
      mode();
    } catch { failed('open'); }
  }
  function open(snapshot) {
    last = snapshot;
    if (loading) return;
    if (away && mini?.isVisible()) { send(mini,'state',last); return; }
    loading = true;
    if (mini && !mini.isDestroyed()) { reveal(); return; }
    panelReady = false; paintReady = false;
    const w = new BrowserWindow({...placement(saved,screen,owner.getBounds()), title: 'Castle of Hours · Мини-таймер',
      frame: false, transparent: true, backgroundColor: '#00000000', hasShadow: false, show: false,
      useContentSize: true, resizable: false, maximizable: false, fullscreenable: false, skipTaskbar: true,
      alwaysOnTop: true, autoHideMenuBar: true,
      webPreferences: {preload: path.join(__dirname,'MiniTimerPreload.js'), contextIsolation: true,
        sandbox: true, nodeIntegration: false, backgroundThrottling: false, devTools: false}});
    mini = w;
    if (process.platform === 'linux' && typeof w.setShape==='function') {
      // A non-compositing X11 desktop needs a native shape for transparent corners.
      const r=14, rows=[];
      for(let y=0;y<H;y++){
        const dy=Math.max(0,r-.5-y,r-.5-(H-1-y));
        const x=Math.ceil(r-Math.sqrt(r*r-dy*dy));
        rows.push({x,y,width:W-2*x,height:1});
      }
      w.setShape(rows);
    }
    w.setAlwaysOnTop(true, 'floating');
    if (process.platform === 'darwin') w.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: false, skipTransformProcessType: true});
    w.webContents.setWindowOpenHandler(() => ({action:'deny'}));
    w.webContents.on('will-navigate', e => e.preventDefault());
    w.webContents.on('will-attach-webview', e => e.preventDefault());
    w.on('move', moved);
    w.on('close', e => { if (!quitting) {e.preventDefault(); w.hide(); mode();} });
    w.on('closed', () => { if(mini === w) mini = null; });
    w.once('ready-to-show', () => { if (mini === w) { paintReady = true; reveal(); } });
    w.webContents.on('render-process-gone', () => { if (mini === w) failed('renderer'); });
    w.webContents.on('did-fail-load', (_e, code) => { if (mini === w && code !== -3) failed('load'); });
    guard = setTimeout(() => { if (loading && mini === w) failed('timeout'); }, 9000);
    w.loadFile(path.join(__dirname,'MiniTimerPanel.html')).catch(() => { if (mini === w) failed('load'); });
  }
  const registrations = [];
  function listen(channel, allowed, fn) {
    const name = 'coh-mini:' + channel;
    const handler = (event, data) => {
      const w = allowed();
      if (quitting || !w || w.isDestroyed() || event.sender !== w.webContents) return;
      fn(data);
    };
    ipcMain.on(name, handler); registrations.push([name,handler]);
  }
  listen('open', () => owner, data => { try { open(data); } catch { failed('open'); } });
  listen('publish', () => owner, data => { last = data; if (mini?.isVisible()) send(mini, 'state', data); });
  listen('ready', () => mini, () => { panelReady = true; send(mini, 'state', last); reveal(); });
  listen('action', () => mini, data => {
    if (!away || !mini?.isVisible()) return;
    if (data?.type === 'restore') restore(true);
    else if (data?.type === 'hide') { mini.hide(); mode(); }
    else if ((data?.type === 'pause' || data?.type === 'resume') && typeof data.key === 'string' && data.key === last?.key) send(owner, 'command', {type:data.type,key:data.key});
  });
  const restored = () => { if (away || loading) restore(false); };
  const activated = () => { if (away) restore(true); };
  const quittingApp = () => { quitting = true; };
  const displayEvents = ['display-added','display-removed','display-metrics-changed'];
  for (const e of displayEvents) screen.on(e,fit);
  owner.on('restore',restored); owner.on('show',restored); app.on('activate',activated); app.on('before-quit',quittingApp);
  owner.once('closed', () => {
    quitting = true; cancelGuard(); clearTimeout(minimizeCheck); releaseIcon(); if (writing) persist();
    for (const [channel,fn] of registrations) ipcMain.removeListener(channel,fn);
    for (const e of displayEvents) screen.removeListener(e,fit);
    app.removeListener('activate',activated); app.removeListener('before-quit',quittingApp);
    if (mini && !mini.isDestroyed()) mini.destroy();
    detach();
  });
}
module.exports = {attach,placement,connect};
