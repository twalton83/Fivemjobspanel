import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// In the browser (test) environment, window.invokeNative is undefined,
// so isEnvBrowser will be true. We test both code paths by mocking fetch
// and by manipulating the module.

describe('nui utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchNui (browser mode)', () => {
    it('resolves with an empty object after a short delay', async () => {
      const { fetchNui } = await import('./nui');
      const result = await fetchNui('testEvent', { foo: 1 });
      expect(result).toEqual({});
    });

    it('resolves with the generic type shape', async () => {
      const { fetchNui } = await import('./nui');
      const result = await fetchNui<{ ok: boolean }>('check');
      expect(result).toBeDefined();
    });
  });

  describe('fetchNui (NUI mode)', () => {
    let originalInvokeNative: any;

    beforeEach(() => {
      originalInvokeNative = (window as any).invokeNative;
      (window as any).invokeNative = vi.fn();
      (window as any).GetParentResourceName = () => 'testResource';
    });

    afterEach(() => {
      if (originalInvokeNative === undefined) {
        delete (window as any).invokeNative;
      } else {
        (window as any).invokeNative = originalInvokeNative;
      }
      delete (window as any).GetParentResourceName;
      vi.resetModules();
    });

    it('posts to the correct NUI endpoint and returns JSON', async () => {
      const mockResponse = { success: true, data: [1, 2, 3] };
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockResponse),
      }));

      vi.resetModules();
      const { fetchNui } = await import('./nui');

      const result = await fetchNui('getJobs', { page: 1 });

      expect(fetch).toHaveBeenCalledWith('https://testResource/getJobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 1 }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('sends empty object when no data is provided', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({}),
      }));

      vi.resetModules();
      const { fetchNui } = await import('./nui');
      await fetchNui('ping');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ body: '{}' }),
      );
    });
  });

  describe('onNuiEvent', () => {
    it('calls handler when a matching message event fires', async () => {
      const { onNuiEvent } = await import('./nui');
      const handler = vi.fn();

      const cleanup = onNuiEvent('loadData', handler);
      window.dispatchEvent(new MessageEvent('message', {
        data: { action: 'loadData', data: { jobs: [] } },
      }));

      expect(handler).toHaveBeenCalledWith({ jobs: [] });
      cleanup();
    });

    it('ignores messages with a different action', async () => {
      const { onNuiEvent } = await import('./nui');
      const handler = vi.fn();

      const cleanup = onNuiEvent('loadData', handler);
      window.dispatchEvent(new MessageEvent('message', {
        data: { action: 'otherAction', data: {} },
      }));

      expect(handler).not.toHaveBeenCalled();
      cleanup();
    });

    it('stops listening after cleanup is called', async () => {
      const { onNuiEvent } = await import('./nui');
      const handler = vi.fn();

      const cleanup = onNuiEvent('loadData', handler);
      cleanup();

      window.dispatchEvent(new MessageEvent('message', {
        data: { action: 'loadData', data: {} },
      }));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('isEnvBrowser', () => {
    it('is true in the test (jsdom) environment', async () => {
      const { isEnvBrowser } = await import('./nui');
      expect(isEnvBrowser).toBe(true);
    });
  });
});
