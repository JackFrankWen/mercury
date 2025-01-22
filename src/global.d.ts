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
            api: {
                getALlMatchRule: () => Promise<any>;
                addMatchRule: (rule: {
                    category: string,
                    rule: string,
                    consumer: number,
                    tag?: string,
                    abc_type?: number,
                    cost_type?: number
                }) => Promise<any>;
                updateMatchRule: ( id: number,rule: {
                    category: string,
                    rule: string,
                    consumer: number,
                    tag?: string,
                    abc_type?: number,
                    cost_type?: number
                }) => Promise<any>;
                deleteMatchRule: (id: number) => Promise<any>;
            };
        };
    }

}
