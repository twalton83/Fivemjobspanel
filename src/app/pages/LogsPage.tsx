import { useState } from 'react';
import { Activity, Filter, Calendar, User, FileText, Briefcase, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';
import { cn } from '../components/ui/utils';

export const LogsPage = () => {
  const { logs, settings } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const actionTypes = ['all', ...Array.from(new Set(logs.map(l => l.action)))];

  const filtered = logs.filter(log => {
    const matchSearch = log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || log.action === filter;
    return matchSearch && matchFilter;
  });

  const actionColor = (a: string) => {
    if (a.includes('CREATE')) return 'text-money';
    if (a.includes('UPDATE')) return 'text-info';
    if (a.includes('DELETE')) return 'text-danger';
    return 'text-accent-pop';
  };

  const actionIcon = (a: string) => {
    if (a.includes('JOB')) return Briefcase;
    if (a.includes('TEMPLATE')) return FileText;
    if (a.includes('USER')) return User;
    return Activity;
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-clean">Activity</h1>
          <p className="text-sm text-subtle mt-1">Audit trail of all admin actions</p>
        </div>
        <span className="text-sm text-subtle">{logs.length} events</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim pointer-events-none" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-surface border-edge text-clean placeholder:text-dim h-9 text-sm rounded-md"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="bg-surface border-edge text-clean h-9 rounded-md text-sm w-[10rem]">
            <Filter className="w-3.5 h-3.5 text-dim mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface border-edge text-clean">
            {actionTypes.map(a => (
              <SelectItem key={a} value={a}>
                {a === 'all' ? 'All events' : a.replace(/_/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Log entries */}
      <div className="space-y-0">
        {filtered.map((log, i) => {
          const Icon = actionIcon(log.action);
          const color = actionColor(log.action);

          return (
            <div key={log.id} className={cn(
              "flex items-center gap-3 px-5 py-3.5 hover:bg-surface/80 transition-colors",
              i !== filtered.length - 1 && "border-b border-edge/50"
            )}>
              <Icon className={cn("w-4 h-4 shrink-0", color)} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className={cn("text-xs font-semibold uppercase tracking-wider", color)}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-dim">by {log.user}</span>
                </div>
                <p className="text-sm text-soft mt-0.5">{log.description}</p>
              </div>

              <span className="text-xs font-mono text-dim shrink-0 hidden sm:block">
                {format(new Date(log.timestamp), 'MMM d · HH:mm')}
              </span>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-subtle">
              {logs.length === 0 ? 'No activity yet' : 'No matching events'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
