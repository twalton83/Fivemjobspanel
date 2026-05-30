import { useState } from 'react';
import { Calculator, ChevronDown, ChevronRight, DollarSign, Percent } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import type { Rank } from '../context/AppContext';

interface SalaryScaleProps {
  ranks: Rank[];
  onApply: (updated: Rank[]) => void;
  accentColor: string;
}

export const SalaryScale = ({ ranks, onApply, accentColor }: SalaryScaleProps) => {
  const [open, setOpen] = useState(false);
  const [baseSalary, setBaseSalary] = useState(1000);
  const [mode, setMode] = useState<'percent' | 'fixed'>('percent');
  const [amount, setAmount] = useState(10);

  const preview = () => {
    const sorted = [...ranks].sort((a, b) => a.level - b.level);
    return sorted.map((r, i) => {
      let salary: number;
      if (mode === 'percent') {
        salary = Math.round(baseSalary * Math.pow(1 + amount / 100, i));
      } else {
        salary = Math.round(baseSalary + amount * i);
      }
      return { ...r, salary };
    });
  };

  const apply = () => {
    const updated = preview();
    const salaryMap = new Map(updated.map(r => [r.id, r.salary]));
    onApply(ranks.map(r => salaryMap.has(r.id) ? { ...r, salary: salaryMap.get(r.id)! } : r));
  };

  const previewed = open ? preview() : [];

  return (
    <div className="border border-edge rounded-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-subtle hover:text-clean hover:bg-raised/60 transition-colors"
      >
        <Calculator className="w-3.5 h-3.5" />
        <span className="font-medium">Salary Scale</span>
        <span className="text-[10px] text-dim ml-1">Auto-fill salaries by grade</span>
        <span className="ml-auto">
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
      </button>

      <div className={cn(
        "grid transition-all duration-200",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="border-t border-edge px-3 py-3 space-y-3 bg-raised/30">
            {/* Controls row */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
              <div>
                <Label className="text-[10px] text-dim mb-1 block">Base Salary (Grade 0)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-dim" />
                  <Input
                    type="number"
                    value={baseSalary}
                    onChange={e => setBaseSalary(parseInt(e.target.value) || 0)}
                    min={0}
                    className="bg-base border-edge text-money h-8 text-sm font-mono rounded pl-6 pr-2"
                  />
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex rounded-md border border-edge overflow-hidden h-8">
                <button
                  type="button"
                  onClick={() => setMode('percent')}
                  className={cn(
                    "flex items-center gap-1 px-2.5 text-xs font-medium transition-colors",
                    mode === 'percent'
                      ? "text-white"
                      : "bg-base text-dim hover:text-subtle"
                  )}
                  style={mode === 'percent' ? { backgroundColor: accentColor } : undefined}
                >
                  <Percent className="w-3 h-3" /> %
                </button>
                <button
                  type="button"
                  onClick={() => setMode('fixed')}
                  className={cn(
                    "flex items-center gap-1 px-2.5 text-xs font-medium transition-colors border-l border-edge",
                    mode === 'fixed'
                      ? "text-white"
                      : "bg-base text-dim hover:text-subtle"
                  )}
                  style={mode === 'fixed' ? { backgroundColor: accentColor } : undefined}
                >
                  <DollarSign className="w-3 h-3" /> $
                </button>
              </div>

              <div>
                <Label className="text-[10px] text-dim mb-1 block">
                  {mode === 'percent' ? 'Increase per Grade (%)' : 'Increase per Grade ($)'}
                </Label>
                <div className="relative">
                  {mode === 'percent'
                    ? <Percent className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-dim" />
                    : <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-dim" />
                  }
                  <Input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    min={0}
                    step={mode === 'percent' ? 0.5 : 1}
                    className="bg-base border-edge text-clean h-8 text-sm font-mono rounded pl-6 pr-2"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            {ranks.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] text-dim">Preview</span>
                <div className="flex flex-wrap gap-1.5">
                  {previewed.map(r => (
                    <div key={r.id} className="flex items-center gap-1.5 bg-base border border-edge rounded px-2 py-1">
                      <span className="text-[10px] text-dim font-mono">G{r.level}</span>
                      <span className="text-xs text-money font-mono">${r.salary.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apply */}
            <Button
              type="button"
              onClick={apply}
              disabled={ranks.length === 0}
              className="w-full h-8 text-xs font-semibold tracking-wide uppercase rounded border-0"
              style={{ backgroundColor: accentColor, color: '#FFFFFF' }}
            >
              Apply to All Grades
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
