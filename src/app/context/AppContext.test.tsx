import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('AppContext', () => {
  describe('initial state', () => {
    it('provides dev jobs in browser mode', () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      expect(result.current.jobs.length).toBeGreaterThan(0);
      expect(result.current.jobs[0]).toHaveProperty('name');
      expect(result.current.jobs[0]).toHaveProperty('label');
      expect(result.current.jobs[0]).toHaveProperty('ranks');
    });

    it('provides dev users in browser mode', () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      expect(result.current.users.length).toBeGreaterThan(0);
      expect(result.current.users[0]).toHaveProperty('identifier');
    });

    it('provides default settings', () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      expect(result.current.settings).toEqual(
        expect.objectContaining({
          primaryColor: '#3B82F6',
          theme: 'dark',
        }),
      );
    });

    it('loads saved templates from localStorage', () => {
      const saved = [{ id: '99', name: 'Custom', description: 'Saved', defaultRanks: [] }];
      localStorage.setItem('fivem-templates', JSON.stringify(saved));

      const { result } = renderHook(() => useApp(), { wrapper });
      expect(result.current.templates).toEqual(saved);
    });

    it('loads saved settings from localStorage', () => {
      const saved = {
        primaryColor: '#FF0000',
        secondaryColor: '#000',
        accentColor: '#00FF00',
        logo: '',
        serverName: 'Test',
        theme: 'light' as const,
      };
      localStorage.setItem('fivem-settings', JSON.stringify(saved));

      const { result } = renderHook(() => useApp(), { wrapper });
      expect(result.current.settings.primaryColor).toBe('#FF0000');
      expect(result.current.settings.theme).toBe('light');
    });
  });

  describe('useApp outside provider', () => {
    it('throws when used outside AppProvider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        renderHook(() => useApp());
      }).toThrow('useApp must be used within AppProvider');
      spy.mockRestore();
    });
  });

  describe('job CRUD (browser mode)', () => {
    it('adds a new job', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const initialCount = result.current.jobs.length;

      let success: boolean;
      await act(async () => {
        success = await result.current.addJob({
          name: 'ems',
          label: 'Emergency Medical Services',
          description: 'Paramedics',
          ranks: [{ id: 'r1', name: 'EMT', level: 0, salary: 1000 }],
        });
      });

      expect(success!).toBe(true);
      expect(result.current.jobs.length).toBe(initialCount + 1);
      const added = result.current.jobs.find((j) => j.name === 'ems');
      expect(added).toBeDefined();
      expect(added!.label).toBe('Emergency Medical Services');
      expect(added!.createdAt).toBeDefined();
    });

    it('updates an existing job', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const jobId = result.current.jobs[0].id;

      let success: boolean;
      await act(async () => {
        success = await result.current.updateJob(jobId, { label: 'Updated PD' });
      });

      expect(success!).toBe(true);
      expect(result.current.jobs.find((j) => j.id === jobId)!.label).toBe('Updated PD');
    });

    it('deletes a job and resets affected users to unemployed', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const jobToDelete = result.current.jobs[0];
      const affectedUsers = result.current.users.filter((u) => u.jobId === jobToDelete.id);
      expect(affectedUsers.length).toBeGreaterThan(0);

      let success: boolean;
      await act(async () => {
        success = await result.current.deleteJob(jobToDelete.id, jobToDelete.label);
      });

      expect(success!).toBe(true);
      expect(result.current.jobs.find((j) => j.id === jobToDelete.id)).toBeUndefined();

      for (const user of affectedUsers) {
        const updated = result.current.users.find((u) => u.id === user.id)!;
        expect(updated.jobId).toBeNull();
        expect(updated.jobLabel).toBe('Unemployed');
        expect(updated.rankLevel).toBeNull();
      }
    });
  });

  describe('template CRUD', () => {
    it('adds a template and persists to localStorage', () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const initialCount = result.current.templates.length;

      act(() => {
        result.current.addTemplate({
          name: 'Government',
          description: 'Govt jobs',
          defaultRanks: [{ id: 'g1', name: 'Clerk', level: 0, salary: 800 }],
        });
      });

      expect(result.current.templates.length).toBe(initialCount + 1);
      const stored = JSON.parse(localStorage.getItem('fivem-templates')!);
      expect(stored.find((t: any) => t.name === 'Government')).toBeDefined();
    });

    it('updates a template', () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const templateId = result.current.templates[0].id;

      act(() => {
        result.current.updateTemplate(templateId, { name: 'Renamed' });
      });

      expect(result.current.templates.find((t) => t.id === templateId)!.name).toBe('Renamed');
    });

    it('deletes a template', () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const templateId = result.current.templates[0].id;
      const initialCount = result.current.templates.length;

      act(() => {
        result.current.deleteTemplate(templateId);
      });

      expect(result.current.templates.length).toBe(initialCount - 1);
      expect(result.current.templates.find((t) => t.id === templateId)).toBeUndefined();
    });
  });

  describe('user job assignment', () => {
    it('assigns a user to a job', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const unassigned = result.current.users.find((u) => u.jobId === null)!;
      const targetJob = result.current.jobs[0];

      await act(async () => {
        await result.current.updateUserJob(unassigned.id, targetJob.id, 1);
      });

      const updated = result.current.users.find((u) => u.id === unassigned.id)!;
      expect(updated.jobId).toBe(targetJob.id);
      expect(updated.jobLabel).toBe(targetJob.label);
      expect(updated.rankLevel).toBe(1);
    });

    it('sets a user to unemployed', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const employed = result.current.users.find((u) => u.jobId !== null)!;

      await act(async () => {
        await result.current.updateUserJob(employed.id, null, null);
      });

      const updated = result.current.users.find((u) => u.id === employed.id)!;
      expect(updated.jobId).toBeNull();
      expect(updated.jobLabel).toBe('Unemployed');
    });
  });

  describe('settings', () => {
    it('updates settings and persists to localStorage', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.updateSettings({ serverName: 'My Server', theme: 'light' });
      });

      expect(result.current.settings.serverName).toBe('My Server');
      expect(result.current.settings.theme).toBe('light');

      const stored = JSON.parse(localStorage.getItem('fivem-settings')!);
      expect(stored.serverName).toBe('My Server');
    });
  });

  describe('activity logging', () => {
    it('addLog prepends a new log entry', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.addLog('TEST_ACTION', 'Something happened');
      });

      expect(result.current.logs.length).toBe(1);
      expect(result.current.logs[0].action).toBe('TEST_ACTION');
      expect(result.current.logs[0].description).toBe('Something happened');
      expect(result.current.logs[0].user).toBe('Admin');
      expect(result.current.logs[0].timestamp).toBeDefined();
    });

    it('job operations create log entries', async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        await result.current.addJob({
          name: 'test',
          label: 'Test Job',
          description: '',
          ranks: [{ id: '1', name: 'R', level: 0, salary: 100 }],
        });
      });

      expect(result.current.logs.some((l) => l.action === 'CREATE_JOB')).toBe(true);
    });
  });
});
