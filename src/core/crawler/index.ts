import {  BrowserWindow, } from 'electron';
let newWindow: BrowserWindow | null = null;
function openNewWindow(url: string) {
    if (!newWindow){
        console.log('==============需要创建')
        let newWindow = new BrowserWindow({
            width: 400,
            height: 600
        });
        newWindow.loadURL(url);

    }

    return newWindow;
}


export default function startCrawler(obj: {web: string, action: string}): Promise<any> {
    const {web, action} = obj;
    // 新开一个窗口
    if (web === 'pinduoduo') {
        console.log('=====pinduoduo', action);
        if (action === 'open') {


            // newWindow.webContents.openDevTools();
             newWindow = openNewWindow('https://mobile.pinduoduo.com');

            return Promise.resolve('open pinduoduo');
        } else if (action === 'getList') {
            console.log('getList');
            //&Q 我想打开之前的窗口怎么做
            //&A 你可以在openNewWindow函数中返回newWindow，然后在这里判断newWindow是否存在，如果存在就不再新建窗口，直接打开之前的窗口
            newWindow = openNewWindow('https://mobile.pinduoduo.com');

            return Promise.resolve('getList');

        }
    }

}