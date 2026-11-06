/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PRECONFIGURED_USERS } from '../../data/seedData';
import { Shield, UserCheck, ChevronDown, Sparkles, LogOut, LogIn } from 'lucide-react';

interface DemoRoleBannerProps {
  onOpenLogin: () => void;
  onNavigatePortal: () => void;
}

export const DemoRoleBanner: React.FC<DemoRoleBannerProps> = ({ onOpenLogin, onNavigatePortal }) => {
  const { userProfile, isDemoUser, switchDemoRole, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="bg-[#0a192f] text-slate-200 border-b border-amber-500/30 px-3 py-1.5 text-xs font-medium relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-amber-400" /> Demo Evaluation Mode
          </span>
          <span className="hidden sm:inline text-slate-300">
            Karawo TVET College Portal — Active User Role:
          </span>
          {userProfile ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {userProfile.fullName} ({userProfile.role.replace('_', ' ').toUpperCase()})
              {userProfile.status === 'inactive' && (
                <span className="bg-rose-500 text-white text-[9px] px-1.5 rounded">DEACTIVATED</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 italic">Visitor (Public View)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1 rounded border border-slate-600 transition shadow-sm"
              title="Switch demo persona to test specific role capabilities"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Demo Persona</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-2 z-50 text-slate-200">
                  <div className="px-3 py-1 text-[11px] font-bold text-amber-400 border-b border-slate-800 uppercase tracking-wider">
                    Select Role Persona to Test
                  </div>
                  {DEMO_PRECONFIGURED_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchDemoRole(user.id);
                        setDropdownOpen(false);
                        onNavigatePortal();
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-slate-800 transition ${
                        userProfile?.id === user.id ? 'bg-amber-950/40 border-l-2 border-amber-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{user.fullName}</span>
                        <span className="capitalize text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {user.departmentName || user.email}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-800 mt-1 pt-1 px-3">
                    <span className="text-[10px] text-slate-500 italic">
                      * Switch instantaneously between Admin, Registrar, Dept Head, Teacher & Student
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {userProfile ? (
            <>
              <button
                onClick={onNavigatePortal}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-bold transition flex items-center gap-1 shadow"
              >
                <Shield className="w-3.5 h-3.5" />
                Go to Portal
              </button>
              <button
                onClick={logout}
                className="bg-slate-800 hover:bg-rose-900/50 hover:text-rose-200 text-slate-300 px-2 py-1 rounded border border-slate-700 transition flex items-center gap-1"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-bold transition flex items-center gap-1 shadow"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In / Portal Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
