import { Outlet, Link, useLocation } from 'react-router';
import { Briefcase, FileText, Users, Activity, Settings, Menu, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { useState } from 'react';
import { cn } from './ui/utils';

export const Layout = () => {
  const location = useLocation();
  const { settings } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/', label: 'Jobs', icon: Briefcase },
    { path: '/templates', label: 'Templates', icon: FileText },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/logs', label: 'Activity Logs', icon: Activity },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 overflow-hidden flex relative font-sans selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full opacity-[0.15] blur-[120px]"
          style={{ backgroundColor: settings.primaryColor }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'relative flex-shrink-0 flex flex-col h-screen border-r border-white/5 bg-black/40 backdrop-blur-xl transition-all duration-300 z-50',
          sidebarOpen ? 'w-64' : 'w-[72px]'
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/5">
          {sidebarOpen && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10 shrink-0 relative overflow-hidden group"
                style={{ 
                  background: `linear-gradient(135deg, ${settings.primaryColor}40, transparent)`,
                }}
              >
                <div 
                  className="absolute inset-0 opacity-50 transition-opacity group-hover:opacity-100" 
                  style={{ background: settings.primaryColor, filter: 'blur(10px)' }}
                />
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-6 h-6 object-contain relative z-10 drop-shadow-md" />
                ) : (
                  <Shield className="w-5 h-5 text-white relative z-10 drop-shadow-md" style={{ color: settings.primaryColor }} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm tracking-wide uppercase truncate">{settings.serverName}</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Admin Panel</span>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white hover:bg-white/5 shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-none">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={cn(
                      'group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden',
                      isActive
                        ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {isActive && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                        style={{ backgroundColor: settings.primaryColor, boxShadow: `0 0 10px ${settings.primaryColor}` }}
                      />
                    )}
                    {isActive && (
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{ background: `linear-gradient(90deg, ${settings.primaryColor}80, transparent)` }}
                      />
                    )}
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-transform duration-300 relative z-10",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )} 
                    style={isActive ? { color: settings.primaryColor } : {}}
                    />
                    {sidebarOpen && (
                      <span className="font-medium tracking-wide text-sm relative z-10 truncate">{item.label}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-300">AD</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">Administrator</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                  Online
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};