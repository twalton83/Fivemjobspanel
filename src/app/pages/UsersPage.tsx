import { useState } from 'react';
import { Users as UsersIcon, Search, Briefcase, ChevronRight, UserCog, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';

export const UsersPage = () => {
  const { users, jobs, settings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobLabel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (userId: string) => {
    setSelectedUser(userId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <UsersIcon className="h-6 w-6" style={{ color: settings.primaryColor }} />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
              Player Roster
            </h1>
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Manage user employment statuses and assignments</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-semibold">{users.length} Active Profiles</span>
        </div>
      </div>

      <div className="mb-8 relative z-10 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-white transition-colors" />
          </div>
          <Input
            placeholder="Search players by name, ID, or job role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-14 rounded-xl text-lg shadow-lg focus-visible:ring-1 focus-visible:ring-white/30 transition-all backdrop-blur-md"
          />
        </div>
      </div>

      <div className="grid gap-3 relative z-10">
        {filteredUsers.map((user) => {
          const userJob = jobs.find((j) => j.id === user.jobId);
          const userRank = userJob?.ranks.find((r) => r.level === user.rankLevel);

          return (
            <Card key={user.id} className="bg-white/[0.02] border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] group">
              <div className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: settings.primaryColor }} />
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: settings.primaryColor }} />
                        <User className="h-5 w-5 text-slate-300 relative z-10" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">{user.name}</h3>
                        <p className="text-sm font-mono text-slate-500 flex items-center gap-2">
                          <Badge variant="outline" className="border-white/10 text-slate-400 px-1.5 py-0 rounded bg-black/30 font-mono text-[10px]">
                            ID: {user.identifier.split(':')[1] || user.identifier}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right flex flex-col items-end">
                      {user.jobId ? (
                        <>
                          <Badge 
                            className="bg-black/50 text-white border border-white/10 mb-1 px-3 py-1 font-semibold tracking-wide"
                            style={{ borderBottomColor: settings.primaryColor, borderBottomWidth: '2px' }}
                          >
                            {user.jobLabel}
                          </Badge>
                          {userRank && (
                            <p className="text-xs text-slate-400 font-medium">
                              <span className="text-slate-300">{userRank.name}</span> <span className="opacity-50 mx-1">•</span> <span className="text-emerald-400 font-mono">${userRank.salary.toLocaleString()}</span>
                            </p>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                          Unemployed
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleOpenDialog(user.id)}
                      className="text-white hover:-translate-y-0.5 transition-transform duration-300 shadow-md h-10 px-4 rounded-lg hidden sm:flex font-semibold"
                      style={{ backgroundColor: settings.primaryColor, boxShadow: `0 4px 14px 0 ${settings.primaryColor}40` }}
                    >
                      <UserCog className="h-4 w-4 mr-2" />
                      Manage Role
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => handleOpenDialog(user.id)}
                      className="sm:hidden text-white hover:-translate-y-0.5 transition-transform duration-300 shadow-md h-10 w-10 rounded-lg"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredUsers.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md mt-4">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Profiles Found</h3>
              <p className="text-slate-400">We couldn't find any players matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-slate-950/90 backdrop-blur-2xl text-slate-200 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl">
          {selectedUser && (
            <AssignJobForm userId={selectedUser} onClose={handleCloseDialog} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AssignJobForm = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const { users, jobs, updateUserJob, settings } = useApp();
  const user = users.find((u) => u.id === userId);
  const [selectedJobId, setSelectedJobId] = useState<string>(user?.jobId || '');
  const [selectedRankLevel, setSelectedRankLevel] = useState<string>(
    user?.rankLevel?.toString() || ''
  );

  if (!user) return null;

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobId = selectedJobId || null;
    const rankLevel = selectedRankLevel ? parseInt(selectedRankLevel) : null;
    updateUserJob(userId, jobId, rankLevel);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 border border-white/20">
            <UserCog className="h-5 w-5 text-white" />
          </div>
          Manage Assignment
        </DialogTitle>
        <DialogDescription className="text-slate-400 text-base mt-2">
          Update the career profile for <span className="text-white font-semibold">{user.name}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job" className="text-slate-300 font-medium">Department / Job</Label>
            <Select value={selectedJobId} onValueChange={(val) => { setSelectedJobId(val); setSelectedRankLevel(''); }}>
              <SelectTrigger className="bg-black/50 border-white/10 text-white h-11 rounded-xl">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="unemployed" className="text-slate-400 font-medium">Unemployed / None</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id} className="font-medium">
                    {job.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedJob && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="rank" className="text-slate-300 font-medium">Position / Rank</Label>
              <Select value={selectedRankLevel} onValueChange={setSelectedRankLevel}>
                <SelectTrigger className="bg-black/50 border-white/10 text-white h-11 rounded-xl">
                  <SelectValue placeholder="Select a rank" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white">
                  {selectedJob.ranks
                    .sort((a, b) => a.level - b.level)
                    .map((rank) => (
                      <SelectItem key={rank.id} value={rank.level.toString()} className="font-medium">
                        Level {rank.level} - {rank.name} <span className="text-emerald-400 ml-2">${rank.salary.toLocaleString()}</span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-white hover:-translate-y-0.5 transition-all shadow-lg rounded-xl px-8 font-semibold"
            style={{ backgroundColor: settings.primaryColor, boxShadow: `0 4px 14px 0 ${settings.primaryColor}60` }}
            disabled={selectedJobId && selectedJobId !== 'unemployed' && !selectedRankLevel}
          >
            Save Assignment
          </Button>
        </div>
      </div>
    </form>
  );
};