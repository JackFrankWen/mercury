// global.d.ts
export {};

declare global {
    interface Window {
        mercury: {
            crawler: (param: {
                web: 'pinduoduo';
                action: 'open' | 'getList';
            }) => Promise<any>;
            getWebpageContent: (a: string) => Promise<any>;
        };
    }

}
