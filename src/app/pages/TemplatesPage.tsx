import { useState } from 'react';
import { Plus, Pencil, Trash2, DollarSign, Copy } from 'lucide-react';
import { useApp, JobTemplate, Rank } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { cn } from '../components/ui/utils';

export const TemplatesPage = () => {
  const { templates, deleteTemplate, settings } = useApp();
  const [editing, setEditing] = useState<JobTemplate | null>(null);
  const [open, setOpen] = useState(false);

  const openDialog = (t?: JobTemplate) => { setEditing(t || null); setOpen(true); };
  const closeDialog = () => { setOpen(false); setEditing(null); };

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-clean">Templates</h1>
          <p className="text-sm text-subtle mt-1">Reusable rank structures for quick job creation</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()} className="h-9 px-4 text-sm font-semibold tracking-wide uppercase rounded-md border-0" style={{ backgroundColor: settings.primaryColor, color: '#FFFFFF' }}>
              <Plus className="w-4 h-4 mr-1.5" /> New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto text-clean">
            <TemplateForm template={editing} onClose={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.id} className="bg-surface border-edge hover:border-edge/80 transition-colors flex flex-col">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-clean">{t.name}</p>
                  <p className="text-sm text-subtle mt-1 line-clamp-2">{t.description || 'No description'}</p>
                </div>
                <div className="flex gap-0.5 ml-2 shrink-0">
                  <button onClick={() => openDialog(t)} className="p-1.5 rounded text-dim hover:text-clean hover:bg-raised transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-1.5 rounded text-dim hover:text-danger hover:bg-danger/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="text-clean">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {t.name}?</AlertDialogTitle>
                        <AlertDialogDescription className="text-subtle">Existing jobs won't be affected.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-3">
                        <AlertDialogCancel className="bg-raised border-edge text-soft hover:text-clean rounded-md">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteTemplate(t.id)} className="bg-danger hover:bg-danger/90 text-white border-0 rounded-md">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-0 px-4 pb-4">
              <div className="border-t border-edge pt-3">
                <p className="text-xs text-dim mb-2">{t.defaultRanks.length} default ranks</p>
                <div className="space-y-0">
                  {t.defaultRanks.sort((a, b) => a.level - b.level).map((rank, i) => (
                    <div key={rank.id} className={cn(
                      "flex items-center justify-between py-2 text-sm",
                      i !== t.defaultRanks.length - 1 && "border-b border-edge/50"
                    )}>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-dim w-4 text-right">{rank.level}</span>
                        <span className="text-soft">{rank.name}</span>
                      </div>
                      <span className="font-mono text-sm text-money flex items-center gap-0.5">
                        <DollarSign className="w-3 h-3" />{rank.salary.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-20">
            <p className="text-subtle mb-4">No templates yet</p>
            <Button onClick={() => openDialog()} className="h-9 px-5 text-sm font-semibold tracking-wide uppercase rounded-md border-0" style={{ backgroundColor: settings.primaryColor, color: '#FFFFFF' }}>
              <Plus className="w-4 h-4 mr-1.5" /> Create Template
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const TemplateForm = ({ template, onClose }: { template: JobTemplate | null; onClose: () => void }) => {
  const { addTemplate, updateTemplate, settings } = useApp();
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [ranks, setRanks] = useState<Rank[]>(
    template?.defaultRanks || [{ id: '1', name: 'Recruit', level: 0, salary: 1000 }]
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    template ? updateTemplate(template.id, { name, description, defaultRanks: ranks }) : addTemplate({ name, description, defaultRanks: ranks });
    onClose();
  };

  const addRank = () => {
    const lvl = ranks.length > 0 ? Math.max(...ranks.map(r => r.level)) + 1 : 0;
    setRanks([...ranks, { id: Date.now().toString(), name: `Rank ${lvl}`, level: lvl, salary: 1000 + lvl * 500 }]);
  };

  const patchRank = (id: string, u: Partial<Rank>) => setRanks(ranks.map(r => r.id === id ? { ...r, ...u } : r));
  const removeRank = (id: string) => setRanks(ranks.filter(r => r.id !== id));

  return (
    <form onSubmit={submit}>
      <DialogHeader className="mb-5">
        <DialogTitle className="text-lg font-semibold">{template ? 'Edit Template' : 'New Template'}</DialogTitle>
        <DialogDescription className="text-subtle text-sm">Reusable blueprint for job creation.</DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-subtle mb-1.5 block">Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Emergency Services" required className="bg-raised border-edge text-clean placeholder:text-dim h-9 text-sm rounded-md" />
          </div>
          <div>
            <Label className="text-xs text-subtle mb-1.5 block">Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What jobs is this template for?" className="bg-raised border-edge text-clean placeholder:text-dim min-h-[3.5rem] text-sm rounded-md resize-none" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-subtle font-medium">Default Ranks ({ranks.length})</span>
            <button type="button" onClick={addRank} className="text-sm text-accent-pop hover:underline flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-1.5 max-h-[16rem] overflow-y-auto">
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
            {template ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
};
