export const invokeIPC = async <T>(channel: string, data?: any): Promise<T> => {
  if (!window.api?.ipcRenderer) {
    throw new Error("IPC not available");
  }
  return window.api.ipcRenderer.invoke(channel, data);
};

export const useIPC = () => {
  const invoke = async <T>(channel: string, data?: any): Promise<T> => {
    return invokeIPC(channel, data);
  };

  return { invoke };
};
