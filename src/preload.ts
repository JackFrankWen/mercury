// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mercury', {

    crawler: (param: {
        web: 'pinduoduo'
        action: 'open' | 'getList',
    }) => ipcRenderer.invoke('crawler', param),
    getWebpageContent: (id: string) => ipcRenderer.invoke('get-webpage-content', id),
    // we can also expose variables, not just functions
})