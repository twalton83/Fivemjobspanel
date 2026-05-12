const isEnvBrowser = !(window as any).invokeNative;

export async function fetchNui<T = any>(event: string, data?: any): Promise<T> {
  if (isEnvBrowser) {
    return new Promise((resolve) => setTimeout(() => resolve({} as T), 100));
  }

  const resourceName = (window as any).GetParentResourceName?.() || 'Fivemjobspanel';
  const resp = await fetch(`https://${resourceName}/${event}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data ?? {}),
  });
  return resp.json();
}

export function onNuiEvent<T = any>(action: string, handler: (data: T) => void) {
  const listener = (event: MessageEvent) => {
    if (event.data?.action === action) {
      handler(event.data.data);
    }
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}

export { isEnvBrowser };
