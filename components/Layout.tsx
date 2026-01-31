import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, List, Settings } from 'lucide-react';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      <main className="flex-1 pb-24 overflow-y-auto no-scrollbar">
        <div className="max-w-md mx-auto w-full min-h-full p-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-slate-800 z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-coral' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <Calendar size={24} />
            <span className="text-xs font-medium">Calendar</span>
          </NavLink>

          <NavLink
            to="/moves"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-coral' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <List size={24} />
            <span className="text-xs font-medium">Moves</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-coral' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <Settings size={24} />
            <span className="text-xs font-medium">Setting</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};
