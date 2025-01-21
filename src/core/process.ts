import {app, BrowserWindow, ipcMain} from "electron";

const windows = {}; // 存储所有窗口的引用
let newWindow: BrowserWindow | null = null;

export function handleClaw(){

        ipcMain.handle('crawler', (param,web) => {
            const windowId = Date.now(); // 使用时间戳作为唯一 ID

            newWindow = new BrowserWindow({
                width: 400,
                height: 600,
                webPreferences: {
                    nodeIntegration: true,
                },
            });
            windows[windowId] = newWindow; // 存储窗口引用
            newWindow.loadURL('https://mobile.pinduoduo.com');

            // newWindow.webContents.openDevTools();
            return Promise.resolve(windowId);
        });
        ipcMain.handle('get-webpage-content', async (event,id) => {
            newWindow = windows[id];
            console.log(id,)
            if (newWindow) {
                // const content = await newWindow.webContents.executeJavaScript('document.documentElement.outerHTML');
                let content = '';
                try{
                    content = await newWindow.webContents.executeJavaScript('window');
                    return content;
                }catch (e){
                    console.log(e)
                    return e
                }

            }
            return `${id}没有打开的网页`;
        });

}
