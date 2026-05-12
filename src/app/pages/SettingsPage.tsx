import { useState } from 'react';
import { ImageIcon, RotateCcw, Save, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export const SettingsPage = () => {
  const { settings, updateSettings } = useApp();
  const [local, setLocal] = useState(settings);
  const [dirty, setDirty] = useState(false);

  const set = (key: keyof typeof settings, value: string) => {
    setLocal(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = () => { updateSettings(local); setDirty(false); };

  const reset = () => {
    const defaults = {
      primaryColor: '#3B82F6',
      secondaryColor: '#12152A',
      accentColor: '#A46BF5',
      logo: '',
      serverName: '8th Realm Scripts',
      theme: 'dark' as const,
    };
    setLocal(defaults);
    updateSettings(defaults);
    setDirty(false);
  };

  const presets = [
    { name: '8th Realm', primary: '#3B82F6', accent: '#A46BF5' },
    { name: 'Rift Violet', primary: '#A46BF5', accent: '#6E3BBF' },
    { name: 'Realm Rose', primary: '#E8467A', accent: '#A46BF5' },
    { name: 'Ocean', primary: '#4A8AC2', accent: '#7BB3FF' },
  ];

  return (
    <div className="pb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-clean">Settings</h1>
          <p className="text-sm text-subtle mt-1">Panel identity and appearance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset} className="h-9 px-4 text-sm bg-surface border-edge text-subtle hover:text-clean rounded-md">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
          </Button>
          <Button onClick={save} disabled={!dirty} className="h-9 px-4 text-sm font-semibold tracking-wide uppercase rounded-md border-0 disabled:opacity-40" style={dirty ? { backgroundColor: local.primaryColor, color: '#FFFFFF' } : { backgroundColor: '#2A2A3E' }}>
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save
          </Button>
        </div>
      </div>

      {dirty && (
        <div className="mb-6 px-4 py-2.5 rounded-md border border-accent-pop/20 bg-accent-pop/5 text-accent-pop text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-pop" />
          Unsaved changes
        </div>
      )}

      <div className="space-y-8">
        {/* Identity */}
        <section>
          <h3 className="text-clean mb-4">Server Identity</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-subtle mb-1.5 block">Name</Label>
              <Input value={local.serverName} onChange={e => set('serverName', e.target.value)} placeholder="My Server" className="bg-surface border-edge text-clean placeholder:text-dim h-9 text-sm rounded-md" />
            </div>
            <div>
              <Label className="text-xs text-subtle mb-1.5 block">Logo URL</Label>
              <div className="flex gap-2">
                <Input value={local.logo} onChange={e => set('logo', e.target.value)} placeholder="https://..." className="bg-surface border-edge text-clean placeholder:text-dim h-9 text-sm rounded-md flex-1" />
                <div className="w-9 h-9 rounded bg-surface border border-edge flex items-center justify-center shrink-0">
                  {local.logo ? (
                    <img src={local.logo} alt="" className="w-5 h-5 object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-dim" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Theme */}
        <section>
          <h3 className="text-clean mb-4">Theme</h3>
          <div className="flex gap-3">
            {([
              { value: 'dark' as const, label: 'Dark', icon: Moon, desc: 'The Void' },
              { value: 'light' as const, label: 'Light', icon: Sun, desc: 'The Luminous' },
            ]).map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('theme', value)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md border transition-colors ${
                  local.theme === value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-edge bg-surface text-subtle hover:border-dim'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <div className="text-left">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-subtle">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section>
          <h3 className="text-clean mb-4">Colors</h3>

          <div className="flex gap-2 mb-5 flex-wrap">
            {presets.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => { set('primaryColor', p.primary); set('accentColor', p.accent); }}
                className="flex items-center gap-2 px-3 py-2 bg-surface border border-edge hover:border-dim transition-colors text-sm text-subtle"
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                <span className="w-3.5 h-3.5" style={{ backgroundColor: p.primary, borderRadius: 'var(--radius-sm)' }} />
                <span className="w-3.5 h-3.5" style={{ backgroundColor: p.accent, borderRadius: 'var(--radius-sm)' }} />
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { key: 'primaryColor' as const, label: 'Primary' },
              { key: 'secondaryColor' as const, label: 'Secondary' },
              { key: 'accentColor' as const, label: 'Accent' },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-xs text-subtle mb-1.5 block">{label}</Label>
                <div className="flex items-center gap-2 bg-surface border border-edge rounded-md px-2.5 h-9">
                  <input
                    type="color"
                    value={local[key]}
                    onChange={e => set(key, e.target.value)}
                    className="w-6 h-6 cursor-pointer border-0 bg-transparent p-0 rounded"
                  />
                  <span className="text-sm font-mono text-soft">{local[key]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-6 p-6 rounded-md border border-edge bg-base">
            <p className="text-xs text-dim mb-3 uppercase tracking-wider">Preview</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Button className="h-9 px-4 text-sm font-semibold tracking-wide uppercase rounded-md border-0" style={{ backgroundColor: local.primaryColor, color: '#FFFFFF' }}>Primary</Button>
              <Button className="h-9 px-4 text-sm font-semibold tracking-wide uppercase rounded-md border-0" style={{ backgroundColor: local.accentColor, color: '#FFFFFF' }}>Accent</Button>
              <Button variant="outline" className="h-9 px-4 text-sm rounded-md bg-transparent border" style={{ borderColor: local.primaryColor, color: local.primaryColor }}>Outline</Button>
              <span className="text-sm font-mono px-2.5 py-1 rounded border" style={{ backgroundColor: `${local.primaryColor}15`, color: local.primaryColor, borderColor: `${local.primaryColor}30` }}>badge</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
