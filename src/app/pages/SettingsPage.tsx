import { useState } from 'react';
import { ImageIcon, RotateCcw, Save } from 'lucide-react';
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
      primaryColor: '#7C5CBF',
      secondaryColor: '#212126',
      accentColor: '#5EBE8A',
      logo: '',
      serverName: '8th Realm Scripts',
    };
    setLocal(defaults);
    updateSettings(defaults);
    setDirty(false);
  };

  const presets = [
    { name: '8th Realm', primary: '#7C5CBF', accent: '#5EBE8A' },
    { name: 'Magenta', primary: '#D06098', accent: '#A88AD2' },
    { name: 'Ocean', primary: '#4A8AC2', accent: '#5EBE8A' },
    { name: 'Ember', primary: '#C76050', accent: '#D4A07A' },
    { name: 'Frost', primary: '#5A96B8', accent: '#7BAAD4' },
    { name: 'Emerald', primary: '#4A9E74', accent: '#8AB8A0' },
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
          <Button onClick={save} disabled={!dirty} className="h-9 px-4 text-sm text-white rounded-md border-0 disabled:opacity-40" style={dirty ? { backgroundColor: local.primaryColor } : { backgroundColor: '#32323A' }}>
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

        {/* Colors */}
        <section>
          <h3 className="text-clean mb-4">Colors</h3>

          <div className="flex gap-2 mb-5 flex-wrap">
            {presets.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => { set('primaryColor', p.primary); set('accentColor', p.accent); }}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-edge hover:border-dim transition-colors text-sm text-subtle"
              >
                <span className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: p.primary }} />
                <span className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: p.accent }} />
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
              <Button className="h-9 px-4 text-sm text-white rounded-md border-0" style={{ backgroundColor: local.primaryColor }}>Primary</Button>
              <Button className="h-9 px-4 text-sm text-white rounded-md border-0" style={{ backgroundColor: local.accentColor }}>Accent</Button>
              <Button variant="outline" className="h-9 px-4 text-sm rounded-md bg-transparent border" style={{ borderColor: local.primaryColor, color: local.primaryColor }}>Outline</Button>
              <span className="text-sm font-mono px-2.5 py-1 rounded border" style={{ backgroundColor: `${local.primaryColor}15`, color: local.primaryColor, borderColor: `${local.primaryColor}30` }}>badge</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
