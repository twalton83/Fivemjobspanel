import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, DollarSign } from 'lucide-react';
import { useApp, Job, Rank } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { cn } from '../components/ui/utils';

export const JobsPage = () => {
  const { jobs, addJob, updateJob, deleteJob, settings } = useApp();
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedJobs((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const openDialog = (job?: Job) => { setEditingJob(job || null); setIsDialogOpen(true); };
  const closeDialog = () => { setIsDialogOpen(false); setEditingJob(null); };
  const openDeleteDialog = (job: Job) => { setDeletingJob(job); setDeleteConfirmText(''); };
  const closeDeleteDialog = () => { setDeletingJob(null); setDeleteConfirmText(''); };
  const confirmDelete = async () => {
    if (!deletingJob || deleteConfirmText !== deletingJob.label) return;
    const ok = await deleteJob(deletingJob.id, deleteConfirmText);
    if (ok) closeDeleteDialog();
  };

  const totalRanks = jobs.reduce((a, j) => a + j.ranks.length, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-clean">Jobs</h1>
          <p className="text-sm text-subtle mt-1">Manage career paths, ranks, and salaries</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="h-9 px-4 text-sm font-semibold tracking-wide uppercase rounded-md border-0" style={{ backgroundColor: settings.primaryColor, color: '#FFFFFF' }}>
              <Plus className="w-4 h-4 mr-1.5" /> New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto text-clean">
            <JobForm job={editingJob} onClose={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-6 mb-6 text-sm">
        <span className="text-subtle">{jobs.length} jobs</span>
        <span className="text-dim">|</span>
        <span className="text-subtle">{totalRanks} ranks</span>
        <span className="text-dim">|</span>
        <span className="text-money flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-money" /> Online
        </span>
      </div>

      {/* Jobs */}
      <div className="space-y-2">
        {jobs.map((job) => {
          const expanded = expandedJobs.has(job.id);
          return (
            <Card key={job.id} className="bg-surface border-edge hover:border-edge/80 transition-colors">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button onClick={() => toggleExpand(job.id)} className="text-subtle hover:text-clean transition-colors shrink-0">
                      {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-semibold text-clean">{job.label}</span>
                        <span className="text-xs font-mono text-dim">{job.name}</span>
                      </div>
                      {job.description && (
                        <p className="text-sm text-subtle mt-0.5 truncate max-w-md">{job.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-4">
                    <span className="text-xs text-dim mr-2">{job.ranks.length} ranks</span>
                    <button onClick={() => openDialog(job)} className="p-1.5 rounded text-dim hover:text-clean hover:bg-raised transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDeleteDialog(job)} className="p-1.5 rounded text-dim hover:text-danger hover:bg-danger/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              {/* Ranks */}
              <div className={cn(
                "grid transition-all duration-200",
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="border-t border-edge">
                    {job.ranks.sort((a, b) => a.level - b.level).map((rank, i) => (
                      <div key={rank.id} className={cn(
                        "flex items-center justify-between px-5 py-3 text-sm",
                        i !== job.ranks.length - 1 && "border-b border-edge/60"
                      )}>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-dim w-6 text-right">{rank.level}</span>
                          <span className="w-px h-4 bg-edge" />
                          <span className="text-soft font-medium">{rank.name}</span>
                        </div>
                        <span className="font-mono text-sm text-money flex items-center gap-0.5">
                          <DollarSign className="w-3.5 h-3.5" />{rank.salary.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {jobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-subtle mb-4">No jobs yet</p>
            <Button onClick={() => openDialog()} className="h-9 px-5 text-sm font-semibold tracking-wide uppercase rounded-md border-0" style={{ backgroundColor: settings.primaryColor, color: '#FFFFFF' }}>
              <Plus className="w-4 h-4 mr-1.5" /> Create First Job
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!deletingJob} onOpenChange={(o) => !o && closeDeleteDialog()}>
        <DialogContent className="text-clean">
          <DialogHeader>
            <DialogTitle>Delete {deletingJob?.label}?</DialogTitle>
            <DialogDescription className="text-subtle">
              This permanently removes the job and all ranks, and resets every player currently in this job to <span className="font-semibold">unemployed</span>. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            <Label className="text-xs text-subtle">
              Type <span className="font-mono text-clean">{deletingJob?.label}</span> to confirm
            </Label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              autoFocus
              className="bg-raised border-edge text-clean h-9 text-sm rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={closeDeleteDialog} className="h-9 px-4 text-sm text-subtle hover:text-clean rounded-md">Cancel</Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={!deletingJob || deleteConfirmText !== deletingJob.label}
              className="h-9 px-5 text-sm font-semibold tracking-wide uppercase rounded-md border-0 bg-danger hover:bg-danger/90 text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ── Job Form ────────────────────────────────────── */

const JobForm = ({ job, onClose }: { job: Job | null; onClose: () => void }) => {
  const { addJob, updateJob, templates, settings } = useApp();
  const [name, setName] = useState(job?.name || '');
  const [label, setLabel] = useState(job?.label || '');
  const [description, setDescription] = useState(job?.description || '');
  const [ranks, setRanks] = useState<Rank[]>(
    job?.ranks || [{ id: '1', name: 'Employee', level: 0, salary: 1000 }]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    job ? updateJob(job.id, { name, label, description, ranks }) : addJob({ name, label, description, ranks });
    onClose();
  };

  const addRank = () => {
    const lvl = ranks.length > 0 ? Math.max(...ranks.map(r => r.level)) + 1 : 0;
    setRanks([...ranks, { id: Date.now().toString(), name: `Rank ${lvl}`, level: lvl, salary: 1000 + lvl * 500 }]);
  };

  const patchRank = (id: string, u: Partial<Rank>) => setRanks(ranks.map(r => r.id === id ? { ...r, ...u } : r));
  const removeRank = (id: string) => setRanks(ranks.filter(r => r.id !== id));

  const loadTemplate = (tid: string) => {
    const t = templates.find(t => t.id === tid);
    if (t) setRanks(t.defaultRanks.map(r => ({ ...r, id: Date.now().toString() + Math.random() })));
  };

  return (
    <form onSubmit={submit}>
      <DialogHeader className="mb-5">
        <DialogTitle className="text-lg font-semibold">{job ? 'Edit Job' : 'New Job'}</DialogTitle>
        <DialogDescription className="text-subtle text-sm">{job ? 'Update details and rank structure.' : 'Define a career path with ranks and salaries.'}</DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-subtle mb-1.5 block">Internal ID</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="police" required className="bg-raised border-edge text-clean placeholder:text-dim h-9 text-sm font-mono rounded-md" />
            </div>
            <div>
              <Label className="text-xs text-subtle mb-1.5 block">Display Name</Label>
              <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="Los Santos Police" required className="bg-raised border-edge text-clean placeholder:text-dim h-9 text-sm rounded-md" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-subtle mb-1.5 block">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief overview..." className="bg-raised border-edge text-clean placeholder:text-dim min-h-[4.5rem] text-sm rounded-md resize-none" />
          </div>
        </div>

        {/* Template loader */}
        {!job && templates.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-subtle">Load template:</span>
            {templates.map(t => (
              <button key={t.id} type="button" onClick={() => loadTemplate(t.id)} className="text-sm text-accent-pop hover:underline">{t.name}</button>
            ))}
          </div>
        )}

        {/* Ranks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-subtle font-medium">Ranks ({ranks.length})</span>
            <button type="button" onClick={addRank} className="text-sm text-accent-pop hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-1.5 max-h-[18rem] overflow-y-auto">
            {ranks.sort((a, b) => a.level - b.level).map(rank => (
              <div key={rank.id} className="grid grid-cols-[3.5rem_1fr_6.5rem_2rem] gap-2 items-center bg-raised border border-edge rounded-md px-3 py-2.5">
                <Input type="number" value={rank.level} onChange={e => patchRank(rank.id, { level: parseInt(e.target.value) || 0 })} className="bg-base border-edge text-clean h-8 text-sm font-mono text-center rounded p-0" />
                <Input value={rank.name} onChange={e => patchRank(rank.id, { name: e.target.value })} className="bg-base border-edge text-clean h-8 text-sm rounded px-2" />
                <Input type="number" value={rank.salary} onChange={e => patchRank(rank.id, { salary: parseInt(e.target.value) || 0 })} className="bg-base border-edge text-money h-8 text-sm font-mono rounded px-2" />
                <button type="button" onClick={() => removeRank(rank.id)} disabled={ranks.length === 1} className="text-dim hover:text-danger disabled:opacity-30 transition-colors flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-edge">
          <Button type="button" variant="ghost" onClick={onClose} className="h-9 px-4 text-sm text-subtle hover:text-clean rounded-md">Cancel</Button>
          <Button type="submit" className="h-9 px-5 text-sm font-semibold tracking-wide uppercase rounded-md border-0" style={{ backgroundColor: settings.primaryColor, color: '#FFFFFF' }}>
            {job ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
};
