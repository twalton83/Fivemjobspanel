import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Briefcase, DollarSign, Layers, Shield } from 'lucide-react';
import { useApp, Job, Rank } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { cn } from '../components/ui/utils';

export const JobsPage = () => {
  const { jobs, addJob, updateJob, deleteJob, settings } = useApp();
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleJobExpanded = (jobId: string) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const handleOpenDialog = (job?: Job) => {
    setEditingJob(job || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingJob(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Briefcase className="h-6 w-6" style={{ color: settings.primaryColor }} />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
              Jobs Management
            </h1>
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Configure career paths, ranks, and compensation</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="relative overflow-hidden group border-0 text-white font-semibold tracking-wide shadow-lg shadow-black/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 z-10"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Plus className="h-5 w-5 mr-2 relative z-10" />
              <span className="relative z-10">Create Job</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950/90 backdrop-blur-2xl text-slate-200 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl">
            <JobForm job={editingJob} onClose={handleCloseDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats/Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Briefcase className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Jobs</p>
            <p className="text-2xl font-bold text-white">{jobs.length}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Layers className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Ranks</p>
            <p className="text-2xl font-bold text-white">{jobs.reduce((acc, job) => acc + job.ranks.length, 0)}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">System Status</p>
            <p className="text-2xl font-bold text-emerald-400 text-sm mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
            </p>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className="bg-white/[0.03] border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] group"
          >
            <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: settings.primaryColor }} />
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleJobExpanded(job.id)}
                      className="text-slate-400 hover:text-white hover:bg-white/10 -ml-2 rounded-lg transition-transform duration-200"
                    >
                      {expandedJobs.has(job.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </Button>
                    <CardTitle className="text-xl font-bold text-white tracking-wide">{job.label}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className="bg-black/40 border-white/10 text-slate-300 font-mono tracking-wider px-2.5 py-0.5 backdrop-blur-md"
                    >
                      {job.name}
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400 ml-[3.25rem] text-sm max-w-2xl leading-relaxed">
                    {job.description || "No description provided for this job."}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(job)}
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-950 border-white/10 text-slate-200 rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl text-white">Delete Job</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-base">
                          Are you sure you want to delete <span className="text-white font-semibold">"{job.label}"</span>? This will permanently remove this job and all its ranks from the database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteJob(job.id)}
                          className="bg-red-500 hover:bg-red-600 text-white border-0 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] font-semibold"
                        >
                          Delete Permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            {/* Expanded Ranks View */}
            <div className={cn(
              "grid transition-all duration-300 ease-in-out",
              expandedJobs.has(job.id) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
              <div className="overflow-hidden">
                <CardContent className="pt-0 pb-6 ml-[3.25rem]">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none rounded-xl" />
                    
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <Layers className="h-4 w-4 text-slate-400" />
                      <h4 className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Rank Hierarchy</h4>
                      <Badge className="ml-auto bg-white/5 text-slate-400 hover:bg-white/10 border-white/10">{job.ranks.length} Ranks</Badge>
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                      {job.ranks.sort((a, b) => a.level - b.level).map((rank) => (
                        <div
                          key={rank.id}
                          className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/10 group/rank"
                        >
                          <div className="flex items-center gap-4">
                            <Badge
                              variant="outline"
                              className="text-white border-white/20 bg-black/50 min-w-[70px] justify-center font-mono py-1"
                              style={{ borderLeftColor: settings.primaryColor, borderLeftWidth: '3px' }}
                            >
                              Level {rank.level}
                            </Badge>
                            <span className="text-white font-medium tracking-wide">{rank.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
                            <DollarSign className="h-3.5 w-3.5" />
                            {rank.salary.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}

        {jobs.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Briefcase className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No Jobs Created</h3>
              <p className="text-slate-400 mb-8 max-w-md text-lg">Your server is currently empty. Start building your economy by creating the first job.</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="text-white hover:-translate-y-1 transition-transform duration-300 shadow-xl shadow-black px-8 py-6 rounded-xl text-lg font-semibold"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const JobForm = ({ job, onClose }: { job: Job | null; onClose: () => void }) => {
  const { addJob, updateJob, templates, settings } = useApp();
  const [name, setName] = useState(job?.name || '');
  const [label, setLabel] = useState(job?.label || '');
  const [description, setDescription] = useState(job?.description || '');
  const [ranks, setRanks] = useState<Rank[]>(
    job?.ranks || [
      { id: '1', name: 'Employee', level: 0, salary: 1000 },
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (job) {
      updateJob(job.id, { name, label, description, ranks });
    } else {
      addJob({ name, label, description, ranks });
    }
    onClose();
  };

  const addRank = () => {
    const newLevel = ranks.length > 0 ? Math.max(...ranks.map((r) => r.level)) + 1 : 0;
    setRanks([
      ...ranks,
      {
        id: Date.now().toString(),
        name: `Rank ${newLevel}`,
        level: newLevel,
        salary: 1000 + newLevel * 500,
      },
    ]);
  };

  const updateRank = (id: string, updates: Partial<Rank>) => {
    setRanks(ranks.map((rank) => (rank.id === id ? { ...rank, ...updates } : rank)));
  };

  const removeRank = (id: string) => {
    setRanks(ranks.filter((rank) => rank.id !== id));
  };

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setRanks(
        template.defaultRanks.map((rank) => ({
          ...rank,
          id: Date.now().toString() + Math.random(),
        }))
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative z-10">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 border border-white/20">
            {job ? <Pencil className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
          </div>
          {job ? 'Edit Job Profile' : 'Create New Job'}
        </DialogTitle>
        <DialogDescription className="text-slate-400 text-base mt-2">
          {job
            ? 'Update the job details and modify the rank hierarchy below.'
            : 'Establish a new career path with ranks and salary brackets.'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Core Info */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">General Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-medium">Internal ID (Resource Name)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., police"
                required
                className="bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-white/30 h-11 rounded-xl font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label" className="text-slate-300 font-medium">Display Label</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Los Santos Police"
                required
                className="bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-white/30 h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300 font-medium">Job Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief overview of this job's duties..."
              className="bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-white/30 min-h-[100px] rounded-xl resize-none"
            />
          </div>
        </div>

        {/* Templates */}
        {!job && templates.length > 0 && (
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
            <Label className="text-blue-200 font-medium flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4" /> Load from Template
            </Label>
            <div className="flex gap-2 flex-wrap">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => loadTemplate(template.id)}
                  className="bg-black/40 border-blue-500/30 text-blue-100 hover:bg-blue-500/20 hover:text-white rounded-lg transition-colors"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Ranks Management */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Rank Structure</h3>
              <Badge className="ml-2 bg-white/10 text-slate-300 border-0">{ranks.length} Ranks</Badge>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addRank}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-sm rounded-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Rank
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {ranks
              .sort((a, b) => a.level - b.level)
              .map((rank) => (
                <div key={rank.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors group relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 group-hover:bg-white/40 transition-colors" />
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Level</Label>
                      <Input
                        type="number"
                        value={rank.level}
                        onChange={(e) =>
                          updateRank(rank.id, { level: parseInt(e.target.value) || 0 })
                        }
                        className="bg-black/50 border-white/10 text-white h-10 rounded-lg font-mono text-center"
                      />
                    </div>
                    <div className="col-span-5 space-y-1.5">
                      <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Rank Name</Label>
                      <Input
                        value={rank.name}
                        onChange={(e) => updateRank(rank.id, { name: e.target.value })}
                        className="bg-black/50 border-white/10 text-white h-10 rounded-lg font-medium"
                      />
                    </div>
                    <div className="col-span-4 space-y-1.5">
                      <Label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Salary
                      </Label>
                      <Input
                        type="number"
                        value={rank.salary}
                        onChange={(e) =>
                          updateRank(rank.id, { salary: parseInt(e.target.value) || 0 })
                        }
                        className="bg-black/50 border-emerald-500/30 text-emerald-400 h-10 rounded-lg font-mono focus-visible:ring-emerald-500/50"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end pb-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRank(rank.id)}
                        className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-10 w-10 rounded-lg transition-colors"
                        disabled={ranks.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
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
          >
            {job ? 'Save Changes' : 'Create Job'}
          </Button>
        </div>
      </div>
    </form>
  );
};