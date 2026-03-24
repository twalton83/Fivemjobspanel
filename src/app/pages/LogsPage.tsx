import { useState } from 'react';
import { Activity, Filter, Calendar, User, FileText, Briefcase, Clock, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { format } from 'date-fns';

export const LogsPage = () => {
  const { logs, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const actionTypes = [
    'all',
    ...Array.from(new Set(logs.map((log) => log.action))),
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterAction === 'all' || log.action === filterAction;

    return matchesSearch && matchesFilter;
  });

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (action.includes('UPDATE')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (action.includes('DELETE')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('JOB')) return Briefcase;
    if (action.includes('TEMPLATE')) return FileText;
    if (action.includes('USER')) return User;
    return Activity;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Activity className="h-6 w-6" style={{ color: settings.primaryColor }} />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
              Activity Ledger
            </h1>
          </div>
          <p className="text-slate-400 font-medium tracking-wide">System audit trail and administrator actions</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 font-semibold">{logs.length} Recorded Events</span>
        </div>
      </div>

      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm mb-6 relative z-10">
        <CardContent className="p-4 sm:p-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-white transition-colors" />
              </div>
              <Input
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 bg-black/40 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 transition-all"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white h-11 rounded-xl">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Filter by action" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                {actionTypes.map((action) => (
                  <SelectItem key={action} value={action} className="font-medium">
                    {action === 'all' ? 'All Events' : action.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 relative z-10">
        {filteredLogs.map((log) => {
          const ActionIcon = getActionIcon(log.action);
          const colorClasses = getActionColor(log.action);
          
          return (
            <Card key={log.id} className="bg-white/[0.02] border-white/5 backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/10 transition-colors group">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start sm:items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-inner ${colorClasses}`}
                  >
                    <ActionIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <Badge variant="outline" className={`text-[10px] font-bold tracking-wider uppercase border-white/10 bg-black/30 ${colorClasses.split(' ')[1]}`}>
                            {log.action.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            {log.user}
                          </span>
                        </div>
                        <p className="text-white text-sm sm:text-base font-medium tracking-wide">{log.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-shrink-0 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(log.timestamp), 'MMM d, yyyy')}
                        <span className="opacity-50">•</span>
                        {format(new Date(log.timestamp), 'HH:mm:ss')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredLogs.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Activity className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No Events Recorded</h3>
              <p className="text-slate-400">
                {logs.length === 0
                  ? 'System audit trail is empty. Actions performed will be logged here.'
                  : 'No logs match your current filter and search criteria.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};