// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mercury', {
    api: {
        // 获取所有匹配规则
        getALlMatchRule: () => ipcRenderer.invoke('match-rules:getAll'),
        // 添加匹配规则
        addMatchRule: (rule: {
            category: string,
            rule: string,
            consumer: number,
            tag?: string,
            abc_type?: number,
            cost_type?: number
        }) => ipcRenderer.invoke('match-rules:add', rule),
        // 更新匹配规则
        updateMatchRule: (id: number, rule: {
            category: string,
            rule: string, 
            consumer: number,
            tag?: string,
            abc_type?: number,
            cost_type?: number
        }) => ipcRenderer.invoke('match-rules:update', id, rule),
        // 删除匹配规则
        deleteMatchRule: (id: number) => ipcRenderer.invoke('match-rules:delete', id),
    },

    crawler: (param: {
        web: 'pinduoduo'
        action: 'open' | 'getList',
    }) => ipcRenderer.invoke('crawler', param),
    getWebpageContent: (id: string) => ipcRenderer.invoke('get-webpage-content', id),
    // we can also expose variables, not just functions
})