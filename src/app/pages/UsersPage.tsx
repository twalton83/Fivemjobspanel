import { useState } from 'react';
import { Search, UserCog, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export const UsersPage = () => {
  const { users, jobs, settings } = useApp();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.identifier.toLowerCase().includes(search.toLowerCase()) ||
    u.jobLabel?.toLowerCase().includes(search.toLowerCase())
  );

  const openDialog = (id: string) => { setSelectedUser(id); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setSelectedUser(null); };

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-clean">Players</h1>
          <p className="text-sm text-subtle mt-1">Manage employment and role assignments</p>
        </div>
        <span className="text-sm text-subtle">{users.length} profiles</span>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim pointer-events-none" />
        <Input
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 bg-surface border-edge text-clean placeholder:text-dim h-9 text-sm rounded-md"
        />
      </div>

      {/* Player list */}
      <div className="space-y-1.5">
        {filtered.map(user => {
          const userJob = jobs.find(j => j.id === user.jobId);
          const userRank = userJob?.ranks.find(r => r.level === user.rankLevel);

          return (
            <div key={user.id} className="flex items-center justify-between px-5 py-3.5 rounded-md bg-surface border border-edge hover:border-edge/80 transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded bg-raised flex items-center justify-center shrink-0 text-dim">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-clean">{user.name}</p>
                  <p className="text-xs font-mono text-dim truncate">{user.identifier.split(':')[1] || user.identifier}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  {user.jobId ? (
                    <>
                      <p className="text-sm text-soft font-medium">{user.jobLabel}</p>
                      {userRank && (
                        <p className="text-xs text-dim">
                          {userRank.name} · <span className="text-money font-mono">${userRank.salary.toLocaleString()}</span>
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-danger">Unemployed</p>
                  )}
                </div>
                <button
                  onClick={() => openDialog(user.id)}
                  className="h-8 px-3 rounded text-sm font-medium text-white flex items-center gap-1.5 transition-opacity opacity-70 group-hover:opacity-100"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  <UserCog className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Manage</span>
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-subtle">No players found</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm bg-surface border-edge text-clean rounded-lg shadow-2xl shadow-black/60">
          {selectedUser && <AssignForm userId={selectedUser} onClose={closeDialog} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AssignForm = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const { users, jobs, updateUserJob, settings } = useApp();
  const user = users.find(u => u.id === userId);
  const [jobId, setJobId] = useState<string>(user?.jobId || '');
  const [rankLevel, setRankLevel] = useState<string>(user?.rankLevel?.toString() || '');

  if (!user) return null;
  const selectedJob = jobs.find(j => j.id === jobId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserJob(userId, jobId || null, rankLevel ? parseInt(rankLevel) : null);
    onClose();
  };

  return (
    <form onSubmit={submit}>
      <DialogHeader className="mb-4">
        <DialogTitle className="text-base font-semibold">Assign Role</DialogTitle>
        <DialogDescription className="text-subtle text-sm">
          Update job for <span className="text-clean font-medium">{user.name}</span>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-subtle mb-1.5 block">Job</Label>
          <Select value={jobId} onValueChange={v => { setJobId(v); setRankLevel(''); }}>
            <SelectTrigger className="bg-raised border-edge text-clean h-9 rounded-md text-sm">
              <SelectValue placeholder="Select job" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-edge text-clean">
              <SelectItem value="unemployed" className="text-subtle">None</SelectItem>
              {jobs.map(j => <SelectItem key={j.id} value={j.id}>{j.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {selectedJob && (
          <div>
            <Label className="text-xs text-subtle mb-1.5 block">Rank</Label>
            <Select value={rankLevel} onValueChange={setRankLevel}>
              <SelectTrigger className="bg-raised border-edge text-clean h-9 rounded-md text-sm">
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-edge text-clean">
                {selectedJob.ranks.sort((a, b) => a.level - b.level).map(r => (
                  <SelectItem key={r.id} value={r.level.toString()}>
                    {r.name} <span className="text-money ml-1">${r.salary.toLocaleString()}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-edge">
        <Button type="button" variant="ghost" onClick={onClose} className="h-9 px-4 text-sm text-subtle hover:text-clean rounded-md">Cancel</Button>
        <Button type="submit" className="h-9 px-5 text-sm text-white rounded-md border-0" style={{ backgroundColor: settings.primaryColor }} disabled={!!(jobId && jobId !== 'unemployed' && !rankLevel)}>
          Save
        </Button>
      </div>
    </form>
  );
};
