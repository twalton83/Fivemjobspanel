import { useState } from 'react';
import { Palette, ImageIcon, Type, RotateCcw, Save, Server, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export const SettingsPage = () => {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof typeof settings, value: string) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    const defaultSettings = {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e293b',
      accentColor: '#8b5cf6',
      logo: '',
      serverName: 'FiveM Admin Panel',
    };
    setLocalSettings(defaultSettings);
    updateSettings(defaultSettings);
    setHasChanges(false);
  };

  const colorPresets = [
    { name: 'Ocean Blue', primary: '#3b82f6', accent: '#60a5fa', shadow: 'rgba(59,130,246,0.3)' },
    { name: 'Emerald', primary: '#10b981', accent: '#34d399', shadow: 'rgba(16,185,129,0.3)' },
    { name: 'Crimson', primary: '#ef4444', accent: '#f87171', shadow: 'rgba(239,68,68,0.3)' },
    { name: 'Amethyst', primary: '#8b5cf6', accent: '#a78bfa', shadow: 'rgba(139,92,246,0.3)' },
    { name: 'Sunset', primary: '#f97316', accent: '#fb923c', shadow: 'rgba(249,115,22,0.3)' },
    { name: 'Magenta', primary: '#ec4899', accent: '#f472b6', shadow: 'rgba(236,72,153,0.3)' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Shield className="h-6 w-6" style={{ color: settings.primaryColor }} />
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tight">
              Panel Settings
            </h1>
          </div>
          <p className="text-slate-400 font-medium tracking-wide">Configure identity and visual styling</p>
        </div>
        
        <div className="flex gap-3 relative z-10">
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-11 px-5 backdrop-blur-md transition-all"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="text-white hover:-translate-y-0.5 transition-all duration-300 rounded-xl h-11 px-6 shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
            style={hasChanges ? { backgroundColor: localSettings.primaryColor, boxShadow: `0 4px 14px 0 ${localSettings.primaryColor}50` } : { backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <p className="text-blue-200 font-medium">
            You have unsaved changes. Remember to save your configuration.
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Branding Configuration */}
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: localSettings.primaryColor }} />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Server className="h-5 w-5 text-slate-300" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wide">Server Identity</CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Customize the name and logo displayed across the panel
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serverName" className="text-slate-300 font-semibold uppercase tracking-wider text-xs">
                  Server Name
                </Label>
                <Input
                  id="serverName"
                  value={localSettings.serverName}
                  onChange={(e) => handleChange('serverName', e.target.value)}
                  placeholder="e.g. Los Santos Roleplay"
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-white/30 text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-slate-300 font-semibold uppercase tracking-wider text-xs">
                  Logo URL
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="logo"
                    value={localSettings.logo}
                    onChange={(e) => handleChange('logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl flex-1 focus-visible:ring-1 focus-visible:ring-white/30"
                  />
                  <div className="w-12 h-12 bg-black/60 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden group/logo">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: localSettings.primaryColor }} />
                    {localSettings.logo ? (
                      <img
                        src={localSettings.logo}
                        alt="Preview"
                        className="w-8 h-8 object-contain relative z-10 drop-shadow-md"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-500 relative z-10" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Configuration */}
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: localSettings.primaryColor }} />
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-slate-300" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white tracking-wide">Color Theme</CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  Personalize the visual identity and accent colors
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Quick Presets */}
            <div>
              <Label className="text-slate-300 mb-4 block font-semibold uppercase tracking-wider text-xs">Quick Presets</Label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      handleChange('primaryColor', preset.primary);
                      handleChange('accentColor', preset.accent);
                    }}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group/preset relative overflow-hidden"
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover/preset:opacity-10 transition-opacity" 
                      style={{ backgroundColor: preset.primary }} 
                    />
                    <div className="flex gap-1.5 p-1 bg-black/40 rounded-lg shadow-inner">
                      <div className="w-6 h-6 rounded-md shadow-sm" style={{ backgroundColor: preset.primary, boxShadow: `0 2px 8px ${preset.shadow}` }} />
                      <div className="w-6 h-6 rounded-md shadow-sm" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-xs font-medium text-slate-300">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Controls */}
            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-slate-300 font-semibold uppercase tracking-wider text-xs">
                  Primary Color
                </Label>
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-xl border border-white/10">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={localSettings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="h-9 w-12 cursor-pointer border-0 bg-transparent p-0.5 rounded-lg"
                  />
                  <Input
                    value={localSettings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="border-0 bg-transparent text-white font-mono text-sm focus-visible:ring-0 shadow-none h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor" className="text-slate-300 font-semibold uppercase tracking-wider text-xs">
                  Secondary Color
                </Label>
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-xl border border-white/10">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={localSettings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="h-9 w-12 cursor-pointer border-0 bg-transparent p-0.5 rounded-lg"
                  />
                  <Input
                    value={localSettings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="border-0 bg-transparent text-white font-mono text-sm focus-visible:ring-0 shadow-none h-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor" className="text-slate-300 font-semibold uppercase tracking-wider text-xs">
                  Accent Color
                </Label>
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-xl border border-white/10">
                  <Input
                    id="accentColor"
                    type="color"
                    value={localSettings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="h-9 w-12 cursor-pointer border-0 bg-transparent p-0.5 rounded-lg"
                  />
                  <Input
                    value={localSettings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="border-0 bg-transparent text-white font-mono text-sm focus-visible:ring-0 shadow-none h-9"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="pt-6 border-t border-white/5">
              <Label className="text-slate-300 mb-4 block font-semibold uppercase tracking-wider text-xs">Live Components Preview</Label>
              <div className="p-8 rounded-2xl border border-white/10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex flex-wrap gap-4 items-center justify-center">
                  <Button
                    className="text-white shadow-lg px-6 h-11 rounded-xl transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: localSettings.primaryColor, boxShadow: `0 4px 14px 0 ${localSettings.primaryColor}50` }}
                  >
                    Primary Button
                  </Button>
                  <Button
                    className="text-white shadow-lg px-6 h-11 rounded-xl transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: localSettings.accentColor, boxShadow: `0 4px 14px 0 ${localSettings.accentColor}50` }}
                  >
                    Accent Button
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/5 hover:bg-white/10 px-6 h-11 rounded-xl transition-all border-2"
                    style={{
                      borderColor: localSettings.primaryColor,
                      color: localSettings.primaryColor,
                    }}
                  >
                    Ghost Button
                  </Button>
                  <div className="px-4 py-2 rounded-lg font-mono text-sm font-semibold border backdrop-blur-md" 
                    style={{ 
                      backgroundColor: `${localSettings.primaryColor}20`, 
                      color: localSettings.primaryColor,
                      borderColor: `${localSettings.primaryColor}40` 
                    }}>
                    Badge Preview
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};