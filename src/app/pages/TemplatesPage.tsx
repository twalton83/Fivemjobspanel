import { useState } from 'react';
import { Plus, Pencil, Trash2, FileText, DollarSign, Layers, Copy } from 'lucide-react';
import { useApp, JobTemplate, Rank } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

export const TemplatesPage = () => {
  const { templates, deleteTemplate, settings } = useApp();
  const [editingTemplate, setEditingTemplate] = useState<JobTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = (template?: JobTemplate) => {
    setEditingTemplate(template || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <FileText className="h-6 w-6" style={{ color: settings.primaryColor }} />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
              Job Templates
            </h1>
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Standardize job creation with reusable rank structures</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="relative overflow-hidden group border-0 text-white font-semibold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 z-10"
              style={{ backgroundColor: settings.primaryColor, boxShadow: `0 4px 14px 0 ${settings.primaryColor}50` }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Plus className="h-5 w-5 mr-2 relative z-10" />
              <span className="relative z-10">Create Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950/90 backdrop-blur-2xl text-slate-200 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl">
            <TemplateForm template={editingTemplate} onClose={handleCloseDialog} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="bg-white/[0.03] border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] group flex flex-col h-full"
          >
            <div className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: settings.primaryColor }} />
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                    <Copy className="w-4 h-4 text-slate-500" />
                    {template.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400 mt-2 line-clamp-2">
                    {template.description || "No description provided."}
                  </CardDescription>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(template)}
                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all h-8 w-8"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all h-8 w-8"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-950 border-white/10 text-slate-200 rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl text-white">Delete Template</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-base">
                          Are you sure you want to delete template <span className="text-white font-semibold">"{template.name}"</span>? Jobs already created using this template will not be affected.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTemplate(template.id)}
                          className="bg-red-500 hover:bg-red-600 text-white border-0 rounded-xl font-semibold shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md relative">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="h-4 w-4 text-slate-400" />
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Default Ranks
                  </h4>
                  <Badge className="ml-auto bg-white/5 text-slate-400 border-white/10 hover:bg-white/10">{template.defaultRanks.length}</Badge>
                </div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  {template.defaultRanks.sort((a, b) => a.level - b.level).map((rank) => (
                    <div
                      key={rank.id}
                      className="flex items-center justify-between p-2.5 bg-white/5 rounded-lg border border-white/10 text-sm group/rank hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className="text-white border-white/20 bg-black/50 text-xs py-0.5 px-2 font-mono"
                          style={{ borderLeftColor: settings.primaryColor, borderLeftWidth: '2px' }}
                        >
                          Lvl {rank.level}
                        </Badge>
                        <span className="text-white font-medium truncate max-w-[100px]">{rank.name}</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-semibold flex items-center text-xs bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <DollarSign className="w-3 h-3" />
                        {rank.salary.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {templates.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md md:col-span-2 lg:col-span-3">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Copy className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">No Templates Available</h3>
              <p className="text-slate-400 mb-8 max-w-md text-lg">Create reusable rank structures to quickly deploy standard jobs like Police, EMS, or Mechanics.</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="text-white hover:-translate-y-1 transition-transform duration-300 shadow-xl rounded-xl px-8 py-6 text-lg font-semibold"
                style={{ backgroundColor: settings.primaryColor, boxShadow: `0 4px 14px 0 ${settings.primaryColor}60` }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Build First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const TemplateForm = ({
  template,
  onClose,
}: {
  template: JobTemplate | null;
  onClose: () => void;
}) => {
  const { addTemplate, updateTemplate, settings } = useApp();
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [ranks, setRanks] = useState<Rank[]>(
    template?.defaultRanks || [
      { id: '1', name: 'Recruit', level: 0, salary: 1000 },
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (template) {
      updateTemplate(template.id, { name, description, defaultRanks: ranks });
    } else {
      addTemplate({ name, description, defaultRanks: ranks });
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

  return (
    <form onSubmit={handleSubmit} className="relative z-10">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 border border-white/20">
            {template ? <Pencil className="h-5 w-5 text-white" /> : <Copy className="h-5 w-5 text-white" />}
          </div>
          {template ? 'Edit Template Profile' : 'Create Job Template'}
        </DialogTitle>
        <DialogDescription className="text-slate-400 text-base mt-2">
          {template
            ? 'Modify this blueprint to adjust future job structures.'
            : 'Design a reusable blueprint with standard ranks and salaries.'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300 font-medium">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Standard Emergency Services"
              required
              className="bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-white/30 h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300 font-medium">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of jobs is this template best suited for?"
              className="bg-black/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-white/30 min-h-[80px] rounded-xl resize-none"
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="text-slate-400 w-4 h-4" />
              <Label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Default Hierarchy</Label>
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
            {template ? 'Save Blueprint' : 'Create Blueprint'}
          </Button>
        </div>
      </div>
    </form>
  );
};