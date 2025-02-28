export {};

export interface IElectronAPI {
  ipcRenderer: {
    invoke(channel: string, data?: any): Promise<any>;
    send(channel: string, data?: any): void;
    on(channel: string, func: (...args: any[]) => void): void;
    once(channel: string, func: (...args: any[]) => void): void;
    removeListener(channel: string, func: (...args: any[]) => void): void;
  };
  autofill: {
    enable(): Promise<boolean>;
    setAddresses(): Promise<boolean>;
  };
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
