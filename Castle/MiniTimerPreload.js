'use strict';
const {contextBridge,ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('castleMiniPanel', {
  subscribe(callback) {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('coh-mini:state', listener);
    ipcRenderer.send('coh-mini:ready');
    return () => ipcRenderer.removeListener('coh-mini:state', listener);
  },
  action(type, key) {
    if (['pause','resume','restore','hide'].includes(type)) ipcRenderer.send('coh-mini:action',{type,key});
  }
});
