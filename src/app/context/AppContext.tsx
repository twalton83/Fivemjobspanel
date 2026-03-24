import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Rank {
  id: string;
  name: string;
  level: number;
  salary: number;
}

export interface Job {
  id: string;
  name: string;
  label: string;
  description: string;
  ranks: Rank[];
  createdAt: string;
  updatedAt: string;
}

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  defaultRanks: Rank[];
}

export interface User {
  id: string;
  name: string;
  identifier: string;
  jobId: string | null;
  jobLabel: string | null;
  rankLevel: number | null;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
}

export interface AppSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  serverName: string;
}

interface AppContextType {
  jobs: Job[];
  templates: JobTemplate[];
  users: User[];
  logs: ActivityLog[];
  settings: AppSettings;
  addJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  addTemplate: (template: Omit<JobTemplate, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<JobTemplate>) => void;
  deleteTemplate: (id: string) => void;
  updateUserJob: (userId: string, jobId: string | null, rankLevel: number | null) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addLog: (action: string, description: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  primaryColor: '#3b82f6',
  secondaryColor: '#1e293b',
  accentColor: '#8b5cf6',
  logo: '',
  serverName: 'FiveM Admin Panel',
};

const initialJobs: Job[] = [
  {
    id: '1',
    name: 'police',
    label: 'Los Santos Police Department',
    description: 'Law enforcement agency',
    ranks: [
      { id: '1-1', name: 'Cadet', level: 0, salary: 1200 },
      { id: '1-2', name: 'Officer', level: 1, salary: 1800 },
      { id: '1-3', name: 'Sergeant', level: 2, salary: 2400 },
      { id: '1-4', name: 'Lieutenant', level: 3, salary: 3000 },
      { id: '1-5', name: 'Captain', level: 4, salary: 3800 },
      { id: '1-6', name: 'Chief', level: 5, salary: 4500 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'mechanic',
    label: 'Mechanic Shop',
    description: 'Vehicle repair and maintenance',
    ranks: [
      { id: '2-1', name: 'Apprentice', level: 0, salary: 800 },
      { id: '2-2', name: 'Mechanic', level: 1, salary: 1400 },
      { id: '2-3', name: 'Lead Mechanic', level: 2, salary: 2000 },
      { id: '2-4', name: 'Shop Manager', level: 3, salary: 2600 },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialTemplates: JobTemplate[] = [
  {
    id: '1',
    name: 'Emergency Services',
    description: 'Template for emergency service jobs',
    defaultRanks: [
      { id: 't1-1', name: 'Trainee', level: 0, salary: 1000 },
      { id: 't1-2', name: 'Responder', level: 1, salary: 1600 },
      { id: 't1-3', name: 'Senior Responder', level: 2, salary: 2200 },
      { id: 't1-4', name: 'Supervisor', level: 3, salary: 2800 },
      { id: 't1-5', name: 'Chief', level: 4, salary: 3500 },
    ],
  },
  {
    id: '2',
    name: 'Business',
    description: 'Template for business jobs',
    defaultRanks: [
      { id: 't2-1', name: 'Employee', level: 0, salary: 900 },
      { id: 't2-2', name: 'Senior Employee', level: 1, salary: 1500 },
      { id: 't2-3', name: 'Manager', level: 2, salary: 2200 },
      { id: 't2-4', name: 'Director', level: 3, salary: 3000 },
    ],
  },
];

const initialUsers: User[] = [
  { id: '1', name: 'John Smith', identifier: 'license:abc123', jobId: '1', jobLabel: 'Los Santos Police Department', rankLevel: 2 },
  { id: '2', name: 'Jane Doe', identifier: 'license:def456', jobId: '2', jobLabel: 'Mechanic Shop', rankLevel: 1 },
  { id: '3', name: 'Mike Johnson', identifier: 'license:ghi789', jobId: '1', jobLabel: 'Los Santos Police Department', rankLevel: 0 },
  { id: '4', name: 'Sarah Williams', identifier: 'license:jkl012', jobId: null, jobLabel: 'Unemployed', rankLevel: null },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('fivem-jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });

  const [templates, setTemplates] = useState<JobTemplate[]>(() => {
    const saved = localStorage.getItem('fivem-templates');
    return saved ? JSON.parse(saved) : initialTemplates;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fivem-users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('fivem-logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('fivem-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('fivem-jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('fivem-templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('fivem-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('fivem-logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('fivem-settings', JSON.stringify(settings));
  }, [settings]);

  const addLog = (action: string, description: string) => {
    const log: ActivityLog = {
      id: Date.now().toString(),
      action,
      description,
      user: 'Admin',
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [log, ...prev]);
  };

  const addJob = (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJobs((prev) => [...prev, newJob]);
    addLog('CREATE_JOB', `Created job: ${job.label}`);
  };

  const updateJob = (id: string, jobUpdate: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, ...jobUpdate, updatedAt: new Date().toISOString() } : job
      )
    );
    const job = jobs.find((j) => j.id === id);
    if (job) {
      addLog('UPDATE_JOB', `Updated job: ${job.label}`);
    }
  };

  const deleteJob = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    setJobs((prev) => prev.filter((job) => job.id !== id));
    // Update users with this job to unemployed
    setUsers((prev) =>
      prev.map((user) =>
        user.jobId === id ? { ...user, jobId: null, jobLabel: 'Unemployed', rankLevel: null } : user
      )
    );
    if (job) {
      addLog('DELETE_JOB', `Deleted job: ${job.label}`);
    }
  };

  const addTemplate = (template: Omit<JobTemplate, 'id'>) => {
    const newTemplate: JobTemplate = {
      ...template,
      id: Date.now().toString(),
    };
    setTemplates((prev) => [...prev, newTemplate]);
    addLog('CREATE_TEMPLATE', `Created template: ${template.name}`);
  };

  const updateTemplate = (id: string, templateUpdate: Partial<JobTemplate>) => {
    setTemplates((prev) =>
      prev.map((template) => (template.id === id ? { ...template, ...templateUpdate } : template))
    );
    const template = templates.find((t) => t.id === id);
    if (template) {
      addLog('UPDATE_TEMPLATE', `Updated template: ${template.name}`);
    }
  };

  const deleteTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    setTemplates((prev) => prev.filter((template) => template.id !== id));
    if (template) {
      addLog('DELETE_TEMPLATE', `Deleted template: ${template.name}`);
    }
  };

  const updateUserJob = (userId: string, jobId: string | null, rankLevel: number | null) => {
    const user = users.find((u) => u.id === userId);
    const job = jobId ? jobs.find((j) => j.id === jobId) : null;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, jobId, jobLabel: job?.label || 'Unemployed', rankLevel }
          : user
      )
    );
    if (user) {
      addLog(
        'UPDATE_USER_JOB',
        `Updated ${user.name}'s job to ${job?.label || 'Unemployed'}${rankLevel !== null ? ` (Rank ${rankLevel})` : ''}`
      );
    }
  };

  const updateSettings = (settingsUpdate: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...settingsUpdate }));
    addLog('UPDATE_SETTINGS', 'Updated application settings');
  };

  return (
    <AppContext.Provider
      value={{
        jobs,
        templates,
        users,
        logs,
        settings,
        addJob,
        updateJob,
        deleteJob,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        updateUserJob,
        updateSettings,
        addLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
